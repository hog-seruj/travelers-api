import { Joi, Segments } from 'celebrate';

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().max(32),
    email: Joi.string().email().max(64),
    description: Joi.string().max(150),
  }).min(1),
};
