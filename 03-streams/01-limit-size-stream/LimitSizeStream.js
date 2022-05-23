const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.transmittedBytes = 0;
    this.limitError = null;
  }

  _transform(chunk, encoding, callback) {
    this.transmittedBytes += Buffer.byteLength(Buffer.from(chunk));

    if (this.transmittedBytes > this.limit) {
      this.limitError = new LimitExceededError();
    }

    callback(this.limitError, chunk);
  }
}

module.exports = LimitSizeStream;
