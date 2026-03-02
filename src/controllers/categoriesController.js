import { Category } from '../models/category.js';

export const getAllCategories = async (_req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({ categories });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to retrieve categories', error: err.message });
  }
};
