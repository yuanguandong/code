importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

// 初始化
async function loadPyodideAndPackages() {
  if (!self.pyodide) {
    self.pyodide = await loadPyodide();
    await self.pyodide.loadPackage(["numpy", "pytz"]);
  }
}
let pyodideReadyPromise = loadPyodideAndPackages();

let python = `
  context = 1
  result = 1
`;

self.onmessage = async (event) => {
  await pyodideReadyPromise;
  const context = event.data;
  if (typeof context === "string") {
    python = context;
    return;
  }
  
  try {
    console.log('self.pyodide',self.pyodide)
    self.pyodide.globals['context'] = context
    // self.pyodide.globals['result'] = ''

    await self.pyodide.runPythonAsync(python);
    console.log('results',self.pyodide.globals.result)
    self.postMessage(self.pyodide.globals.result, [self.pyodide.globals.result.buffer]);
  } catch (error) {
    self.postMessage(error);
  }
};
