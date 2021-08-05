import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
  confirmPassword: Joi.ref("password")
});

export default userSchema;
