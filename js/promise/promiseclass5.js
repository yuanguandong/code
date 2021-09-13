const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  _status = PENDING;
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];

  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    if (newStatus === FULFILLED) {
      this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
        callback(this.value);
      });
    } else if (newStatus === REJECTED) {
      this.REJECTED_CALLBACK_LIST.forEach((callback) => {
        callback(this.reason);
      });
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  then(onFulfilled, onRejected) {
    const onFulfilledTask = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value;
        };
    const onRejectedTask = this.isFunction(onRejected)
      ? onFulfilled
      : (value) => {
          return value;
        };

    const promise2 = new MPromise((resolve, reject) => {
      const realOnFulfilledTask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilledTask(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const realOnRejectedTask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejectedTask(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      switch (this.status) {
        case FULFILLED:
          realOnFulfilledTask();
          break;
        case REJECTED:
          realOnRejectedTask();
          break;
        case PENDING:
          this.FULFILLED_CALLBACK_LIST.push(realOnFulfilledTask);
          this.REJECTED_CALLBACK_LIST.push(realOnRejectedTask);
          break;
      }
    });

    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError("传入的值和promise相等"));
    }
    if (x instanceof MPromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
    } else if (typeof x === "object" || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  isFunction(fn) {
    return typeof fn === "function";
  }
}

const mypromise = new MPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})
  .then((value) => {
    console.log("1", value);
    return value + 1;
  })
  .then((value) => {
    console.log("1", value);
    return value + 1;
  })
  .then((value) => {
    console.log("1", value);
    return value + 1;
  })
  .then((value) => {
    console.log("1", value);
    return value + 1;
  })
  .then((value) => {
    console.log("1", value);
    return value + 1;
  });
