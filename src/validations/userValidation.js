import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().max(32),
    email: Joi.string().email().max(64),
    description: Joi.string().max(150),
  }).min(1),
};

export const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Id is not valid!');
  }
  return value;
};

export const userIdSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getUsersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(4).max(12).default(8),
    nextPerPage: Joi.number().integer().min(4).max(12).default(4),
  }),
};
