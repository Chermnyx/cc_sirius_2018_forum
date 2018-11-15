const Joi = require('joi');
const router = require('express').Router();

const errors = require('./errors');

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

module.exports = router;
