import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { SORT_NEWEST, SORT_POPULAR } from '../constants/stories.js';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Id is not valid');
  }
  return value;
};

export const getAllStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(3).max(18).default(9),
    category: Joi.string().custom(objectIdValidator),
    sort: Joi.string().valid(SORT_NEWEST, SORT_POPULAR).default(SORT_NEWEST),
  }),
};



export const addToSavedStoriesSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};
