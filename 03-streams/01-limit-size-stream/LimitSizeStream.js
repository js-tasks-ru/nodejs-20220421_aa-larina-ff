const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.transmittedBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transmittedBytes += Buffer.byteLength(Buffer.from(chunk));
    this.transmittedBytes > this.limit ? callback(new LimitExceededError()) : callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
