const { urls, loadImg } = require("./mock");

class PromiseLimit {
  constructor(props) {
    const { concurrency } = props;
    this.concurrency = concurrency || 1;
    this.pendingList = [];
    this.limitCount = 0;
  }

  add(task) {
    this.pendingList.push(task);
    this.run();
  }

  run() {
    if (this.pendingList.length === 0 || this.limitCount === this.concurrency) {
      return;
    }

    this.limitCount++;

    const fn = this.pendingList.shift();
    const promise = fn();
    promise.then(this.complete.bind(this)).catch(this.complete.bind(this));
  }

  complete() {
    this.limitCount--;
    this.run();
  }
}

const Limit = new PromiseLimit({ concurrency: 3 });

for (let i = 0; i < urls.length; i++) {
  Limit.add(() => loadImg(urls[i]));
}
