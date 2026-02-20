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

// PATCH /users/me/avatar
export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ messaage: 'User not found' });
  }

  res.status(200).json({ success: true, user: req.user });
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

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    message: 'Avatar updated successfully',
    data: { avatarUrl: updatedUser.avatarUrl },
  });
};

// PATCH /users/me
export const updateUser = async (req, res) => {
  const { name, email, description } = req.body;

  try {
    const updateData = {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(description !== undefined ? { description } : {}),
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    // Duplicate key (email already exists)
    if (err?.code === 11000) {
      throw createHttpError(409, 'Email is already in use');
    }
    throw err;
  }
};
