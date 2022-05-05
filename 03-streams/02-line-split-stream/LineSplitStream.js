const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._lastLine = null;
  }

  _transform(chunk, encoding, callback) {
    const lines = ((this._lastLine !== null ? this._lastLine : '') +
      chunk.toString()).split(os.EOL);
    this._lastLine = lines.pop();
    for (const line of lines) {
      this.push(line);
    }
    callback();
  }

  _flush(callback) {
    this.push(this._lastLine !== null ? this._lastLine : '');
    callback();
  }
}

module.exports = LineSplitStream;
