var ghdownload = require("github-download"),
  exec = require("exec");

console.log(process.cwd());
const defaultUrl = process.cwd() + "/widgets";
ghdownload(
  { user: "yuanguandong", repo: "react-dashboard-pro", ref: "master",dir:"/widgets" },
  defaultUrl
);
// .on("dir", function (dir) {
//   console.log(dir);
// })
// .on("file", function (file) {
//   console.log(file);
// })
// .on("zip", function (zipUrl) {
//   //only emitted if Github API limit is reached and the zip file is downloaded
//   console.log(zipUrl);
// })
// .on("error", function (err) {
//   console.error(err);
// })
// .on("end", function () {
//   exec("tree", function (err, stdout, sderr) {
//     console.log(stdout);
//   });
// });
