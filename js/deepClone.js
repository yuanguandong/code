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
  date: new Date(),
  reg: new RegExp(),
  friends: [1, 2, 3, [22, 33]],
};

function clone(obj) {
  let newObj = {};
  for (let i in obj) {
    newObj[i] = obj[i];
  }
  return newObj;
}

function copy(obj) {
  let newObj = null;
  if (typeof obj === "object" && typeof obj !== null) {
    if (obj instanceof Array) {
      newObj = [];
      for (let i in obj) {
        newObj[i] = copy(obj[i]);
      }
    } else if (obj instanceof Date) {
      newObj = new Date(obj)
    } else if (obj instanceof RegExp) {
      newObj = new RegExp(obj)
    } else {
      newObj = {};
      for (let i in obj) {
        newObj[i] = copy(obj[i]);
      }
    }
  } else {
    newObj = obj;
  }
  return newObj;
}

var obj2 = copy(obj);

obj2.name = "修改成功";
obj2.main.a = 100;
console.log(obj, obj2);

debugger;
