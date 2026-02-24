import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllStories,
  getStoryById,
  updateStory,
  createStory,
  addToSavedStories,
  getOwnStories,
  removeSavedStories,
  getSavedStories,
} from '../controllers/storiesController.js';
import {
  getAllStoriesSchema,
  getStoryByIdSchema,
  addToSavedStoriesSchema,
  updateStorySchema,
  createStorySchema,
  removeSavedStoriesSchema,
  getSavedStoriesSchema,
} from '../validations/storiesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

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

router.post(
  '/stories',
  authenticate,
  celebrate(createStorySchema),
  createStory,
);

router.delete(
  '/stories/:storyId/saved',
  authenticate,
  celebrate(removeSavedStoriesSchema),
  removeSavedStories,
);

router.get(
  '/stories/saved',
  authenticate,
  celebrate(getSavedStoriesSchema),
  getSavedStories,
);

router.get(
  '/stories/:storyId',
  celebrate(getStoryByIdSchema),
  getStoryById,
);

export default router;
