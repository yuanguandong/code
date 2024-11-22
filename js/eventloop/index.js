async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout0')
  setTimeout(function () {
      console.log('setTimeout1');
  }, 0);
  setImmediate(() => console.log('setImmediate'));
}, 0)

process.nextTick(() => console.log('nextTick'));
async1();
new Promise(function (resolve) {
  console.log('promise1')
  resolve();
  console.log('promise2')
}).then(function () {
  console.log('promise3')
})
console.log('script end')

// 我们先按运行主线一步一步往下走

js运行主线
1. 遇到两个异步函数声明，async function, 还没有调用，所以不执行
2. 遇到console.log('script start')，执行
3. 遇到setTimeout，把回调任务塞入异步任务回调队列，等待
4. 遇到process.nextTick，塞入微任务回调队列
5、执行async1, 执行 console.log('async1 start')
6、遇到await async2, 执行 async2, 执行 console.log('async2')
7、await后面的代码相当于是promise.then，把其塞入微任务回调队列
8、async1 执行完后遇到了new Promise， 立即执行其中的代码，执行 console.log('promise1')
9、遇到了resolve，立即当前函数体的下面代码，执行 console.log('promise2')
10、遇到了promise.then, 把其塞入微任务回调队列
11、执行 console.log('script end')， 此时主线运行完毕，即将进行下一轮事件循环


回调队列
12、检查微任务回调队列，如果有，则依次执行并清空微任务队列
依次执行
console.log('nextTick')
console.log('async1 end')
console.log('promise3')
13、检查timmer回调，如果有，则依次执行并清空timmer回调任务队列 （setTimeout和setImmediate在同一任务时，先执行setImmediate）
依次执行
console.log('setTimeout0')
console.log('setImmediate')
console.log('setTimeout1');



// js运行主线
// console.log('script start')
// console.log('async1 start')
// console.log('async2 start')
// console.log('promise1')
// console.log('promise2')
// console.log('script end')

// 微任务回调
// console.log('nextTick')
// console.log('async1 end')
// console.log('promise3')

// timmer回调
// console.log('setTimeout0')
// console.log('setImmediate')
// console.log('setTimeout1');







// console.log('nextTick')

// console.log('async1 end')
// console.log('promise3')

// console.log('setTimeout0')
// console.log('setImmediate')
// console.log('setTimeout1');



// const fs = require("fs");

// function someAsyncOperation(callback) {
//   // Assume this takes 95ms to complete
//   fs.readFile(__filename, callback);
// }

// const timeoutScheduled = Date.now();

// setTimeout(() => {
//   const delay = Date.now() - timeoutScheduled;

//   console.log(`${delay}ms have passed since I was scheduled`);
// }, 100);

// // do someAsyncOperation which takes 95 ms to complete
// someAsyncOperation(() => {
//   const startCallback = Date.now();

//   // do something that will take 10ms...
//   while (Date.now() - startCallback < 10) {
//     // do nothing
//   }
// });