const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

const errors = require('../errors');

const mongoose = require('mongoose');

class User {
  static hashPassword(password) {
    return crypto
      .createHash('sha512')
      .update(password)
      .digest('hex');
  }

  static async create(email, username, password) {
    if (await UserModel.findOne({ $or: [{ email }, { username }] }).exec())
      throw new errors.UserExistError(email, username);

    return await new UserModel({
      email,
      username,
      passwordHash: this.hashPassword(password),
    }).save();
  }

  async updateToken() {
    this.tokenExpires = new Date(new Date().getTime() + 86400000); // now + 1 day
    this.token = uuidv4();
    await this.save();
    return this.token;
  }

  static async login(email, password) {
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      throw new errors.UserNotFoundError(email);
    }

    const passwordHash = User.hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      throw new errors.InvalidPasswordError();
    }

    const token = await user.updateToken();

    return token;
  }

  async logout() {
    this.token = null;
    await this.save();
  }

  /**
   * @param {string} token
   * @returns {Promise<User>} authenticated user
   */
  static async authenticate(token) {
    const user = await UserModel.findOne({ token });

    if (
      user &&
      user.token === token &&
      new Date().valueOf() < user.tokenExpires.valueOf()
    ) {
      return user;
    } else {
      throw new errors.TokenExpiredError();
    }
  }

  toClientJSON() {
    return {
      _id: this._id,
      email: this.email,
      username: this.username,
    };
  }
}

const UserModel = mongoose.model(
  'User',
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      index: true,
      unique: false,
      default: () => null,
    },
    tokenExpires: {
      type: Date,
      default: () => new Date(1),
    },
  }).loadClass(User)
);

module.exports = {
  UserModel,
  User,
};
