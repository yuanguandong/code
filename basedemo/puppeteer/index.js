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



