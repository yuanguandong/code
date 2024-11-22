const pyodideWorker = new Worker("/webworker.js");

let callback

pyodideWorker.onmessage = (event) => {
  const result = event.data;
  const onSuccess = callback
  onSuccess(result);
};

const asyncRun = (() => {
  return (python, context) => {
    return new Promise((onSuccess) => {
      callback = onSuccess;
      pyodideWorker.postMessage(python);
      pyodideWorker.postMessage(context, [context.buffer]);
    });
  };
})();

export { asyncRun };
