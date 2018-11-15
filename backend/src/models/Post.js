const fs = require('fs');

const { UserModel } = require('./User');

const cfg = require('../cfg');
const errors = require('../errors');

const { Schema, model } = require('mongoose');

class Post {
  async toClientJSON() {
    const picPath = `${cfg.PICS_ROUTE}/${this.pic}`;
    return {
      _id: this._id,
      threadId: this.threadId.toString(),
      author: await UserModel.findById(this.authorId).exec(),
      text: this.text,
      pic: fs.existsSync(picPath) ? picPath : undefined,
      creationDate: this.creationDate,
    };
  }
}

const PostModel = model(
  'Post',
  new Schema({
    threadId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
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
  }).loadClass(Post)
);

module.exports = {
  PostModel,
  Post,
};
