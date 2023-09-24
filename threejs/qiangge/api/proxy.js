const request = require('request');

module.exports = (req, res) => {
  // proxy middleware options
  let prefix = "/github-api"
  if (!req.url.startsWith(prefix)) {
    return;
  }
  let target = "https://github.com" + req.url.substring(prefix.length);

  var options = {
    'method': 'GET',
    'url': target,
    'headers': {

    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(response.body);
    res.end();
  });
}