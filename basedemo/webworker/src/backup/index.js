

class Worker {
  init() {
    // js文件必须是网络资源
    window.worker = new Worker("worker.js");
    // 监听worker线程返回的结果，event 参数中有 data 属性，就是子线程中返回的结果数据
    window.worker.onmessage = function (event) {
      const { type, res } = event.data;
      // 把子线程返回的结果添加到 div 上
      document.getElementById("result").innerHTML += res + "<br/>";
    };
  }

  sendTo() {
    var uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
    for (var i = 0; i < uInt8Array.length; ++i) {
      uInt8Array[i] = i;
    }
    console.log("start", uInt8Array.length);
    // 向worker线程传递消息
    window.worker.postMessage(uInt8Array, [uInt8Array.buffer]);
    console.log("end", uInt8Array.length);
  }
}
// 主线程的任务
// function fn() {
//   var i = 0
//   setInterval(() => {
//     i++
//     $('#results').html(i)
//   }, 1000);
// }

// function close() {
//   debugger
//   window.worker.terminate();
// }

// var uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
// for (var i = 0; i < uInt8Array.length; ++i) {
//   uInt8Array[i] = i;
// }

// console.log(uInt8Array.length); // 传递前长度:33554432

// var object = {
//   a: 1,
//   b: 2
// }

// function sendObject() {
//   debugger
//   window.worker.postMessage(object, [object])
//   console.log(uInt8Array.length); // 传递后长度:0
// }
