import { Traveller } from '../models/traveller.js';

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
