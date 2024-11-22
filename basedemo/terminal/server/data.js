module.exports = `const express = require("express");
const expressWs = require("express-ws");
const pty = require("node-pty");
const os = require("os");

const app = express();
const port = 4000;

expressWs(app);

// 创建终端子进程
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
const term = pty.spawn(shell, ["--login"], {
  name: "xterm-color",
  cols: 80,
  rows: 24,
  cwd: process.env.HOME,
  env: process.env,
});

// 暴露socket
app.ws("/socket", (ws, req) => {
  // 编码转换
  term.onData(function (data) {
    ws.send(data);
  });
  // 收到输入
  ws.on("message", (data) => {
    term.write(data);
  });
  ws.on("close", function () {
    term.kill();
  });
});

app.listen(port, "127.0.0.1", () => {

});
`