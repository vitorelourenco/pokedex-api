import Joi from "joi";

const headerSchema = Joi.object({
  token: Joi.string()
    .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    .required(),
});

export default headerSchema;
