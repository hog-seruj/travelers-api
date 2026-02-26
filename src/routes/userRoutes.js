import { Router } from 'express';
import {
  getUsers,
  updateUserAvatar,
  updateUser,
  getCurrentUser,
  getUserById,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import { celebrate } from 'celebrate';
import {
  updateUserSchema,
  getUsersSchema,
  userIdSchema,
} from '../validations/userValidation.js';

const router = Router();

// get All users
router.get('/', celebrate(getUsersSchema), getUsers);

router.get('/me', authenticate, getCurrentUser);

router.patch(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

router.patch(
  '/me',
  authenticate,
  celebrate(updateUserSchema),
  updateUser,
);

router.get('/:userId', celebrate(userIdSchema), getUserById);

export default router;
