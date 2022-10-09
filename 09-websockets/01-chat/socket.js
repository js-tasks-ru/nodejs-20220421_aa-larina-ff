const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    if (!socket.handshake.query.token) {
      next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token: socket.handshake.query.token}).populate('user');
    if (!session) next(new Error('wrong or expired session token'));

    socket.user = session.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const newMsg = {
        date: new Date(),
        text: msg,
        chat: socket.user.id,
        user: socket.user.displayName,
      };
      await Message.create(newMsg);
    });
  });

  return io;
}

module.exports = socket;
