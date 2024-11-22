const Readable = require("stream").Readable;

class ToReadable extends Readable {
  constructor() {
    super();
    this.iterator = iterator;
  }
  _read() {
    const res = this.iterator.next();
    if (res.done) {
      return this.push(null);
    }
    setTimeout(() => {
      this.push(res.value + "\n");
    }, 0);
  }
}

const iterator = function (limit) {
  return {
    next: function () {
      if (limit--) {
        return {
          done: false,
          value: limit + Math.random(),
        };
      }
      return {
        done:true
      }
    },
  };
}(1000);

const readable = new ToReadable(iterator);
readable.on('data',data=>process.stdout.write(data))
readable.on('end',data=>process.stdout.write('done'))

