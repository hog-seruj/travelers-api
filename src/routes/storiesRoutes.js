import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getAllStories } from '../controllers/storiesController.js';
import { addToSavedStories } from '../controllers/storiesController.js';
import { getAllStoriesSchema } from '../validations/storiesValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { addToSavedStoriesSchema } from '../validations/storiesValidation.js';


const router = Router();

router.get('/stories', celebrate(getAllStoriesSchema), getAllStories);


// Private endpoint to add a story to the user's saved articles
router.post('/:storyId/save', authenticate, celebrate(addToSavedStoriesSchema), addToSavedStories);

export default router;

