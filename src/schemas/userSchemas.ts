import Joi from 'joi';

export const create = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
  confirmPassword: Joi.ref("password")
});

export const signin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required()
});

