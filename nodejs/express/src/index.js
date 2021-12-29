const stocksApi = require("stock-api");
const express = require("express");
const bodyParser = require("body-parser");
const founds = require("./found");
var rp = require("request-promise");

const app = express();
const port = 9000;

app.use(bodyParser.json());

app.post("/searchStocks", async (req, res) => {
  const params = req.body || {};
  const { keywords } = params;
  // 获取股票组实时数据
  const result = await stocksApi.stocks.tencent.searchStocks([keywords]);
  res.send(result);
});

app.post("/getStock", async (req, res) => {
  const params = req.body || {};
  const { code } = params;
  // 获取股票组实时数据
  const result = await stocksApi.stocks.tencent.getStock(code);
  res.send(result);
});

app.post("/searchFounds", async (req, res) => {
  const params = req.body || {};
  const { keywords } = params;
  const searchResArr = founds.filter((f) => {
    let res = false;
    f.forEach((o) => {
      if (o.includes(keywords)) {
        res = true;
      }
    });
    return res;
  });
  const result = [];
  searchResArr.forEach((o) => {
    result.push({
      code: o[0],
      name: o[2],
    });
  });
  res.send(result);
});

app.post("/getFound", async (req, res) => {
  const params = req.body || {};
  const { code } = params;
  // 获取股票组实时数据
  const str = await rp(`https://fundgz.1234567.com.cn/js/${code}.js`);

  let result = {};
  try {
    const reg = /jsonpgz\((.*)\);/;
    const jsonStr = str.match(reg)[1];
    const obj = JSON.parse(jsonStr);
    // console.log()
    if (obj) {
      result = obj;
    }
  } catch {
    console.log(`不存在${code}`);
  }
  console.log("result: " + result);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
