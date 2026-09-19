const express = require("express");

const {
  createPoll,
  getPolls,
  getPollById,
  voteOnPoll,
  addComment,
} = require("../controllers/pollController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =================================
// PUBLIC ROUTES
// =================================

// Get all polls
router.get("/", getPolls);

// Get single poll
router.get("/:pollId", getPollById);

// =================================
// PROTECTED ROUTE
// =================================

// Only logged-in users can CREATE polls

router.post(
  "/",
  authMiddleware,
  createPoll
);

// =================================
// PUBLIC VOTE
// =================================

router.post(
  "/:pollId/vote",
  voteOnPoll
);

// =================================
// PUBLIC COMMENT
// =================================

router.post(
  "/:pollId/comments",
  addComment
);

module.exports = router;