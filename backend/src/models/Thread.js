const fs = require('fs');

const { UserModel } = require('./User');
const { VoteModel } = require('./Vote');
const { PostModel } = require('./Post');

const cfg = require('../cfg');
const errors = require('../errors');

const mongoose = require('mongoose');

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

const ThreadModel = mongoose.model(
  'Thread',
  new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
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
      const posts = await PostModel.find({ threadId: this._id })
        .select('pic')
        .exec();
      await Promise.all(
        posts.map(async (post) => {
          if (fs.existsSync(`${cfg.STATIC_PATH}/pics/${post.pic}`)) {
            await fs.promises.unlink(`${cfg.STATIC_PATH}/pics/${post.pic}`);
          }
          await post.remove();
        })
      );
    })
);

module.exports = {
  ThreadModel,
  Thread,
};
