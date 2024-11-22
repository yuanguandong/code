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
    } catch {
      this.reject(this.reason);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    if (newStatus === FULFILLED) {
      this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
        callback(this.value)
      });
    } else if (newStatus === REJECTED) {
      this.REJECTED_CALLBACK_LIST.forEach((callback) => {
        callback(this.value)
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
    const onRealFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value;
        };
    const onRealRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };


    

    const promise2 = new MPromise((resolve, reject) => {

      const fulfilledMicroTask = ()=>{
        try {
          const x = onRealFulfilled(this.value)
        }catch(e) {
  
        }
      }
  
  
      const rejecteddMicroTask = ()=>{
        try {
          const x = onRealRejected(this.value)
        }catch(e) {
  
        }
      }

      
      
      if(this.status === FULFILLED){
        fulfilledMicroTask()
      }else if(this.status === REJECTED){
        rejecteddMicroTask()
      }else if (this.status === PENDING) {
        this.FULFILLED_CALLBACK_LIST.push(fulfilledMicroTask);
        this.REJECTED_CALLBACK_LIST.push(rejecteddMicroTask);
      }
    });

    return promise2;
  }

  isFunction(fn) {
    return typeof fn === "function";
  }
}

const promise1 = new MPromise((resolve, reject) => {
  resolve(1);
}).then((res) => {
  console.log("res", res);
  return res+1
}).then((res1)=>{
  console.log("res1", res1);
});
