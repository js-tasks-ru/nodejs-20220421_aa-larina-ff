const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const order = await Order.create({
    user: ctx.user._id,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  const product = await Product.findById(ctx.request.body.product);

  await sendMail({
    to: ctx.user.email,
    subject: 'Подтвердите почту',
    locals: {id: order._id, product: product},
    template: 'order-confirmation',
  });

  ctx.body = {order: order._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user._id}).populate('product');

  ctx.body = {orders: orders};
};
