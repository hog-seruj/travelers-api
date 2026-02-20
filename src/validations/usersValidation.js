import { Joi, Segments } from 'celebrate';

export const getUsersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(4).max(12).default(8),
  }),
};
