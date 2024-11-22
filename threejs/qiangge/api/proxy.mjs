import request from "request";

export default (req, res) => {
  // proxy middleware options
  let prefix = "/resources-api";
  if (!req.url.startsWith(prefix)) {
    return;
  }
  let target = "https://yuanguandong.github.io/" + req.url.substring(prefix.length);

  var options = {
    method: "GET",
    url: target,
    headers: {
      // "Content-Type": "application/json",
      // Accept: "application/json",
      'User-Agent': 'Mozilla/5.0', // 设置 User-Agent
    },
  };
  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   res.writeHead(200, {
  //     "Content-Type": "model/gltf+json",
  //     "Content-Disposition": "attachment; filename=model.gltf",
  //   });
  //   res.write(response.body);
  //   res.end();
  // });
  request(options).pipe(res);
};
