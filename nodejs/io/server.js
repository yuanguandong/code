const express = require("express");
const list = require("./index");

const app = express();
const port = 9000;

app.use(express.static(__dirname + "/public"));

app.get("/request", function (req, res) {
  console.log("list", list.getList());
  res.send(list.getList());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
