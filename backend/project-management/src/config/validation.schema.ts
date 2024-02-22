import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string(),
  JWT_SECRET_KEY: Joi.string(),
});

export const validationOptions = {
  allowUnknown: true,
  abortEarly: false,
};
