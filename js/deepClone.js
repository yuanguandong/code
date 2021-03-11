var obj = {
  //原数据，包含字符串、对象、函数、数组等不同的类型
  name: "test",
  main: {
    a: 1,
    b: 2,
  },
  fn: function () {
    alert(1);
  },
  friends: [1, 2, 3, [22, 33]],
};

function copy(obj) {
  let newobj = null; //声明一个变量用来储存拷贝之后的内容

  //判断数据类型是否是复杂类型，如果是则调用自己，再次循环，如果不是，直接赋值即可，
  //由于null不可以循环但类型又是object，所以这个需要对null进行判断
  if (typeof (obj) == 'object' && obj !== null) {

    //声明一个变量用以储存拷贝出来的值,根据参数的具体数据类型声明不同的类型来储存
    newobj = obj instanceof Array ? [] : {};

    //循环obj 中的每一项，如果里面还有复杂数据类型，则直接利用递归再次调用copy函数
    for (var i in obj) {
      newobj[i] = copy(obj[i])
    }
  } else {
    newobj = obj
  }
  return newobj; //函数必须有返回值，否则结构为undefined
}

var obj2 = copy(obj)
debugger
obj2.name = '修改成功'
obj2.main.a = 100
console.log(obj, obj2)

