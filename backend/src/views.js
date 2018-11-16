const Joi = require('joi');
const router = require('express').Router();

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

module.exports = router;
