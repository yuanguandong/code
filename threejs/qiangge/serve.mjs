const url =
  "https://yuanguandong.github.io/code/threejs/qiangge/static/models/gltf/RobotExpressive/RobotExpressive.glb";
import request from "request";

// proxy middleware options
// let prefix = "/github-api"
// if (!req.url.startsWith(prefix)) {
//   return;
// }
// let target = "https://github.com" + req.url.substring(prefix.length);

var options = {
  method: "GET",
  url: url,
  headers: {
    // "Content-Type": "application/json",
    // Accept: "application/json",
    'User-Agent': 'Mozilla/5.0', // 设置 User-Agent
  },
};
// request(options, async function (error, response) {
//   if (error) throw new Error(error);

//   // console.log('res',res)
//   res.writeHead(200, {
//     "Content-Type": "application/json",
//     "Content-Disposition": "attachment; filename=model.gltf",
//   });
//   res.write(response.body);

//   res.end();
// });
request(options).pipe(res);