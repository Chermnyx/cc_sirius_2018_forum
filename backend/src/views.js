const fs = require('fs');

const Joi = require('joi');
const sharp = require('sharp');
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

function authenticateOptional(err, req, res, next) {
  if (err && err instanceof errors.UnauthorizedError) {
    next();
  } else {
    next(err);
  }
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

router.post(
  '/api/newThread',
  authenticate,
  asyncHandler(async (req, res) => {
    const { title } = validate(req.body, {
      title: Joi.string()
        .min(3)
        .max(cfg.MAX_TITLE_LENGTH),
    });

    const thread = await new ThreadModel({
      title,
      creatorId: req.user._id,
    }).save();

    res.json(await thread.toClientJSON());
  })
);

router.post(
  '/api/newPost',
  authenticate,
  cfg.upload.single('pic'),
  asyncHandler(async (req, res) => {
    let { threadId, text } = validate(req.body, {
      threadId: Joi.string().regex(cfg.objectIdRegex),
      text: Joi.string()
        .optional()
        .min(3)
        .max(cfg.MAX_POST_SIZE),
    });

    if (text === undefined) text = null; // to match DB type

    const post = new PostModel({ threadId, text, authorId: req.user._id });

    if (req.file) {
      const picBuf = await fs.promises.readFile(req.file.path);
      let newPicBuf;

      try {
        newPicBuf = await sharp(picBuf)
          .resize(512, 512, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer();
      } catch {
        throw new errors.InvalidPictureError();
      }

      await fs.promises.writeFile(
        `${cfg.STATIC_PATH}/pics/${post.pic}`,
        newPicBuf
      );
    }

    if (!req.file && !text) throw new errors.InvalidPostError();

    res.json(await (await post.save()).toClientJSON());
  })
);

router.post(
  '/api/getThreads',
  authenticate,
  authenticateOptional,
  asyncHandler(async (req, res) => {
    const { count, skip } = validate(req.body, {
      count: Joi.number()
        .integer()
        .min(1)
        .max(50),
      skip: Joi.number()
        .integer()
        .optional()
        .default(0)
        .min(0),
    });

    const threads = await ThreadModel.find()
      .skip(skip)
      .limit(count)
      .exec();

    res.json(
      await Promise.all(
        threads.map((thread) => thread.toClientJSON(req.user && req.user._id))
      )
    );
  })
);

router.post(
  '/api/getThread',
  authenticate,
  authenticateOptional,
  asyncHandler(async (req, res) => {
    const { threadId } = validate(req.body, {
      threadId: Joi.string().regex(cfg.objectIdRegex),
    });

    const thread = await ThreadModel.findById(threadId);
    if (!thread) throw new errors.ThreadNotFoundError(threadId);

    res.json(await thread.toClientJSON(thread));
  })
);

module.exports = router;
