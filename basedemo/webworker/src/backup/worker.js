// worker.js
// 接收主线程发来的消息

// const backends = {
//   getFound: async function (params) {
//     console.log("params", params);
//     return "getFound";
//   },
// };

self.addEventListener(
  "message",
  async function (e) {
    // const { type, payload } = e.data;
    // const res = await backends[type](payload);
    // this.postMessage({ type, res });
    const data = e.data
    console.log('data',data)
    this.postMessage(data,[data.buffer]);
  },
  false
);

// worker线程计算结果
// var i = 0;
// function timedCount() {
//   for (var j = 0, sum = 0; j < 100; j++) {
//     for (var i = 0; i < 100000000; i++) {
//       sum += i;
//     }
//   }
//   // 调用 postMessage 向主线程发送计算结果消息
//   this.postMessage(sum);
// }
// postMessage("Before computing," + new Date().toLocaleString());
// timedCount();
// postMessage("After computing," + new Date().toLocaleString());

// self.close();
