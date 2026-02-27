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

export const updateStoryBodySchema = {
  [Segments.BODY]: Joi.object({
    img: Joi.string().optional(),
    title: Joi.string().trim().optional(),
    article: Joi.string().trim().optional(),
    category: Joi.string().custom(objectIdValidator).optional(),
  }).min(1),
};

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    article: Joi.string().min(10).required(),
    category: Joi.string().custom(objectIdValidator).required(),
    date: Joi.string(),
    img: Joi.string().uri().required(),
  }),
};

export const getStoryByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const removeSavedStoriesSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getSavedStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(4).max(12).default(4),
  }),
};
