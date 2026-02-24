import createHttpError from 'http-errors';
import { SORT_POPULAR, SORT_NEWEST } from '../constants/stories.js';
import { Stories } from '../models/stories.js';
import '../models/category.js';
import { User } from '../models/user.js';

export const getAllStories = async (req, res) => {
  const { page = 1, perPage = 9, category, sort = SORT_NEWEST } = req.query;
  const skip = (page - 1) * perPage;

  const storiesQuery = Stories.find();

  if (category) {
    storiesQuery.where('category').equals(category);
  }

  if (sort === SORT_POPULAR) {
    storiesQuery.sort({ favoriteCount: -1 });
  } else {
    storiesQuery.sort({ date: -1 });
  }

  const [totalStories, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalStories / perPage);

  res.status(200).json({
    page,
    perPage,
    totalStories,
    totalPages,
    stories,
  });
};

//Create a private endpoint to add a story to the user's saved articles
export const addToSavedStories = async (req, res) => {
  //Get authenticated user ID:
  const { _id: userId } = req.user;
  //Get story ID:
  const { storyId } = req.params;

  //Find user:
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  //Find story:
  const story = await Stories.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }

  //Check if the story is already added to savedArticles:
  if (!user.savedArticles.includes(storyId)) {
    user.savedArticles.push(storyId);
    await user.save();
  }

  res.status(200).json({
    message: 'Story added to saved articles',
    savedArticles: user.savedArticles,
  });
};

export const getStoryById = async (req, res) => {
  const { storyId } = req.params;

  const story = await Traveller.findById(storyId)
    .populate('category', 'name')
    .populate('ownerId', 'name');

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json(story);
};

export const getOwnStories = async (req, res) => {
  const { page = 1, perPage = 9 } = req.query;
  const skip = (Number(page) - 1) * Number(perPage);

  const ownerId = req.user._id;

  const storiesQuery = Stories.find({ ownerId });

  const [totalStories, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(perPage)),
  ]);

  const totalPages = Math.ceil(totalStories / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalStories,
    totalPages,
    stories,
  });
};

export const updateStory = async (req, res) => {
  const { storyId } = req.params;
  const { img, title, article, category } = req.body;

  const story = await Stories.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  // Перевірка, чи користувач є власником історії
  if (story.ownerId.toString() !== req.user._id.toString()) {
    throw createHttpError(403, 'You do not have permission to edit this story');
  }

  // Оновлення полів
  const updateData = {};
  if (img !== undefined) updateData.img = img;
  if (title !== undefined) updateData.title = title;
  if (article !== undefined) updateData.article = article;
  if (category !== undefined) updateData.category = category;

  const updatedStory = await Stories.findByIdAndUpdate(storyId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl');

  res.status(200).json({
    message: 'Story updated successfully',
    data: updatedStory,
  });
};

export const createStory = async (req, res) => {
  const ownerId = req.user._id;

  const story = await Traveller.create({
    ...req.body,
    ownerId,
    favoriteCount: 0,
  });

  res.status(201).json({
    status: 201,
    message: 'Story created successfully',
    data: story,
  });
};

export const removeSavedStories = async (req, res) => {
  const { storyId } = req.params;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { savedArticles: storyId } },
    { new: true },
  );
  //
  res.status(200).json({
    message: 'Story removed from saved articles',
    stories: updatedUser.savedArticles,
  });
};

export const getSavedStories = async (req, res) => {
  const { page = 1, perPage = 4 } = req.query;
  const skip = (page - 1) * perPage;

  const user = await User.findById(req.user._id).select('savedArticles');
  const savedIds = user.savedArticles ?? [];

  const storiesQuery = Traveller.find({ _id: { $in: savedIds } });

  const [totalStories, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalStories / perPage);

  res.status(200).json({
    page,
    perPage,
    totalStories,
    totalPages,
    stories,
  });
};
