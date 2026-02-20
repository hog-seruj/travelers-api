import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllStories,
  updateStory,
} from '../controllers/storiesController.js';
import { addToSavedStories } from '../controllers/storiesController.js';
import {
  getAllStoriesSchema,
  addToSavedStoriesSchema,
  updateStorySchema,
} from '../validations/storiesValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { getOwnStories } from '../controllers/storiesController.js';

const router = Router();

router.get('/stories', celebrate(getAllStoriesSchema), getAllStories);
router.get('/stories/my', authenticate, getOwnStories);

// Private endpoint to add a story to the user's saved articles
router.post(
  '/:storyId/save',
  authenticate,
  celebrate(addToSavedStoriesSchema),
  addToSavedStories,
);
router.patch(
  '/stories/:storyId',
  authenticate,
  celebrate(updateStorySchema),
  updateStory,
);

export default router;
