const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (!subcategory) return next();

  const productList = await Product.find({subcategory: subcategory});
  ctx.body = {products: productList.map((product) => mapProduct(product))};
};

module.exports.productList = async function productList(ctx, next) {
  const productList = await Product.find();
  ctx.body = {products: productList.map((product) => mapProduct(product))};
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.status = 404;
    ctx.body = 'Product not found';
    return;
  }

  ctx.body = {product: mapProduct(product)};
};

