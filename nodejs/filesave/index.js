var ghdownload = require("github-download"),
  exec = require("exec");

ghdownload(
  { user: "yuanguandong", repo: "react-dashboard-pro", ref: "master" },
  process.cwd()
)
  .on("dir", function (dir) {
    console.log(dir);
  })
  .on("file", function (file) {
    console.log(file);
  })
  .on("zip", function (zipUrl) {
    //only emitted if Github API limit is reached and the zip file is downloaded
    console.log(zipUrl);
  })
  .on("error", function (err) {
    console.error(err);
  })
  .on("end", function () {
    exec("tree", function (err, stdout, sderr) {
      console.log(stdout);
    });
  });
