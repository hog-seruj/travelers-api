import createHttpError from 'http-errors';
import { SORT_POPULAR, SORT_NEWEST } from '../constants/stories.js';
import { Stories } from '../models/stories.js';
import '../models/category.js';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllStories = async (req, res) => {
  let { page, perPage, category, nextPerPage, sort = SORT_NEWEST } = req.query;
  // const skip = (page - 1) * perPage;
  page = Number(page) || 1;
  perPage = Number(perPage) || 9;
  nextPerPage = nextPerPage != null ? Number(nextPerPage) : 3;

  const isFirstPage = page === 1;
  const limit = isFirstPage ? perPage : nextPerPage;
  const skip = isFirstPage ? 0 : perPage + (page - 2) * nextPerPage;

  const storiesQuery = Stories.find();

  if (category) {
    storiesQuery.where('category').equals(category);
  }

  if (sort === SORT_POPULAR) {
    storiesQuery.sort({ favoriteCount: -1, _id: -1 });
  } else {
    storiesQuery.sort({ date: -1, _id: -1 });
  }

  const [totalStories, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
      .skip(skip)
      .limit(limit),
  ]);
  //  count totalPages: 1‑st page and perPage, other from nextPerPage
  const remaining = Math.max(totalStories - perPage, 0);
  const extraPages = remaining > 0 ? Math.ceil(remaining / nextPerPage) : 0;
  const totalPages = 1 + extraPages;

  res.status(200).json({
    page,
    perPage,
    nextPerPage,
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
  let story = await Stories.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }

  //Check if the story is already added to savedArticles:
  if (!user.savedArticles.includes(storyId)) {
    user.savedArticles.push(storyId);
    //change favoriteCount in Story
    story = await Stories.findOneAndUpdate(
      { _id: storyId },
      { favoriteCount: story.favoriteCount + 1 },
      { new: true },
    );
    await user.save();
    await story.save();
  }

  res.status(200).json({
    message: 'Story added to saved articles',
    savedArticles: user.savedArticles,
    storyFavoriteCount: story.favoriteCount,
  });
};

export const getStoryById = async (req, res) => {
  const { storyId } = req.params;

  const story = await Stories.findById(storyId)
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
  storiesQuery.sort({ date: -1, _id: 1 });

  const [totalStories, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
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

  const updateData = { ...req.body };
  if (req.file) {
    const result = await saveFileToCloudinary(req.file.buffer);
    updateData.img = result.secure_url;
  }

  const updatedStory = await Stories.findOneAndUpdate(
    {
      _id: storyId,
      ownerId: req.user._id,
    },
    updateData,
    {
      new: true,
    },
  );
  if (!updatedStory) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json({
    message: 'Story updated successfully',
    data: updatedStory,
  });
};

export const createStory = async (req, res) => {
  const ownerId = req.user._id;
  if (!req.file) {
    throw createHttpError(400, 'Image is required');
  }

  const storyData = {
    ...req.body,
    ownerId,
    favoriteCount: 0,
  };
  const result = await saveFileToCloudinary(req.file.buffer);
  storyData.img = result.secure_url;

  const story = await Stories.create(storyData);

  res.status(201).json({
    status: 201,
    message: 'Story created successfully',
    data: story,
  });
};

export const removeSavedStories = async (req, res) => {
  const { _id: userId } = req.user;
  const { storyId } = req.params;

  //Find user:
  let user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  //Find story:
  let story = await Stories.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }

  if (user.savedArticles.includes(storyId)) {
    user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedArticles: storyId } },
      { new: true },
    );
    //change favoriteCount in Story
    story = await Stories.findOneAndUpdate(
      { _id: storyId },
      { favoriteCount: story.favoriteCount - 1 },
      { new: true },
    );
    await user.save();
    await story.save();
  }

  //
  res.status(200).json({
    message: 'Story removed from saved articles',
    stories: user.savedArticles,
    storyFavoriteCount: story.favoriteCount,
  });
};

export const getSavedStories = async (req, res) => {
  const { page = 1, perPage = 4 } = req.query;
  const skip = (page - 1) * perPage;

  const user = await User.findById(req.user._id).select('savedArticles');
  const savedIds = user.savedArticles ?? [];

  const storiesQuery = Stories.find({ _id: { $in: savedIds } });

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
