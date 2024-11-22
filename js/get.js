// function get(obj, ...paths) {
//   let res = [];
//   for (let i = 0; i < paths.length; i++) {
//     let path = paths[i];
//     if (path.indexOf("[") > 0) {
//       path = path.replace(/\[/g, ".");
//       path = path.replace(/\]/g, "");
//     }
//     let pathArr = path.split(".");
//     let p = 0;
//     let objP = obj;
//     while (pathArr[p]) {
//       objP = objP[pathArr[p]];
//       p++;
//     }
//     res.push(objP);
//   }
//   return res;
// }
const obj = {
  selector: { to: { toutiao: "FE coder" } },
  target: [1, 2, { name: "byted" }],
};

function get(obj, path) {
  if (!path) {
    return obj;
  }
  const temp = path.replace(/[\[]/g, ".").replace(/\]/, "");
  const pathArr = temp.split(".");
  const currentPath = pathArr.shift();
  const child = obj[currentPath];
  return get(child, pathArr.join("."));
}

const res = get(obj, "target[2].name");
console.log("res", res);

// /* 运行代码 */
// get(obj, "selector.to.toutiao", "target[0]", "target[2].name")[
//   ("FE coder", 1, "byted")
// ];
// debugger
