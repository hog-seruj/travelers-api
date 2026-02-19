import { Categorie } from '../models/category.js';

// Перевірка чи існує категорія
export const checkCategoryExists = async (categoryId) => {
  const category = await Categorie.findById(categoryId);
  return !!category;
};

// Отримати всі категорії
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Categorie.find();

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched categories',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
