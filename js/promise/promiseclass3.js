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
    } catch (e) {
      this.reject(e);
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
      : (value) => value;

    const promise2 = new MPromise((resolve, reject) => {
      const fulfilledMicroTask = () => {
        queueMicrotask(() => {
          try {
            const x = onRealFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            this.reject(this.reason);
          }
        });
      };

      const rejectedMicroTask = () => {
        queueMicrotask(() => {
          try {
            const x = onRealRejected(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            this.reject(this.reason);
          }
        });
      };

      switch (this.status) {
        case FULFILLED: {
          fulfilledMicroTask();
          break;
        }
        case REJECTED: {
          rejectedMicroTask();
          break;
        }
        case PENDING:
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicroTask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicroTask);
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
      throw new TypeError("传入的promise和它的值相等");
    }
    if (x instanceof MPromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
    } else if(typeof x==='object' || typeof x==='function'){
      if(x===null){
        resolve(x);
      }
      //其他一些functon的判断
    }else{
      resolve(x);
    }
  }

  static resolve(value){
    if(value instanceof MPromise) {
      return value
    }
    return new MPromise((resolve)=>{
      resolve(value)
    })
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
  });

