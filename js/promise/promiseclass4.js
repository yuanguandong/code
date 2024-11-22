const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;
  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(this.reason);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;

    switch (this.status) {
      case FULFILLED:
        this.FULFILLED_CALLBACK_LIST.forEach((callback) =>
          callback(this.value)
        );
        break;
      case REJECTED:
        this.REJECTED_CALLBACK_LIST.forEach((callback) =>
          callback(this.reason)
        );
        break;
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
    const onRealFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => value;
    const onRealRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => reason;

    const promise2 = new MPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRealFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            this.reject(error);
          }
        });
      };

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRealRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            this.reject(error);
          }
        });
      };

      switch (this.status) {
        case FULFILLED:
          fulfilledMicrotask();
          break;
        case REJECTED:
          rejectedMicrotask();
        case PENDING:
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
          break;
      }
    });

    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      reject(new TypeError("传入的值和promise相等"));
    }
    if (x instanceof MPromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
    } else if (typeof x === "object" || typeof x === "function") {
      if (x === null) {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  isFunction(fn) {
    return typeof fn === "function";
  }
}

const M = new MPromise((resolve, reject) => {
  resolve(1);
})
  .then((value) => {
    console.log(value);
    return value + 1;
  })
  .then((value) => {
    console.log(value);
    return value + 1;
  })
  .then((value) => {
    console.log(value);
    return value + 1;
  })
  .then((value) => {
    console.log(value);
    return value + 1;
  });
