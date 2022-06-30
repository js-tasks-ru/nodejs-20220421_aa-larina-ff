const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const productsBySubcategory = await Product.findOne({subcategory: ctx.query.subcategory});
  if (!productsBySubcategory) return next();

  const productList = await Product.find({subcategory: ctx.query.subcategory});

  ctx.body = {products: productList.map((product) => mapProduct(product))};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: []};
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

