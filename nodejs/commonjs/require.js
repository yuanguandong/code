const vm = require("vm");
const path = require("path");
const fs = require("fs");

function myRequire(filename) {
  const pathToFile = path.resolve(__dirname, filename);
  const content = fs.readFileSync(pathToFile, "utf-8");
  const wrapper = [
    "(function(myRequire,myModule,myExports,__dirname,__filename,Author){",
    "})",
  ];
  const wrapperContent = wrapper[0] + content + wrapper[1];
  const script = new vm.Script(wrapperContent, {
    filename,
  });
  const myModule = {
    myExports: {},
  };
  const result = script.runInThisContext();
  result(
    myRequire,
    myModule,
    myModule.myExports,
    pathToFile,
    filename,
    "Favori"
  );
  return myModule.myExports;
}

global.myRequire = myRequire;
