self.addEventListener(
  "message",
  async function (e) {
    const data = e.data
    for(let i =0;i<data.length;i++){

    }
    this.postMessage(data,[data.buffer]);
  }
);
