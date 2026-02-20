import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { createStory } from '../controllers/storyController.js';
import { createStorySchema } from '../validations/storyValidation.js';

const router = Router();

router.post(
  '/stories',
  authenticate,
  celebrate(createStorySchema),
  createStory,
);

export default router;
