import { asyncRun } from "./pyworker";

const script = `
    import statistics
    from js import A_rank
    statistics.stdev(A_rank)
`;

const uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i;
}
const context = {
  A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
  uInt8Array,
};

async function main() {
  try {
    const timmer = performance.now();
    const { results, error } = await asyncRun(script, context);
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

main();

$("#sendMessage").on("click", async () => {
  const timmer = performance.now();
  const { results, error } = await asyncRun(script, context);
  console.log("exec timeuse", performance.now() - timmer);
});
