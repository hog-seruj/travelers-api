import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getAllStories } from '../controllers/storiesController.js';
import { getAllStoriesSchema } from '../validations/storiesValidation.js';

const router = Router();

router.get('/stories', celebrate(getAllStoriesSchema), getAllStories);

export default router;
