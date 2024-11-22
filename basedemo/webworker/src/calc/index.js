class MyWorker {
  constructor() {
    this.init();
  }

  init() {
    this.worker = new Worker(`calc/worker.js?v=${Math.random()}`);
    this.worker.onmessage = this.onMessage.bind(this);
  }

  sendMessage() {
    const timmer1 = performance.now();
    this.uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
    for (var i = 0; i < this.uInt8Array.length; ++i) {
      this.uInt8Array[i] = i;
    }
    this.timmer = performance.now();
    console.log("create", this.timmer - timmer1);
    this.worker.postMessage(this.uInt8Array, [this.uInt8Array.buffer]);
  }

  onMessage(e) {
    this.uInt8Array = e.data;
    const timeuse = performance.now() - this.timmer;
    console.log("timeuse", timeuse);
    console.log("end", this.uInt8Array.length);
  }
}



const myWorker = new MyWorker();
$("#sendMessage").on("click", myWorker.sendMessage.bind(myWorker));
