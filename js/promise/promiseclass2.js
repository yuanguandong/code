const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;

  constructor(fn) {
    this.value = null;
    this.reason = null;
    this.status = PENDING;

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    switch (this.status) {
      case FULFILLED:
        this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value);
        });
        break;
      case REJECTED:
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason);
        });
        break;
      default:
        break;
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value;
        };

    const realOnRejected = this.isFunction(onRejected)
      ? onFulfilled
      : (reason) => {
          return reason;
        };

    const promise2 = new MPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      switch (this.status) {
        case FULFILLED:
          fulfilledMicrotask();
          break;
        case FULFILLED:
          rejectedMicrotask();
          break;
        case PENDING:
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
          break;

        default:
          break;
      }
    });
    return promise2;
  }

  isFunction(fn) {
    return typeof fn === "function";
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(
        new TypeError("the promise and the return value are the same")
      );
    }
    if (x instanceof MPromise) {
      x.then((y) => {
        this.resolvePromise(promise2, y, resolve, reject);
      }, reject);
    } else if (typeof x === "object" || this.isFunction(x)) {
      //一些兼容判断
    } else {
      resolve(x);
    }
  }
}

const test = new MPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})
  .then((value) => {
    console.log(value);
    return 2;
  })
  .then((value) => {
    console.log(value);
    return 3;
  })
  .then((value) => {
    console.log(value);
  });
