const mongoose = require('mongoose');

function validateObjectId(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = 'invalid id';
    return;
  }

  return next();
}

module.exports = validateObjectId;
