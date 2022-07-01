const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const search = ctx.query;
  const results = await Product.find({$text: {$search: search.query}});
  ctx.body = {products: results.map((result) => mapProduct(result))};
};
