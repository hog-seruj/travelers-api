import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Stories } from '../models/stories.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// get users pagination with another next page for page 2 and beyond
export const getUsers = async (req, res) => {
  try {
    let { page, perPage, nextPerPage } = req.query;

    page = Number(page) || 1;
    perPage = Number(perPage) || 12; // ліміт для сторінки №1
    nextPerPage = nextPerPage != null ? Number(nextPerPage) : perPage;

    //  count skip та limit
    const isFirstPage = page === 1;
    const limit = isFirstPage ? perPage : nextPerPage;
    const skip = isFirstPage ? 0 : perPage + (page - 2) * nextPerPage;

    const usersQuery = User.find();
    usersQuery.sort({ articlesAmount: -1, _id: 1 });
    console.log(usersQuery);

    const [totalItems, users] = await Promise.all([
      usersQuery.clone().countDocuments(),
      usersQuery.skip(skip).limit(limit),
    ]);

    //  count totalPages: 1‑st page and perPage, other from nextPerPage
    const remaining = Math.max(totalItems - perPage, 0);
    const extraPages = remaining > 0 ? Math.ceil(remaining / nextPerPage) : 0;
    const totalPages = 1 + extraPages;

    res.status(200).json({
      page,
      perPage,
      nextPerPage,
      totalItems,
      totalPages,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get users' });
  }
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

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  const { page = 1, perPage = 6 } = req.query;
  const skip = (page - 1) * perPage;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const articleQuery = Stories.find({ ownerId: userId });

  const [totalArticles, articles] = await Promise.all([
    articleQuery.clone().countDocuments(),
    articleQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalArticles / perPage);

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    user: userData,
    articles: {
      page,
      perPage,
      totalPages,
      articles,
      totalArticles,
    },
  });
};
