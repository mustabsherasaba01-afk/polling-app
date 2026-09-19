import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePoll() {
  const navigate = useNavigate();

  const [question, setQuestion] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [options, setOptions] =
    useState(["", ""]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =================================
  // ADD OPTION
  // =================================

  const addOption = () => {
    setOptions([
      ...options,
      "",
    ]);
  };

  // =================================
  // REMOVE OPTION
  // =================================

  const removeOption = (index) => {
    if (options.length <= 2) {
      return;
    }

    setOptions(
      options.filter(
        (_, i) => i !== index
      )
    );
  };

  // =================================
  // CHANGE OPTION
  // =================================

  const updateOption = (
    index,
    value
  ) => {
    const updatedOptions = [
      ...options,
    ];

    updatedOptions[index] = value;

    setOptions(updatedOptions);
  };

  // =================================
  // CREATE POLL
  // =================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validOptions =
      options
        .map((option) =>
          option.trim()
        )
        .filter(
          (option) => option !== ""
        );

    if (!question.trim()) {
      setError(
        "Please enter a question."
      );

      return;
    }

    if (validOptions.length < 2) {
      setError(
        "Please provide at least 2 options."
      );

      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/polls",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            question:
              question.trim(),

            description:
              description.trim(),

            options:
              validOptions,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to create poll."
        );

        return;
      }

      navigate(
        `/poll/${data.poll._id}`
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-poll-page">

      <div className="create-poll-card">

        <div className="section-label">
          CREATE
        </div>

        <h1>
          Create a Poll
        </h1>

        <p>
          Ask a question and collect
          opinions from your community.
        </p>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
        >

          {/* QUESTION */}

          <div className="form-group">

            <label>
              Poll Question
            </label>

            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              placeholder="What would you like to ask?"
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
              <span
                style={{
                  color: "#94a3b8",
                  fontWeight: "400",
                  fontSize: "11px",
                  marginLeft: "6px",
                }}
              >
                Optional
              </span>
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Add some context about your poll..."
              rows="4"
              style={{
                width: "100%",
                padding: "13px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "10px",
                resize: "vertical",
                outline: "none",
                fontFamily:
                  "inherit",
              }}
            />

          </div>


          {/* OPTIONS */}

          <div className="form-group">

            <label>
              Poll Options
            </label>

            {options.map(
              (option, index) => (

                <div
                  className="option-row"
                  key={index}
                >

                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      updateOption(
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`Option ${
                      index + 1
                    }`}
                  />

                  {options.length >
                    2 && (

                    <button
                      type="button"
                      className="remove-option"
                      onClick={() =>
                        removeOption(
                          index
                        )
                      }
                    >
                      ×
                    </button>

                  )}

                </div>

              )
            )}

          </div>


          <button
            type="button"
            className="add-option"
            onClick={addOption}
          >
            + Add Option
          </button>


          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Poll"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreatePoll;