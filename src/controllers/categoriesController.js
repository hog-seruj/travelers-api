import {Category} from '../models/category.js';

export const checkCategoryExists  = async (categoryId) => {
  const category = await Category.findById(categoryId);
  return !!category;
};


export const getCategories = async() => {
  const categories = await Category.find();
  return categories;
};

export const getCategoriesController=async (_req, res)=>{
  const categories =await getCategories();

res.status(200).json({
  status:200,
  message: 'Successfully fetched categories',
  data: categories,
});
};



