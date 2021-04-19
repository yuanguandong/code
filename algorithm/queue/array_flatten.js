function flatten(arr) {
  let result = [];
  arr.forEach((element) => {
    if (Array.isArray(element)) {
      result = result.concat(flatten(element));
    } else {
      result = result.concat(element);
    }
  });
  return result;
}
let a = [[1, [2, [3, [4]]]]];
debugger
// let b = flatten(a);
// console.log("b", b);

console.log(Array.from(new Set([1, 1, 1, 2, 2, 2])));
