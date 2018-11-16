const fs = require('fs');

const { UserModel } = require('./User');

const cfg = require('../cfg');
const errors = require('../errors');

const mongoose = require('mongoose');

class Post {
  async toClientJSON() {
    return {
      _id: this._id,
      threadId: this.threadId.toString(),
      author: (await UserModel.findById(this.authorId).exec()).toClientJSON(),
      text: this.text,
      pic: fs.existsSync(`${cfg.STATIC_PATH}/pics/${this.pic}`)
        ? `${cfg.PICS_ROUTE}/${this.pic}`
        : undefined,
      creationDate: this.creationDate,
    };
  }
}

const PostModel = mongoose.model(
  'Post',
  new mongoose.Schema({
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      default: () => null,
    },
    pic: {
      // filename, auto-generated
      type: String,
      default: () => new Date().toISOString() + Math.random().toString(),
    },
    creationDate: {
      type: Date,
      default: () => new Date(),
    },
  })
    .loadClass(Post)
    .pre('remove', async function() {
      if (fs.existsSync(`${cfg.STATIC_PATH}/pics/${this.pic}`)) {
        await fs.promises.unlink(`${cfg.STATIC_PATH}/pics/${this.pic}`);
      }
    })
);

module.exports = {
  PostModel,
  Post,
};
