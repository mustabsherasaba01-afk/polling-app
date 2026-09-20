const mongoose = require("mongoose");

const opinionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Anonymous",
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Opinion",
  opinionSchema
);