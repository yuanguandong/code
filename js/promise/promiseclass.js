const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;

  constructor(fn){
    this.status = PENDING
    this.value = null
    this.reason = null
    try{
      fn(this.resolve.bind(this),this.reject.bind(this))
    }catch{
      reject(this.reason)
    }
  }

  get status(){
    return this._status
  }

  set status(newStatus){
    this._status = newStatus
    if(newStatus === FULFILLED){
      this.FULFILLED_CALLBACK_LIST.forEach(function(callback){
        callback(this.value)
      })
    }else if(newStatus ===REJECTED){
      this.REJECTED_CALLBACK_LIST.forEach(function(callback){
        callback(this.reason)
      })
    }
  }


  resolve (value){
    if(this.status === PENDING) {
      this.value = value
      this.status = FULFILLED
    }
  }

  reject (reason){
    if(this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED
    }
  }

  then(onFulfilled, onRejected){
    const realOnFulfilled =this.isFunction(onFulfilled) ? onFulfilled :(value)=>{return value}
    const realOnRejected =this.isFunction(onRejected) ? onRejected : (reason) => {throw reason}

    

    const promise2 = new MPromise((resolve, reject) => {

      const fulfilledMicroTask = ()=>{
        try{
          const x = realOnFulfilled(this.value)
          this.resolvePromise(promise2,x,resolve,reject)
        }catch(e){
          reject(e)
        }
      }

      const rejecteddMicroTask = ()=>{
        try{
          const x = realOnRejected(this.reason)
          this.resolvePromise(promise2,x,resolve,reject)
        }catch(e){
          reject(e)
        }
      }


      switch(this.status){
        case FULFILLED:{
          fulfilledMicroTask()
          break
        }
        case REJECTED:{
          rejecteddMicroTask()
          break
        }
        case PENDING:{
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicroTask)
          this.REJECTED_CALLBACK_LIST.push(rejecteddMicroTask)
          break
        }
      }

    })
    return promise2
  
  }

  isFunction(fn){
    return typeof fn === 'function'
  }

  resolvePromise(){
    if(promise2 === x){
      return reject(new TypeError('The promise and return value are the same'))
    }
  }

}


const promise1 = new MPromise((resolve, reject) => {
  resolve(1)
}).then((res)=>{console.log(res)})