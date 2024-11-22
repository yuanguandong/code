const promise1 = new Promise((resolve,reject)=>{reject()})

// const promise2 = promise1.then(null,(rej)=>{
//   return {
//     get then(){
//       throw new Error()
//     }
//   }
// })

// promise2.then(()=>{
//   console.log(1)
// },()=>{
//   console.log(2)
// })


var  a = {
  get b(){
    console.log(1)
  }
}

a.b