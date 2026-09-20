const express = require("express");

const {
  getOpinions,
  createOpinion,
} = require("../controllers/opinionController");

const router = express.Router();


// GET OPINIONS
router.get("/", getOpinions);


// POST OPINION
router.post("/", createOpinion);


module.exports = router;