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
  storyIdSchema,
  updateStorySchema,
  createStorySchema,
  getSavedStoriesSchema,
} from '../validations/storiesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();


router.get('/', celebrate(getAllStoriesSchema), getAllStories);
router.get('/:storyId',celebrate(storyIdSchema), getStoryById);
router.get('/my', authenticate, getOwnStories);


// Private endpoint to add a story to the user's saved articles
router.post(
  '/:storyId/saved',
  authenticate,
  celebrate(storyIdSchema),
  addToSavedStories,
);

router.patch(
  '/:storyId',
  authenticate,
  celebrate(storyIdSchema),
  celebrate(updateStorySchema),
  updateStory,
);



router.post(
  '/',
  authenticate,
  celebrate(createStorySchema),
  createStory,
);


router.delete(
  '/:storyId/saved',
  authenticate,
  celebrate(storyIdSchema),
  removeSavedStories,
);


router.get(
  '/saved',
  authenticate,
  celebrate(getSavedStoriesSchema),
  getSavedStories,
);


export default router;
