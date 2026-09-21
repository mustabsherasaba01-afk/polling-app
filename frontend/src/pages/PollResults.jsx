import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { io } from "socket.io-client";


// =========================================
// API URL
// =========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


// =========================================
// SOCKET URL
// IMPORTANT: /api nahi lagana
// =========================================

const SOCKET_URL =
  "http://localhost:5000";


function PollResults() {
  const { pollId } = useParams();

  const navigate = useNavigate();


  // =========================================
  // STATES
  // =========================================

  const [poll, setPoll] =
    useState(null);

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


  // =========================================
  // CREATE ANONYMOUS ID
  // =========================================

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


  // =========================================
  // FETCH POLL FROM MONGODB
  // =========================================

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/polls/${pollId}`
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
      console.error(
        "FETCH POLL ERROR:",
        error
      );

      setError(
        "Unable to connect to server."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================
  // INITIAL POLL LOAD
  // =========================================

  useEffect(() => {
    fetchPoll();
  }, [pollId]);


  // =========================================
  // SOCKET.IO LIVE CONNECTION
  // =========================================

  useEffect(() => {

    console.log(
      "Connecting to Socket.IO..."
    );

    const socket =
      io(SOCKET_URL);


    // ---------------------------------------
    // SOCKET CONNECTED
    // ---------------------------------------

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    });


    // ---------------------------------------
    // LIVE POLL UPDATE
    // ---------------------------------------

    socket.on(
      "pollUpdated",
      (updatedPoll) => {

        console.log(
          "LIVE POLL UPDATE:",
          updatedPoll
        );


        /*
        Only update this poll
        */

        if (
          updatedPoll._id === pollId
        ) {
          setPoll(updatedPoll);
        }
      }
    );


    // ---------------------------------------
    // SOCKET DISCONNECTED
    // ---------------------------------------

    socket.on("disconnect", () => {
      console.log(
        "Socket disconnected"
      );
    });


    // ---------------------------------------
    // CLEANUP
    // ---------------------------------------

    return () => {
      socket.disconnect();
    };

  }, [pollId]);


  // =========================================
  // VOTE
  // =========================================

  const handleVote = async () => {

    if (!selectedOption) {

      setError(
        "Please select an option first."
      );

      return;
    }


    try {

      setSubmittingVote(true);

      setError("");

      setSuccess("");


      // Get browser ID

      const anonymousId =
        getAnonymousId();


      console.log(
        "Submitting vote..."
      );


      const response =
        await fetch(
          `${API_URL}/polls/${pollId}/vote`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              optionId:
                selectedOption,

              anonymousId:
                anonymousId,
            }),
          }
        );


      const data =
        await response.json();


      console.log(
        "VOTE RESPONSE:",
        data
      );


      // -------------------------------------
      // ERROR
      // -------------------------------------

      if (!response.ok) {

        setError(
          data.message ||
            "Unable to submit vote."
        );

        return;
      }


      // -------------------------------------
      // UPDATE CURRENT SCREEN
      // -------------------------------------

      setPoll(data.poll);


      // Remove selection

      setSelectedOption("");


      // Success

      setSuccess(
        "Your vote has been recorded successfully!"
      );


    } catch (error) {

      console.error(
        "VOTE ERROR:",
        error
      );

      setError(
        "Unable to connect to server."
      );

    } finally {

      setSubmittingVote(false);
    }
  };


  // =========================================
  // ADD COMMENT / OPINION
  // =========================================

  const handleComment = async (e) => {

    e.preventDefault();


    // ---------------------------------------
    // NAME VALIDATION
    // ---------------------------------------

    if (!name.trim()) {

      setError(
        "Please enter your name."
      );

      return;
    }


    // ---------------------------------------
    // COMMENT VALIDATION
    // ---------------------------------------

    if (!comment.trim()) {

      setError(
        "Please write your opinion."
      );

      return;
    }


    try {

      setSubmittingComment(true);

      setError("");

      setSuccess("");


      console.log(
        "Submitting opinion..."
      );


      const response =
        await fetch(
          `${API_URL}/polls/${pollId}/comments`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                name.trim(),

              text:
                comment.trim(),
            }),
          }
        );


      const data =
        await response.json();


      console.log(
        "COMMENT RESPONSE:",
        data
      );


      // ---------------------------------------
      // ERROR
      // ---------------------------------------

      if (!response.ok) {

        setError(
          data.message ||
            "Unable to post opinion."
        );

        return;
      }


      // ---------------------------------------
      // UPDATE CURRENT SCREEN
      // ---------------------------------------

      setPoll(data.poll);


      // Clear form

      setName("");

      setComment("");


      // Success

      setSuccess(
        "Your opinion has been posted."
      );


    } catch (error) {

      console.error(
        "COMMENT ERROR:",
        error
      );

      setError(
        "Unable to connect to server."
      );

    } finally {

      setSubmittingComment(false);
    }
  };


  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {

    return (
      <div className="poll-result-loading">

        <div className="loading-spinner">
          ⟳
        </div>

        <p>
          Loading poll...
        </p>

      </div>
    );
  }


  // =========================================
  // POLL NOT FOUND
  // =========================================

  if (!poll) {

    return (
      <div className="poll-result-loading">

        <h2>
          Poll not found
        </h2>

        {error && (
          <p className="poll-error">
            {error}
          </p>
        )}

        <button
          onClick={() =>
            navigate("/")
          }
          className="back-home-button"
        >
          Back Home
        </button>

      </div>
    );
  }


  // =========================================
  // TOTAL VOTES
  // =========================================

  const totalVotes =
    poll.options.reduce(
      (total, option) =>
        total + option.votes,
      0
    );


  // =========================================
  // UI
  // =========================================

  return (
    <div className="poll-result-page">

      <div className="poll-result-container">


        {/* =================================
            BACK BUTTON
        ================================= */}

        <button
          onClick={() =>
            navigate("/")
          }
          className="back-poll-button"
        >
          ← Back to Polls
        </button>


        {/* =================================
            POLL CARD
        ================================= */}

        <div className="poll-detail-card">


          {/* PUBLIC BADGE */}

          <div className="poll-detail-badge">
            ● PUBLIC POLL
          </div>


          {/* QUESTION */}

          <h1>
            {poll.question}
          </h1>


          {/* DESCRIPTION */}

          {poll.description && (
            <p className="poll-description">
              {poll.description}
            </p>
          )}


          {/* PUBLIC NOTICE */}

          <div className="public-vote-notice">
            ✓ No account required to vote
          </div>


          {/* TOTAL VOTES */}

          <div className="poll-total-votes">
            {totalVotes} total votes
          </div>


          {/* =================================
              OPTIONS
          ================================= */}

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

                    {/* OPTION TEXT */}

                    <div className="option-text-row">

                      <span>
                        {option.text}
                      </span>

                      <strong>
                        {percentage}%
                      </strong>

                    </div>


                    {/* PROGRESS BAR */}

                    <div className="result-progress">

                      <div
                        className="result-progress-fill"

                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>


                    {/* VOTE COUNT */}

                    <small>
                      {option.votes}{" "}
                      {option.votes === 1
                        ? "vote"
                        : "votes"}
                    </small>

                  </button>
                );
              }
            )}

          </div>


          {/* =================================
              SUBMIT VOTE
          ================================= */}

          <button
            className="submit-vote-button"

            onClick={handleVote}

            disabled={
              submittingVote
            }
          >

            {submittingVote
              ? "Submitting..."
              : "Submit My Vote"}

          </button>


          {/* ERROR */}

          {error && (
            <div className="poll-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="poll-success">
              {success}
            </div>
          )}

        </div>


        {/* =================================
            COMMENTS / OPINIONS
        ================================= */}

        <div className="comments-card">


          {/* COMMENTS HEADER */}

          <div className="comments-header">

            <div>

              <span>
                COMMUNITY OPINIONS
              </span>

              <h2>
                Share Your Opinion
              </h2>

            </div>


            {/* COMMENT COUNT */}

            <div className="comment-count">

              {poll.comments?.length ||
                0}

            </div>

          </div>


          {/* DESCRIPTION */}

          <p className="comments-description">
            No account is required. Enter
            your name and share your opinion
            respectfully.
          </p>


          {/* =================================
              COMMENT FORM
          ================================= */}

          <form
            onSubmit={
              handleComment
            }
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

              disabled={
                submittingComment
              }
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

              disabled={
                submittingComment
              }
            />


            {/* FORM BOTTOM */}

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


          {/* =================================
              COMMENTS LIST
          ================================= */}

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

                    {/* AVATAR */}

                    <div className="comment-avatar">

                      {item.name
                        ?.charAt(0)
                        .toUpperCase() ||
                        "U"}

                    </div>


                    {/* CONTENT */}

                    <div className="comment-content">

                      <div className="comment-user">

                        {item.name ||
                          "Anonymous"}


                        {/* DATE */}

                        {item.createdAt && (
                          <span>
                            {new Date(
                              item.createdAt
                            ).toLocaleDateString()}
                          </span>
                        )}

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