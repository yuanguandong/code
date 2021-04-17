
// for in 主要用来遍历对象的key，可以遍历原型链上的属性
// Array.prototype.method = function () {
//   console.log(this.length);
// };
// var myArray = [1, 2, 4, 5, 6, 7];
// myArray.name = "数组";
// for (var index in myArray) {
//   console.log('index',index);
//   console.log(myArray[index]);
// }

// for of 主要用来遍历对象的value, 不可以遍历原型链上的属性
// Array.prototype.method = function () {
//   console.log(this.length);
// };
// var myArray = [1, 2, 4, 5, 6, 7];
// myArray.name = "数组";
// for (var value of myArray) {
//   console.log(value);
// }


Object.prototype.method = function () {
  console.log(this);
};
var myObject = {
  a: 1,
  b: 2,
  c: 3,
};
for (var key in myObject) {
  // if (myObject.hasOwnProperty(key)) {
    console.log(key);
  // }
}

