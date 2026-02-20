import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getUsers = async (req, res) => {
  const { page = 1, perPage = 8 } = req.query;
  const skip = (page - 1) * perPage;

  const usersQuery = User.find();

  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    usersQuery.skip(skip).limit(perPage).sort({ articlesAmount: 'desc' }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    users,
  });
};

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Avatar file is required');
  }

  const result = await saveFileToCloudinary(req.file.buffer);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: result.secure_url },
    { new: true },
  );

  res.status(200).json({
    message: 'Avatar updated successfully',
    data: { avatarUrl: updatedUser.avatarUrl },
  });
};
