const mongoose = require("mongoose");

/*
=========================================
OPTION SCHEMA
=========================================
*/

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },

  votes: {
    type: Number,
    default: 0,
  },
});

/*
=========================================
COMMENT SCHEMA
=========================================
*/

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

/*
=========================================
POLL SCHEMA
=========================================
*/

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    options: {
      type: [optionSchema],

      required: true,

      validate: {
        validator: function (options) {
          return options.length >= 2;
        },

        message:
          "A poll must have at least 2 options.",
      },
    },

    /*
    Anonymous browser IDs
    used to prevent the same
    browser from voting again.
    */

    anonymousVoters: [
      {
        type: String,
      },
    ],

    /*
    Public opinions/comments
    */

    comments: {
      type: [commentSchema],

      default: [],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Poll",
  pollSchema
);