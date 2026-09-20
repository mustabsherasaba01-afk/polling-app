const Opinion = require("../models/opinion");


// ================================
// GET ALL OPINIONS
// ================================

const getOpinions = async (req, res) => {
  try {
    const opinions = await Opinion.find()
      .sort({ createdAt: -1 });

    res.status(200).json(opinions);
  } catch (error) {
    console.error("GET OPINIONS ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ================================
// CREATE OPINION
// ================================

const createOpinion = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Opinion cannot be empty",
      });
    }

    const opinion = await Opinion.create({
      name: "Anonymous",
      text: text.trim(),
    });

    res.status(201).json({
      message: "Opinion posted successfully",
      opinion,
    });
  } catch (error) {
    console.error("CREATE OPINION ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getOpinions,
  createOpinion,
};