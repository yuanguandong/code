//构造函数
function test() {}
//实例
const Test = new test()

test.prototype.then1 = function () {
  console.log("test => then");
};


Function.prototype.mythen = function () {
  console.log("Function => mythen");
};


//构造函数new出来的实例可以调用构造函数prototype的属性
Test.then1()

//报错
Test.mythen()

