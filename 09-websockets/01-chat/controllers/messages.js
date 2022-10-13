const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

const MSG_LIMIT = 20;

module.exports.messageList = async function messages(ctx, next) {
  const msgList = await Message.find({user: ctx.user.displayName}, null, {limit: MSG_LIMIT});
  ctx.body = {messages: msgList.map(mapMessage)};
};
