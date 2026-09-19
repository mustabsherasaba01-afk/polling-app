import React, { useState } from "react";
import "./Home.css";

const pollOptions = [
  {
    id: 1,
    title: "Oppose the Levy",
    subtitle: "I do not support the Petroleum Development Levy.",
    emoji: "✋",
    type: "oppose",
  },
  {
    id: 2,
    title: "Support the Levy",
    subtitle: "I support the Petroleum Development Levy.",
    emoji: "👍",
    type: "support",
  },
  {
    id: 3,
    title: "Support With Changes",
    subtitle: "I support it with some changes or conditions.",
    emoji: "🔄",
    type: "changes",
  },
  {
    id: 4,
    title: "Need More Information",
    subtitle: "I need more information before deciding.",
    emoji: "🤔",
    type: "neutral",
  },
];

const initialComments = [
  {
    id: 1,
    name: "Anonymous",
    text: "People should have a chance to share their opinions.",
    time: "2 min ago",
  },
  {
    id: 2,
    name: "Anonymous",
    text: "More awareness and information can help people understand the issue.",
    time: "5 min ago",
  },
  {
    id: 3,
    name: "Anonymous",
    text: "Public opinion matters when discussing important policies.",
    time: "8 min ago",
  },
];

const governmentMessages = [
  "Apny rights aur opinions ke liye respectfully bolo.",
  "Apni awaaz ko responsible aur informed tareeqay se use karo.",
  "Apni opinion share karna civic participation ka hissa hai.",
  "Jo baat important lagti hai, us par apni rai share karo.",
  "Apne questions poochna aur information lena important hai.",
  "Apni concerns ko respectfully express karo.",
  "Informed opinion ke liye reliable information check karo.",
  "Apni community ke issues par awaaz uthao.",
  "Aapki feedback public discussion ka hissa ban sakti hai.",
  "Apni rai dene se pehle facts ko samajhna helpful hota hai.",
  "Questions hain? Unhein respectfully raise karo.",
  "Apni concerns ko clearly aur peacefully communicate karo.",
  "Public issues par apni position khud decide karo.",
  "Apni voice ko responsible way mein use karo.",
  "Stay informed, ask questions, and share your perspective.",
];

const voteMessages = {
  oppose: [
    "You chose to oppose the Petroleum Development Levy. Your position has been recorded.",
    "Your response reflects opposition to the levy. Thanks for sharing your view.",
    "You spoke up against the levy. Your anonymous response has been counted.",
    "Your choice to oppose the levy has been recorded successfully.",
    "Your voice represents your position on the Petroleum Development Levy.",
    "You have made your position clear — opposed to the levy.",
    "Your anonymous response has been added to the opposition side of the poll.",
    "Your vote has been counted. Thanks for participating in the discussion.",
    "You chose to speak against the levy. Your opinion is now part of the results.",
    "Your position has been submitted successfully. ✋",
  ],

  support: [
    "You chose to support the Petroleum Development Levy. Your position has been recorded.",
    "Your response reflects support for the levy. Thanks for sharing your view.",
    "You spoke up in support of the levy. Your anonymous response has been counted.",
    "Your choice to support the levy has been recorded successfully.",
    "Your voice represents your position on the Petroleum Development Levy.",
    "You have made your position clear — supportive of the levy.",
    "Your anonymous response has been added to the support side of the poll.",
    "Your vote has been counted. Thanks for participating in the discussion.",
    "You chose to speak in favor of the levy. Your opinion is now part of the results.",
    "Your position has been submitted successfully. 👍",
  ],

  changes: [
    "You support the levy with changes. Your position has been recorded.",
    "Your response shows conditional support for the levy.",
    "You chose to support the levy with some changes — your view has been counted.",
    "Your position on changing the levy has been submitted successfully.",
    "Your anonymous response reflects support with conditions.",
    "You shared a middle-ground position. Your response is now part of the results.",
    "Your vote for changes to the levy has been recorded.",
    "Your perspective has been counted in the poll. 🔄",
  ],

  neutral: [
    "You chose to get more information before deciding. Your response has been recorded.",
    "Your choice shows that you want more information before forming an opinion.",
    "Your response has been counted under 'Need More Information.'",
    "You chose to stay informed before taking a position. Your vote is recorded.",
    "Your anonymous response has been successfully submitted.",
    "Your perspective has been added to the results. 🤔",
  ],
};

function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  const [notification, setNotification] = useState("");

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const [governmentMessage, setGovernmentMessage] = useState("");
  const [usedGovernmentMessages, setUsedGovernmentMessages] = useState([]);

  const results = [
    {
      label: "Oppose the Levy",
      percentage: 35,
    },
    {
      label: "Support the Levy",
      percentage: 30,
    },
    {
      label: "Support With Changes",
      percentage: 25,
    },
    {
      label: "Need More Information",
      percentage: 10,
    },
  ];

  const scrollToPoll = () => {
    document
      .getElementById("poll")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToOpinions = () => {
    document
      .getElementById("opinions")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGovernmentClick = () => {
    let availableMessages = governmentMessages.filter(
      (message) => !usedGovernmentMessages.includes(message)
    );

    if (availableMessages.length === 0) {
      availableMessages = governmentMessages;
      setUsedGovernmentMessages([]);
    }

    const randomIndex = Math.floor(
      Math.random() * availableMessages.length
    );

    const selectedMessage = availableMessages[randomIndex];

    setGovernmentMessage(selectedMessage);

    setUsedGovernmentMessages((previous) => [
      ...previous,
      selectedMessage,
    ]);
  };

  const handleVote = () => {
    if (!selectedOption) {
      setNotification("Please select an option first.");
      return;
    }

    setShowStamp(true);

    const selectedVote = pollOptions.find(
      (option) => option.id === selectedOption
    );

    const messages = voteMessages[selectedVote.type];

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = messages[randomIndex];

    setTimeout(() => {
      setVoted(true);
      setShowStamp(false);
      setNotification(randomMessage);
    }, 900);
  };

  const resetVote = () => {
    setSelectedOption(null);
    setVoted(false);
    setNotification("");
  };

  const handleComment = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    const newComment = {
      id: Date.now(),
      name: "Anonymous",
      text: comment.trim(),
      time: "Just now",
    };

    setComments((previous) => [newComment, ...previous]);

    setComment("");
  };

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
  <div className="nav-inner">

    {/* LEFT SIDE - VOXPOLL */}
    <div className="nav-logo">
      <span className="logo-icon">✦</span>
      <span>VoxPoll</span>
    </div>

    {/* CENTER - LINKS */}
    <div className="nav-links">
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        Home
      </button>

      <button onClick={scrollToPoll}>
        Poll
      </button>

      <button onClick={scrollToOpinions}>
        Opinions
      </button>
    </div>

    {/* RIGHT SIDE - BUTTON */}
    <div className="nav-action">
      <button onClick={scrollToPoll}>
        Vote Now →
      </button>
    </div>

  </div>
</nav>

      {/* ================= HERO ================= */}

      <section className="home-hero">

        <div className="hero-content">

          <span className="hero-badge">
            ✦ YOUR VOICE MATTERS
          </span>

          <h1>
            Speak up.
            <br />
            <span>Be heard.</span>
          </h1>

          <p>
            Share your opinion, explore what others think,
            and take part in meaningful public discussions.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={scrollToPoll}
            >
              Vote Now →
            </button>

            <button
              className="secondary-btn"
              onClick={scrollToOpinions}
            >
              See Opinions
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <strong>100%</strong>
              <span>Anonymous</span>
            </div>

            <div>
              <strong>1 Vote</strong>
              <span>Per Person</span>
            </div>

            <div>
              <strong>Real</strong>
              <span>Opinions</span>
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-poll-preview">

            <div className="preview-top">
              <span>LIVE POLL</span>
              <span className="live-dot"></span>
            </div>

            <h3>
              What is your opinion
              <br />
              on the Petroleum
              <br />
              Development Levy?
            </h3>

            <div className="preview-option">
              <span>✋</span>
              <p>Oppose the Levy</p>
            </div>

            <div className="preview-option">
              <span>👍</span>
              <p>Support the Levy</p>
            </div>

            <div className="preview-option">
              <span>🔄</span>
              <p>Support With Changes</p>
            </div>

            <div className="preview-footer">
              <span>●</span>
              Anonymous voting
            </div>

          </div>

        </div>

      </section>

      {/* ================= VOICE CARDS ================= */}

      <section className="voice-cards-section">

        <div className="voice-cards-container">

          {/* AWAM CARD */}

          <button
            className="voice-card public-card"
            onClick={scrollToPoll}
          >

            <div className="voice-card-icon">
              👥
            </div>

            <div className="voice-card-content">

              <span className="voice-card-tag">
                PUBLIC
              </span>

              <h3>
                Awam
              </h3>

              <p>
                Share your opinion and take part in the public poll.
              </p>

            </div>

            <div className="voice-card-arrow">
              →
            </div>

          </button>

          {/* GOVERNMENT CARD */}

          <button
            className="voice-card government-card"
            onClick={handleGovernmentClick}
          >

            <div className="voice-card-icon">
              🏛️
            </div>

            <div className="voice-card-content">

              <span className="voice-card-tag">
                GOVERNMENT
              </span>

              <h3>
                Government
              </h3>

              <p>
                Tap here to see a civic message.
              </p>

            </div>

            <div className="voice-card-arrow">
              →
            </div>

          </button>

        </div>

        {/* GOVERNMENT POPUP */}

        {governmentMessage && (
          <div className="government-popup">

            <div className="government-popup-icon">
              🏛️
            </div>

            <div className="government-message-bubble">

              <span className="government-label">
                GOVERNMENT MESSAGE
              </span>

              <strong>
                {governmentMessage}
              </strong>

              <button
                className="close-government-popup"
                onClick={() => setGovernmentMessage("")}
              >
                ×
              </button>

            </div>

          </div>
        )}

      </section>

      {/* ================= TRENDING ================= */}

      <section className="trending-section">

        <div className="trending-inner">

          <div className="trending-icon">
            🔥
          </div>

          <div>
            <span className="trending-label">
              TRENDING NOW
            </span>

            <h3>
              Petroleum Development Levy Poll
            </h3>
          </div>

          <button onClick={scrollToPoll}>
            Join the poll →
          </button>

        </div>

      </section>

      {/* ================= POLL ================= */}

      <section
        className="poll-section"
        id="poll"
      >

        <div className="poll-intro">

          <span className="section-tag">
            PUBLIC POLL
          </span>

          <h2>
            What is your opinion?
          </h2>

          <p>
            Choose the option that best represents
            your current position.
          </p>

          <div className="anonymous-note">
            🔒 Your response is anonymous.
          </div>

        </div>

        <div className="poll-box">

          {!voted ? (

            <>
              <div className="poll-question">

                

                <h3>
                  What is your position on the
                  Petroleum Development Levy?
                </h3>

              </div>

              <div className="vote-options">

                {pollOptions.map((option) => (

                  <button
                    key={option.id}
                    className={`vote-choice ${
                      selectedOption === option.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedOption(option.id)
                    }
                  >

                    <div className="choice-emoji">
                      {option.emoji}
                    </div>

                    <div className="choice-content">

                      <strong>
                        {option.title}
                      </strong>

                      <span>
                        {option.subtitle}
                      </span>

                    </div>

                    <div className="choice-check">
                      {selectedOption === option.id
                        ? "✓"
                        : ""}
                    </div>

                  </button>

                ))}

              </div>

              <button
                className="vote-submit"
                onClick={handleVote}
              >
                Submit My Vote →
              </button>

              {notification && (
                <p className="vote-notification">
                  {notification}
                </p>
              )}

            </>

          ) : (

            <div className="vote-success">

              <div className="success-icon">
                ✓
              </div>

              <span className="section-tag">
                VOTE SUBMITTED
              </span>

              <h3>
                {pollOptions.find(
                  (option) =>
                    option.id === selectedOption
                )?.type === "support"
                  ? "You chose to support the levy."
                  : pollOptions.find(
                      (option) =>
                        option.id === selectedOption
                    )?.type === "oppose"
                  ? "You chose to oppose the levy."
                  : pollOptions.find(
                      (option) =>
                        option.id === selectedOption
                    )?.type === "changes"
                  ? "You chose support with changes."
                  : "You chose to learn more first."}
              </h3>

              {/* POST VOTE MESSAGE */}

              <div className="vote-message-popup">

                <div className="message-emoji">
                  {
                    pollOptions.find(
                      (option) =>
                        option.id === selectedOption
                    )?.emoji
                  }
                </div>

                <div className="message-bubble">

                  <span className="message-small">
                    {
                      pollOptions.find(
                        (option) =>
                          option.id === selectedOption
                      )?.type === "support"
                        ? "YOUR CHOICE 👍"
                        : pollOptions.find(
                            (option) =>
                              option.id === selectedOption
                          )?.type === "oppose"
                        ? "YOUR CHOICE ✋"
                        : pollOptions.find(
                            (option) =>
                              option.id === selectedOption
                          )?.type === "changes"
                        ? "YOUR CHOICE 🔄"
                        : "YOUR CHOICE 🤔"
                    }
                  </span>

                  <strong>
                    {notification}
                  </strong>

                  <span className="message-arrow"></span>

                </div>

              </div>

              <button
                className="again-btn"
                onClick={resetVote}
              >
                Vote Again
              </button>

            </div>

          )}

          {/* STAMP */}

          {showStamp && (
            <div className="vote-stamp">
              ✓
            </div>
          )}

        </div>

      </section>

      {/* ================= RESULTS ================= */}

      <section className="results-section">

        <div className="results-container">

          <div className="results-heading">

            <span className="section-tag">
              LIVE RESULTS
            </span>

            <h2>
              What people are saying
            </h2>

            <p>
              Current sample results from poll participants.
            </p>

          </div>

          <div className="results-card">

            {results.map((result) => (

              <div
                className="result-row"
                key={result.label}
              >

                <div className="result-info">

                  <span>
                    {result.label}
                  </span>

                  <strong>
                    {result.percentage}%
                  </strong>

                </div>

                <div className="result-bar">

                  <div
                    className="result-fill"
                    style={{
                      width: `${result.percentage}%`,
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= OPINIONS ================= */}

      <section
        className="opinions-section"
        id="opinions"
      >

        <div className="opinions-container">

          <div className="opinions-heading">

            <span className="section-tag">
              COMMUNITY VOICES
            </span>

            <h2>
              Share your opinion
            </h2>

            <p>
              What do you think? Share your thoughts anonymously.
            </p>

          </div>

          <form
            className="comment-form"
            onSubmit={handleComment}
          >

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your opinion here..."
              rows="4"
            />

            <button type="submit">
              Post Opinion →
            </button>

          </form>

          <div className="comments-list">

            {comments.map((item) => (

              <div
                className="comment-card"
                key={item.id}
              >

                <div className="comment-avatar">
                  👤
                </div>

                <div className="comment-content">

                  <div className="comment-top">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.time}
                    </span>

                  </div>

                  <p>
                    {item.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="footer-inner">

          <div className="footer-logo">
            <span>✦</span>
            Poll
          </div>

          <p>
            Your voice. Your opinion. Your choice.
          </p>

          <span>
            © 2026 Poll
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;