import { Category } from '../models/category.js';

export const getAllCategories = async (_req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 200,
    message: 'Successfully fetched categories',
    data: categories,
  });
};
