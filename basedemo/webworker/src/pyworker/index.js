import { asyncRun } from "./pyworker";

class MyWorker {
  script = `
      import statistics
  `;

  constructor() {
    this.uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
    for (var i = 0; i < this.uInt8Array.length; ++i) {
      this.uInt8Array[i] = i;
    }
    this.main;
  }

  async main() {
    try {
      const timmer = performance.now();
      const results = await asyncRun(script, this.uInt8Array);
      this.uInt8Array = results;
      console.log("init timeuse", performance.now() - timmer);
      if (results) {
        console.log("pyodideWorker return results: ", results);
      } else if (error) {
        console.log("pyodideWorker error: ", error);
      }
    } catch (e) {
      console.log(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`);
    }
  }
}

const myWorker = new MyWorker();

$("#sendMessage").on("click", async () => {
  const timmer = performance.now();
  const results = await asyncRun(myWorker.script, myWorker.uInt8Array);
  myWorker.uInt8Array = results;
  console.log("execResult", results);
  console.log("exec timeuse", performance.now() - timmer);
});
