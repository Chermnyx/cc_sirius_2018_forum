const fs = require('fs');

const { UserModel } = require('./User');
const { VoteModel } = require('./Vote');
const { PostModel } = require('./Post');

const cfg = require('../cfg');
const errors = require('../errors');

const { Schema, model } = require('mongoose');

class Thread {
  async toClientJSON(userId) {
    return {
      _id: this._id,
      title: this.title,
      rating: this.rating,
      creator: (await UserModel.findById(this.creatorId).exec()).toClientJSON(),
      vote: (await VoteModel.find({ userId, threadId: this._id }).exec()).vote,
      creationDate: this.creationDate,
    };
  }
}

const ThreadModel = model(
  'Thread',
  new Schema({
    title: {
      type: String,
      required: true,
      maxlength: 64,
    },
    rating: {
      type: Number,
      default: () => 0,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    creationDate: {
      type: Date,
      default: () => new Date(),
    },
  })
    .loadClass(Thread)
    .pre('remove', async function() {
      await VoteModel.deleteMany({ threadId: this._id }).exec();
      await PostModel.deleteMany({ threadId: this._id }).exec();
    })
);

module.exports = {
  ThreadModel,
  Thread,
};
