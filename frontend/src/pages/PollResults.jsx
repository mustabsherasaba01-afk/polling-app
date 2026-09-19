import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PollResults() {
  const { pollId } = useParams();

  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);

  const [selectedOption, setSelectedOption] =
    useState("");

  const [name, setName] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submittingVote, setSubmittingVote] =
    useState(false);

  const [submittingComment, setSubmittingComment] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =================================
  // CREATE ANONYMOUS ID
  // =================================

  const getAnonymousId = () => {
    let anonymousId =
      localStorage.getItem(
        "pollify_anonymous_id"
      );

    if (!anonymousId) {
      anonymousId =
        crypto.randomUUID();

      localStorage.setItem(
        "pollify_anonymous_id",
        anonymousId
      );
    }

    return anonymousId;
  };

  // =================================
  // GET POLL
  // =================================

  const fetchPoll = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/polls/${pollId}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to load poll."
        );

        return;
      }

      setPoll(data.poll);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  // =================================
  // VOTE
  // =================================

  const handleVote = async () => {
    if (!selectedOption) {
      setError(
        "Please select an option first."
      );

      return;
    }

    setSubmittingVote(true);

    setError("");

    setSuccess("");

    try {
      const anonymousId =
        getAnonymousId();

      const response = await fetch(
        `http://localhost:5000/api/polls/${pollId}/vote`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            optionId:
              selectedOption,

            anonymousId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to submit vote."
        );

        return;
      }

      setPoll(data.poll);

      setSuccess(
        "Your vote has been recorded successfully!"
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to server."
      );
    } finally {
      setSubmittingVote(false);
    }
  };

  // =================================
  // COMMENT
  // =================================

  const handleComment = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(
        "Please enter your name."
      );

      return;
    }

    if (!comment.trim()) {
      setError(
        "Please write your opinion."
      );

      return;
    }

    setSubmittingComment(true);

    setError("");

    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/polls/${pollId}/comments`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            text: comment.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to post opinion."
        );

        return;
      }

      setPoll(data.poll);

      setName("");

      setComment("");

      setSuccess(
        "Your opinion has been posted."
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to server."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  // =================================
  // LOADING
  // =================================

  if (loading) {
    return (
      <div className="poll-result-loading">
        Loading poll...
      </div>
    );
  }

  // =================================
  // POLL NOT FOUND
  // =================================

  if (!poll) {
    return (
      <div className="poll-result-loading">
        <h2>Poll not found</h2>

        <button
          onClick={() => navigate("/")}
          className="back-home-button"
        >
          Back Home
        </button>
      </div>
    );
  }

  // =================================
  // TOTAL VOTES
  // =================================

  const totalVotes =
    poll.options.reduce(
      (total, option) =>
        total + option.votes,
      0
    );

  return (
    <div className="poll-result-page">

      <div className="poll-result-container">

        {/* BACK */}

        <button
          onClick={() => navigate("/")}
          className="back-poll-button"
        >
          ← Back to Polls
        </button>


        {/* POLL */}

        <div className="poll-detail-card">

          <div className="poll-detail-badge">
            ● PUBLIC POLL
          </div>

          <h1>
            {poll.question}
          </h1>

          {poll.description && (
            <p className="poll-description">
              {poll.description}
            </p>
          )}

          <div className="public-vote-notice">
            ✓ No account required to vote
          </div>

          <div className="poll-total-votes">
            {totalVotes} total votes
          </div>


          {/* OPTIONS */}

          <div className="poll-voting-options">

            {poll.options.map(
              (option) => {

                const percentage =
                  totalVotes > 0
                    ? Math.round(
                        (option.votes /
                          totalVotes) *
                          100
                      )
                    : 0;

                return (
                  <button
                    key={option._id}
                    className={`poll-voting-option ${
                      selectedOption ===
                      option._id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedOption(
                        option._id
                      )
                    }
                  >

                    <div className="option-text-row">

                      <span>
                        {option.text}
                      </span>

                      <strong>
                        {percentage}%
                      </strong>

                    </div>

                    <div className="result-progress">

                      <div
                        className="result-progress-fill"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      ></div>

                    </div>

                    <small>
                      {option.votes} votes
                    </small>

                  </button>
                );
              }
            )}

          </div>


          <button
            className="submit-vote-button"
            onClick={handleVote}
            disabled={submittingVote}
          >
            {submittingVote
              ? "Submitting..."
              : "Submit My Vote"}
          </button>


          {error && (
            <div className="poll-error">
              {error}
            </div>
          )}

          {success && (
            <div className="poll-success">
              {success}
            </div>
          )}

        </div>


        {/* COMMENTS */}

        <div className="comments-card">

          <div className="comments-header">

            <div>

              <span>
                COMMUNITY OPINIONS
              </span>

              <h2>
                Share Your Opinion
              </h2>

            </div>

            <div className="comment-count">
              {poll.comments?.length ||
                0}
            </div>

          </div>


          <p className="comments-description">
            No account is required. Enter
            your name and share your opinion
            respectfully.
          </p>


          <form
            onSubmit={handleComment}
            className="comment-form"
          >

            {/* NAME */}

            <input
              type="text"
              className="comment-name-input"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Your name"
              maxLength={50}
            />


            {/* OPINION */}

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="Write your opinion about the Petroleum Development Levy..."
              maxLength={500}
            />


            <div className="comment-form-bottom">

              <span>
                {comment.length}/500
              </span>

              <button
                type="submit"
                disabled={
                  submittingComment
                }
              >
                {submittingComment
                  ? "Posting..."
                  : "Post Opinion"}
              </button>

            </div>

          </form>


          {/* COMMENTS */}

          <div className="comments-list">

            {poll.comments &&
            poll.comments.length > 0 ? (

              poll.comments
                .slice()
                .reverse()
                .map((item) => (

                  <div
                    className="comment-item"
                    key={item._id}
                  >

                    <div className="comment-avatar">

                      {item.name
                        ?.charAt(0)
                        .toUpperCase() ||
                        "U"}

                    </div>


                    <div className="comment-content">

                      <div className="comment-user">

                        {item.name ||
                          "Anonymous"}

                        <span>
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      <p>
                        {item.text}
                      </p>

                    </div>

                  </div>

                ))

            ) : (

              <div className="no-comments">

                <div>
                  💬
                </div>

                <h3>
                  No opinions yet
                </h3>

                <p>
                  Be the first person to
                  share an opinion.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default PollResults;