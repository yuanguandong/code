// var fs = require('fs')
// // `fs.createReadStream`创建一个`Readable`对象以读取`bigFile`的内容，并输出到标准输出
// // 如果使用`fs.readFile`则可能由于文件过大而失败
// fs.createReadStream(__dirname+'/index.tsx').pipe(process.stdout)


// const ToReadable = require('./readable')

// const iterator = function (limit) {
//   return {
//     next: function () {
//       if (limit--) {
//         return { done: false, value: limit + Math.random() }
//       }
//       return { done: true }
//     }
//   }
// }(10)

// const readable = new ToReadable(iterator)

// // 监听`data`事件，一次获取一个数据
// readable.on('data', data => process.stdout.write(data))

// // 所有数据均已读完
// readable.on('end', () => process.stdout.write('DONE'))


const Readable = require('stream').Readable

const readable = Readable()

readable._read = function (data, enc, next) {
  debugger
  this.push(data)
  // process.stdout.write(data.toString().toUpperCase())
  // process.nextTick(next)
}

readable.on('data', data => process.stdout.write(data))

readable.on('end', () => process.stdout.write('DONE'))