var userList = [
  {name:'user1',age:18,province:'四川',city:'成都',district:'高新区'},
  {name:'user2',age:19,province:'四川',city:'成都',district:'天府新区'},
  {name:'user3',age:20,province:'四川',city:'南充',district:'顺庆区'},
  {name:'user4',age:22,province:'江苏',city:'南京',district:'鼓楼区'},
  {name:'user5',age:21,province:'江苏',city:'南京',district:'玄武区'},
  {name:'user6',age:21,province:'江苏',city:'镇江',district:'京口区'}
]

function list2tree(list, path) {
  let result = { name: "root", level: "root", children: [] };
  let paths = path.split("/");
  function generate(obj, item, i) {
    let path = paths[i];
    if (!obj.children) {obj.children = [];}
    if (!path) {
      if (obj.children.find((o) => o.name === item.name)) {return}
      obj.children.push(item);return;
    }
    let newObj = {name: item[path],level: path};
    if (obj.children.length == 0) {
      obj.children.push(newObj);
    } else {
      let arr = obj.children;
      for (let j = 0; j < arr.length; j++) {
        let objItem = arr[j];
        if (objItem.name === item[path]) {
          generate(objItem, item, i + 1);
        } else {
          if (arr.find((o) => o.name === newObj.name)) {continue;}
          obj.children.push(newObj);
        }
      }
    }
    generate(newObj, item, i + 1);
  }
  list.forEach((item) => {let i = 0;generate(result, item, i);});
  return result;
}

var userTree = list2tree(userList, "province/city/district");
console.log("userTree", userTree);

// ---------- 需要同样适用以下数据----------------
var data = [
  { name: "name1", a: "a1", b: "b1", c: "c1", d: "d1", e: "e1", f: "f1" },
  { name: "name2", a: "a2", b: "b2", c: "c2", d: "d2", e: "e2", f: "f2" },
  { name: "name2", a: "a3", b: "b3", c: "c3", d: "d3", e: "e3", f: "f3" },
];

var dataTree = list2tree(data, "a/c");
console.log("dataTree", dataTree);
