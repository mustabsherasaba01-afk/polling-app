const Poll = require("../models/poll");

// =================================
// CREATE POLL
// =================================

const createPoll = async (req, res) => {
  try {
    const {
      question,
      description,
      options,
    } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    if (!options || !Array.isArray(options)) {
      return res.status(400).json({
        message: "Options must be an array",
      });
    }

    if (options.length < 2) {
      return res.status(400).json({
        message:
          "Poll must have at least 2 options",
      });
    }

    const cleanedOptions = options
      .filter(
        (option) =>
          option &&
          option.trim() !== ""
      )
      .map((option) => ({
        text: option.trim(),
        votes: 0,
      }));

    if (cleanedOptions.length < 2) {
      return res.status(400).json({
        message:
          "Poll must have at least 2 valid options",
      });
    }

    const poll = await Poll.create({
      question: question.trim(),

      description:
        description?.trim() || "",

      options: cleanedOptions,

      anonymousVoters: [],

      comments: [],
    });

    res.status(201).json({
      message:
        "Poll created successfully",

      poll,
    });
  } catch (error) {
    console.error(
      "Create poll error:",
      error
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =================================
// GET ALL POLLS
// =================================

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: polls.length,
      polls,
    });
  } catch (error) {
    console.error(
      "Get polls error:",
      error
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =================================
// GET SINGLE POLL
// =================================

const getPollById = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(
      pollId
    );

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    res.status(200).json({
      poll,
    });
  } catch (error) {
    console.error(
      "Get poll error:",
      error
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =================================
// PUBLIC ANONYMOUS VOTE
// =================================

const voteOnPoll = async (req, res) => {
  try {
    const { pollId } = req.params;

    const {
      optionId,
      anonymousId,
    } = req.body;

    // Check anonymous ID

    if (!anonymousId) {
      return res.status(400).json({
        message:
          "Anonymous ID is required",
      });
    }

    // Check option

    if (!optionId) {
      return res.status(400).json({
        message:
          "Option ID is required",
      });
    }

    // Find poll

    const poll = await Poll.findById(
      pollId
    );

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    // Check duplicate vote

    const alreadyVoted =
      poll.anonymousVoters.includes(
        anonymousId
      );

    if (alreadyVoted) {
      return res.status(400).json({
        message:
          "You have already voted in this poll.",
      });
    }

    // Find selected option

    const selectedOption =
      poll.options.id(optionId);

    if (!selectedOption) {
      return res.status(400).json({
        message:
          "Invalid poll option",
      });
    }

    // Add vote

    selectedOption.votes += 1;

    // Store anonymous voter

    poll.anonymousVoters.push(
      anonymousId
    );

    await poll.save();

    res.status(200).json({
      message:
        "Your vote has been recorded.",

      poll,
    });
  } catch (error) {
    console.error(
      "Vote error:",
      error
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =================================
// PUBLIC COMMENT
// =================================

const addComment = async (req, res) => {
  try {
    const {
      name,
      text,
    } = req.body;

    const { pollId } = req.params;

    // Validate name

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message:
          "Please enter your name.",
      });
    }

    // Validate comment

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message:
          "Please write your opinion.",
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        message:
          "Opinion cannot exceed 500 characters.",
      });
    }

    // Find poll

    const poll = await Poll.findById(
      pollId
    );

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    // Add comment

    poll.comments.push({
      name: name.trim(),
      text: text.trim(),
    });

    await poll.save();

    res.status(201).json({
      message:
        "Your opinion has been posted.",

      poll,
    });
  } catch (error) {
    console.error(
      "Comment error:",
      error
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =================================
// EXPORT
// =================================

module.exports = {
  createPoll,
  getPolls,
  getPollById,
  voteOnPoll,
  addComment,
};