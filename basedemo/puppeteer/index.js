const express = require("express");
const getPDF = require('./getPDF');
const getPNG = require('./getPNG');

const app = express();
const port = 9000;

app.get("/getPDF", async (req, res) => {
  const { url } = req.query;
  if (!url) { res.send({ status: 'error', msg: '缺少参数url' }) }
  const result = await getPDF({ url });
  res.send(result);
});

app.get("/getPNG", async (req, res) => {
  const { url, width: _width } = req.query;
  if (!url) { res.send({ status: 'error', msg: '缺少参数url' }) }
  const width = _width ? 1000 : Number(_width);
  const result = await getPNG({ url, width });
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



