const getPDF = require('./getPDF');
const getPNG = require('./getPNG');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 9000;
app.use(bodyParser.json());

app.get("/getPDF", async (req, res) => {
  const url = req.query.url;
  const result = await getPDF({ url });
  res.send(result);
});

app.get("/getPNG", async (req, res) => {
  const url = req.query.url; // 截图的url
  const name = req.query.name; // 截图的名字
  const width = !req.query.width ? 1000 : Number(req.query.width);
  const result = await getPNG({ url, name, width });
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// 截图
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   const a = await page.screenshot({ path: 'example.png' });
//   await browser.close();
// })();

// // 执行脚本
// (async () => {
//   await page.goto('https://www.all1024.com', {
//     waitUntil: 'networkidle2',
//   });
//   console.log('a',a)
//   await page.pdf({ path: '1024.pdf', format: 'a4' });
//   const dimensions = await page.evaluate(() => {
//     return {
//       width: document.documentElement.clientWidth,
//       height: document.documentElement.clientHeight,
//       deviceScaleFactor: window.devicePixelRatio,
//     };
//   });
//   console.log('Dimensions:', dimensions);
// })()

//代理
// (async () => {
//   const browser = await puppeteer.launch({
//     // Launch chromium using a proxy server on port 9876.
//     // More on proxying:
//     //    https://www.chromium.org/developers/design-documents/network-settings
//     args: [ '--proxy-server=127.0.0.1:8000' ]
//   });
//   const page = await browser.newPage();
//   await page.goto('http://baidu.com');
//   await browser.close();
// })();

// 表单
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   // 地址栏输入网页地址
//   await page.goto('https://baidu.com/', {
//       waitUntil: 'networkidle2',
//   });

//   // 输入搜索关键字
//   await page.type('#kw', '腾讯公司', {
//      delay: 1000, // 控制 keypress 也就是每个字母输入的间隔
//   });

//   // 回车
//   await page.keyboard.press('Enter');
// })();

