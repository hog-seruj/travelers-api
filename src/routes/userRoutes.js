import { Router } from 'express';
import { getUsers, updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import { getUsersSchema } from '../validations/usersValidation.js';
import { celebrate } from 'celebrate';

const router = Router();

// get All users
router.get('/users', celebrate(getUsersSchema), getUsers);

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;
