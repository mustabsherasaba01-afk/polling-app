import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PollCard({ poll, onVote }) {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const totalVotes = poll.options.reduce(
    (total, option) => total + option.votes,
    0
  );

  const handleVote = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedOption) {
      alert("Please select an option first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/polls/${poll._id}/vote`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            optionId: selectedOption,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to vote");
        return;
      }

      alert("Your vote has been submitted!");

      setSelectedOption("");

      if (onVote) {
        onVote(data.poll);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="poll-card">

      <div className="poll-card-top">
        <span className="poll-badge">
          LIVE POLL
        </span>

        <span className="vote-count">
          {totalVotes} votes
        </span>
      </div>

      <h2>{poll.question}</h2>

      <div className="options-container">

        {poll.options.map((option) => (
          <label
            className={`option ${
              selectedOption === option._id
                ? "option-selected"
                : ""
            }`}
            key={option._id}
          >

            <input
              type="radio"
              name={`poll-${poll._id}`}
              value={option._id}
              checked={selectedOption === option._id}
              onChange={(e) =>
                setSelectedOption(e.target.value)
              }
            />

            <span className="custom-radio"></span>

            <span className="option-text">
              {option.text}
            </span>

          </label>
        ))}

      </div>

      <button
        className="vote-button"
        onClick={handleVote}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Vote"}
      </button>

      <button
        className="results-button"
        onClick={() => navigate(`/poll/${poll._id}`)}
      >
        View Results →
      </button>

    </div>
  );
}

export default PollCard;