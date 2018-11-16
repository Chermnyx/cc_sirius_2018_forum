const Joi = require('joi');
const router = require('express').Router();

const cfg = require('./cfg');
const errors = require('./errors');
const { User } = require('./models/User');
const { VoteModel } = require('./models/Vote');
const { PostModel } = require('./models/Post');
const { ThreadModel } = require('./models/Thread');

function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
}

function validate(object, schema) {
  const { error, value } = Joi.validate(object, schema, {
    abortEarly: false,
    presence: 'required',
    skipFunctions: true,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    throw new errors.ValidationError(error);
  }

  return value;
}

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    next(new errors.UnauthorizedError());
    return;
  }

  const match = auth.match(/^Bearer (?<token>.+)$/);
  if (!match) {
    next(new errors.UnauthorizedError());
    return;
  }

  const token = match.groups.token;
  User.authenticate(token)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => next(err));
}

router.post(
  '/api/register',
  asyncHandler(async (req, res) => {
    const { email, username, password } = validate(req.body, {
      email: Joi.string().email(),
      username: Joi.string().regex(/^[a-zA-Z0-9]{3,10}$/),
      password: Joi.string()
        .min(8)
        .max(128),
    });

    const user = await User.create(email, username, password);
    const token = await user.updateToken();
    res.json(token);
  })
);

router.post(
  '/api/login',
  asyncHandler(async (req, res) => {
    const { email, password } = validate(req.body, {
      email: Joi.string().email(),
      password: Joi.string().max(128),
    });

    const token = await User.login(email, password);

    res.json(token);
  })
);

router.post(
  '/api/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    req.user.token = null;
    await req.user.save();
    res.json(true);
  })
);

router.post(
  '/api/vote',
  authenticate,
  asyncHandler(async (req, res) => {
    const { threadId, vote } = validate(req.body, {
      threadId: Joi.string().regex(cfg.objectIdRegex),
      vote: Joi.valid([-1, 1]),
    });

    const thread = await ThreadModel.findById(threadId).exec();
    if (!thread) throw new errors.ThreadNotFoundError(threadId);

    const dbVote = await VoteModel.findOne({
      threadId,
      userId: this.user._id,
    }).exec();
    if (!dbVote) {
      thread.rating += vote;
      await Promise.all([
        thread.save(),
        new VoteModel({ threadId, userId: this.user._id, vote }).save(),
      ]);

      res.json(true);
      return;
    }

    if (dbVote.vote === vote) {
      throw new errors.AlreadyVotedError();
    }

    thread.rating += vote;
    await Promise.all([thread.save(), dbVote.remove()]);
    res.json(true);
  })
);

router.post(
  '/api/editProfile',
  authenticate,
  asyncHandler(async (req, res) => {
    const { username, email } = validate(req.body, {
      email: Joi.string()
        .email()
        .optional(),
      username: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,10}$/)
        .optional(),
    });

    if (email) req.user.email = email;
    if (username) req.user.username = username;
    if (email || username) await req.user.save();

    res.json(true);
  })
);

router.post(
  '/api/editPassword',
  authenticate,
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = validate(req.body, {
      oldPassword: Joi.string().max(128),
      newPassword: Joi.string().max(128),
    });

    const oldPasswordHash = User.hashPassword(oldPassword);
    if (req.user.passwordHash !== oldPasswordHash) {
      throw new errors.InvalidPasswordError();
    }

    req.user.passwordHash = User.hashPassword(newPassword);
    await req.user.save();

    res.json(true);
  })
);

module.exports = router;
