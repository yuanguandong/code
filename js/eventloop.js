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

// 1
// 7

// setTimeout(()=>{
//   console.log(2)
// },20)
// setTimeout(()=>{
//   console.log(8)
// },10)

// 3
// 4
// 8
// 2

// new Promise((resolve, reject) => {
//   resolve(1)
// }).then(()=>{
//   return new Promise((resolve, reject) => {
//     resolve(2)
//   })
// }).then((value)=>{
//   console.log('value',value)
// })

// async function async1() {
//   console.log("async1 start");
//   await async2();
//   console.log("async1 end");
// }

// async function async2() {
//   console.log("async start");
//   return new Promise((resolve, reject) => {
//     resolve();
//     console.log("async2 promise");
//   });
// }

// console.log("script start");
// setTimeout(() => {
//   console.log("setTimeout");
// }, 0);

// async1();

// new Promise((resolve) => {
//   console.log("promise1");
//   resolve();
// })
//   .then(() => {
//     console.log("promise2");
//   })
//   .then(() => {
//     console.log("promise3");
//   });
// console.log("script end");

// console.log(1); //同步
// setTimeout(() => {
//   console.log(2); //异步：宏任务
//   Promise.resolve().then(() => {
//     console.log(3); //异步微任务
//   });
// });
// console.log(4); // 同步
// new Promise((resolve, reject) => {
//   console.log(5); //同步：宏任务
// }).then(() => {
//   console.log(6); //异步：微任务
//   setTimeout(() => {
//     console.log(7); //异步：宏任务
//   });
// });
// console.log(8); // 同步

// new Promise((resolve,reject)=>{
//   console.log(1)  //同步  p1
//   resolve()
// }).then(()=>{
//   console.log(2) //异步：微任务  then1
//   new Promise((resolve,reject)=>{
//       console.log(3)  //同步  p2
//       resolve()
//   }).then(()=>{
//       console.log(4)  //异步：微任务  then2
//   }).then(()=>{
//       console.log(5) // 异步：微任务  then3
//   })
// }).then(()=>{
//   console.log(6)  // 异步：微任务  then4
// })

// new Promise((resolve, reject) => {
//   // p1
//   console.log(1); // 同步
//   resolve();
// })
//   .then(() => {
//     //then1
//     console.log(2); // 异步：微任务
//     // 多了个return
//     return new Promise((resolve, reject) => {
//       //p2
//       console.log(3); //同步
//       resolve();
//     })
//       .then(() => {
//         //then2
//         console.log(4); //异步：微任务
//       })
//       .then(() => {
//         //then3
//         console.log(5); //异步：微任务
//       });
//   })
//   .then(() => {
//     //then4
//     console.log(6);
//   });

// new Promise((resolve, reject) => {  //p1
//   console.log(1) //同步
//   resolve()
// }).then(() => {   //then1
//   console.log(2)  //异步：微任务
//   new Promise((resolve, reject) => {  // p2
//     console.log(3) //异步：微任务
//     resolve()
//   }).then(() => {  // then2
//     console.log(4)  //异步：微任务
//   }).then(() => {  // then3
//     console.log(5) //异步：微任务
//   })
// }).then(() => { // then4
//   console.log(6)  //异步：微任务
// })
// new Promise((resolve, reject) => { //p3
//   console.log(7)  //同步
//   resolve()
// }).then(() => {  //then5
//   console.log(8) //异步：微任务
// })

// async function async1() {  //a1
//   console.log(1);  //同步
//   await async2();
//   console.log(2); //异步：微任务
// }
// async function async2() { // a2
//   console.log(3); //同步
// }
// console.log(4); //同步
// setTimeout(function () { //s1
//   console.log(5); //异步：宏任务
// });
// async1()
// new Promise(function (resolve, reject) {//p1
//   console.log(6); //同步
//   resolve();
// }).then(function () { //then1
//   console.log(7);  //异步：微任务
// });
// console.log(8); //同步

async function async1() {
  // a1
  console.log("async1 start"); // 同步
  await async2();
  console.log("async1 end"); //异步：微任务
}

async function async2() {
  //a2
  // console.log("async start"); // 同步
  // return new Promise((resolve, reject) => {
  //   //p1
  //   resolve();
  //   console.log("async2 promise"); //同步
  // });
  return 1;
}

console.log("script start"); //同步
setTimeout(() => {
  //s1
  console.log("setTimeout"); // 异步：宏任务
}, 0);

async1();

new Promise((resolve) => {
  // p2
  console.log("promise1"); // 同步
  resolve();
})
  .then(() => {
    //then1
    console.log("promise2"); // 异步：微任务
  })
  .then(() => {
    //then2
    console.log("promise3"); //异步：微任务
  });
console.log("script end"); // 同步
