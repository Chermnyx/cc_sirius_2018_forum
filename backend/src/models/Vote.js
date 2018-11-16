const errors = require('../errors');

const mongoose = require('mongoose');

class Vote {}

const VoteModel = mongoose.model(
  'Vote',
  new mongoose.Schema({
    vote: {
      type: Number,
      required: true,
    },
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  }).loadClass(Vote)
);

module.exports = {
  VoteModel,
  Vote,
};
