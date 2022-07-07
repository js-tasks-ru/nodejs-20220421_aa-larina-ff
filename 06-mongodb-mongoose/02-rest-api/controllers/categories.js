const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoryList = await Category.find();

  ctx.body = {categories: categoryList.map((category) => mapCategory(category))};
};
