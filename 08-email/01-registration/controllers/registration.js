const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();

  const user = await User.findOne({email: ctx.request.body.email});
  if (user) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }

  const newUser = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: token,
  });
  await newUser.setPassword(ctx.request.body.password).then(() => newUser.save());

  await sendMail({
    template: 'confirmation',
    locals: {token: 'token'},
    to: ctx.request.body.email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne(
      {verificationToken: ctx.request.body.verificationToken},
  );

  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  await User.updateOne(user, {$unset: {verificationToken: ''}})
      .then(() => ctx.body = {token: uuid()});
};
