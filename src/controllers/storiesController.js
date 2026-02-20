import { SORT_POPULAR, SORT_NEWEST } from '../constants/stories.js';
import { Traveller } from '../models/traveller.js';
import '../models/category.js';

export const getAllStories = async (req, res) => {
  const { page = 1, perPage = 9, category, sort = SORT_NEWEST } = req.query;
  const skip = (page - 1) * perPage;

  const storiesQuery = Traveller.find();

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
export const getOwnStories = async (req, res) => {
  const { page = 1, perPage = 9 } = req.query;
  const skip = (Number(page) - 1) * Number(perPage);

  const ownerId = req.user._id;

  const storiesQuery = Traveller.find({ ownerId });

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
