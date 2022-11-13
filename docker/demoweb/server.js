const Koa = require("koa");
const app = new Koa();
const fs = require("fs"); //引入他的模块之后调用读取文件的方法
const data = fs.readFileSync("file.txt", "utf-8");

// response
app.use((ctx) => {
  ctx.body = data;
});

app.listen(3000);
console.log("Server running at http://127.0.0.1:3000");
