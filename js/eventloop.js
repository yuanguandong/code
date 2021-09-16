// new Promise((resolve,reject)=>{
//   console.log(1)
//   setTimeout(()=>{
//     console.log(2)
//   },20)
//   setTimeout(()=>{
//     console.log(8)
//   },10)
//   resolve()
// }).then(()=>{
//   console.log(3)
// }).then(()=>{
//   return new Promise((resolve,reject)=>{
//     console.log(4)
//   }).then(()=>{
//     console.log(5)
//   })
// }).then(()=>{
//   console.log(6)
// })

// console.log(7)



new Promise((resolve, reject) => {
  resolve(1)
}).then(()=>{
  return new Promise((resolve, reject) => {
    resolve(2)
  })
}).then((value)=>{
  console.log('value',value)
})