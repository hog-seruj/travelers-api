import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getAllStories } from '../controllers/storiesController.js';
import { getAllStoriesSchema } from '../validations/storiesValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { getOwnStories } from '../controllers/storiesController.js';

const router = Router();

router.get('/stories', celebrate(getAllStoriesSchema), getAllStories);
router.get('/stories/my', authenticate, getOwnStories);

export default router;
