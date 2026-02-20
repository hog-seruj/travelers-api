import { Router } from 'express';
import {
  getUsers,
  updateUserAvatar,
  updateUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import { getUsersSchema } from '../validations/usersValidation.js';
import { celebrate } from 'celebrate';
import { updateUserSchema } from '../validations/userValidation.js';

const router = Router();

// get All users
router.get('/users', celebrate(getUsersSchema), getUsers);

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

router.patch(
  '/users/me',
  authenticate,
  celebrate(updateUserSchema),
  updateUser,
);

export default router;
