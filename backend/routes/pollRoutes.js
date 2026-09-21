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

/*
=========================================
PUBLIC
=========================================
*/

router.get("/", getPolls);

router.get(
  "/:pollId",
  getPollById
);

/*
=========================================
PROTECTED
=========================================
*/

router.post(
  "/",
  authMiddleware,
  createPoll
);

/*
=========================================
PUBLIC VOTE
=========================================
*/

router.post(
  "/:pollId/vote",
  voteOnPoll
);

/*
=========================================
PUBLIC COMMENT
=========================================
*/

router.post(
  "/:pollId/comments",
  addComment
);

module.exports = router;