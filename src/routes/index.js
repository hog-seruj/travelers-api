import { Router } from 'express';
import authRoutes from './authRoutes.js';
import storiesRoutes from './storiesRoutes.js';
import userRoutes from './userRoutes.js';


const router = Router();

router.use('/auth', authRoutes);
router.use('/stories', storiesRoutes);
router.use('/users', userRoutes);


export default router;
