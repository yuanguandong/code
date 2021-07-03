const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  FULFILLED_CALLBACK_LIST = []
  REJECTED_CALLBACK_LIST = []
  _status = PENDING

  constructor(fn) {
    // 初始状态为pending
    this.status = PENDING;
    this.value = null;
    this.reason = null;

    try{
      fn(this.resolve.bind(this), this.reject.bind(this))
    }catch(e){
      this.reject(e);
    }

  }

  get status(){
    return this._status
  }

  set status(newStatus){
    this._status = newStatus
    switch(newStatus){
      case FULFILLED:{
        this.FULFILLED_CALLBACK_LIST.forEach(callback=>{
          callback(this.valued)
        })
        break
      }
      case REJECTED:{
        this.REJECTED_CALLBACK_LIST.forEach(callback=>{
          callback(this.reason)
        })
        break
      }
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

  then(onFulFilled,onRejected){
    const realOnFulFilled = this.isFunction(onFulFilled) ? onFulFilled: (value)=>{
      return value
    }

    const realOnRejected = this.isFunction(onRejected) ? onRejected: (reason)=>{
      return reason
    }
    
    const promise2  = new MPromise((resolve,reject)=>{

      const fulfilledMicrotask = ()=>{
        try{
          const x = realOnFulFilled(this.value)
          
        }catch(e){
          reject(e)
        }
      }

      const rejecteddMicrotask = ()=>{
        try{
          realOnRejected(this.reason)
        }catch(e){
          reject(e)
        }
      }

      switch(this.status){
        case FULFILLED:{
          fulfilledMicrotask();
          break;
        }
        case REJECTED:{
          rejecteddMicrotask();
          break;
        }
        case PENDING:{
          this.FULFILLED_CALLBACK_LIST.push(realOnFulFilled)
          this.REJECTED_CALLBACK_LIST.push(realOnRejected)
          break;
        }
      }
    })

    return promise2

  }

  resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
      return reject(new TypeError('The promise and return value is same'))
    }
    if(x instanceof MPromise){
      x.then((y)=>{
        this.resolvePromise(promise2,y,resolve,reject)
      },reject)
    }else if(typeof x ==='object' || this.isFunction(x)){
      if(x === null){
        return resolve(x);
      }
      let then = null
      try{
        then = x.then
      }catch(e){
        return reject(e)
      }

      if(this.isFunction(then)){
        let called = false
        try {
          then.call(x,(y)=>{
            if(called){
              return
            }
            called = true;
            this.resolvePromise(promise2,y,resolve,reject)
          },(r)=>{
            
          })
        }catch(e){
          if(called){return}
          reject(error)
        }
      }else{
        resolve(x)
      }
    }else{
      resolve(x)
    }
  }


  isFunction(value){
    return typeof value ==='function'
  }
}


const promise = new MPromise((resolve,reject)=>{

})