import {Router} from 'express';
import {getCategoriesController} from '../controllers/categoriesController.js';

const router =Router ();

router.get('/categories', getCategoriesController);

export default router;
