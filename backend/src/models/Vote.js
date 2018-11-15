const errors = require('../errors');

const { Schema, model } = require('mongoose');

class Vote {}

const VoteModel = model(
  'Vote',
  new Schema({
    vote: {
      type: Number,
      required: true,
    },
    threadId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
  }).loadClass(Vote)
);

module.exports = {
  VoteModel,
  Vote,
};
