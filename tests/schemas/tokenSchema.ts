import Joi from "joi";

const tokenSchema = Joi.object({
  token: Joi.string()
    .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    .required(),
});

export default tokenSchema;
