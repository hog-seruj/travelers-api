import { Joi, Segments } from 'celebrate';

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    article: Joi.string().min(10).required(),
    category: Joi.string().required(),
    date: Joi.string().required(),
    img: Joi.string().uri().required(),
  }),
};
