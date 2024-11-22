
var userList = [
  {name:'user1',age:18,province:'四川',city:'成都',district:'高新区'},
  {name:'user2',age:19,province:'四川',city:'成都',district:'天府新区'},
  {name:'user3',age:20,province:'四川',city:'南充',district:'顺庆区'},
  {name:'user4',age:22,province:'江苏',city:'南京',district:'鼓楼区'},
  {name:'user5',age:21,province:'江苏',city:'南京',district:'玄武区'},
  {name:'user6',age:21,province:'江苏',city:'镇江',district:'京口区'}
]

// 根据parentkey, 和id, list转树形结构数据
function generateTree(data, parentKey, childrenKey, idKey) {
  data.forEach(function (item) {
    delete item[childrenKey];
  });
  let map = {};
  data.forEach(function (item) {
    map[item[idKey]] = item;
  });
  let val = [];
  data.forEach(function (item, index) {
    let parent = map[item[parentKey]];
    if (parent) {
      (parent[childrenKey] || (parent[childrenKey] = [])).push(item);
    } else {
      val.push(item);
    }
  });
  return val;
}

function list2tree(list, path) {
  let listTemp = list;
  //path数组
  let pathKeys = path.split('/')
  //相同地区的用户生成用户集合
  let addressObj = {};
  //给每条数据生成path,把path作为addressObj的key,用户作为value
  listTemp.map((item) => {
    pathKeys.forEach((path) => {
      let pathTemp = item.path || "";
      item.path = pathTemp + "." + item[path];
    });
    let key = item.path.slice(1);
    let obj = addressObj[key] || [];
    addressObj[key] = [...obj, item];
  });
  //生成带parent和path字段的地址数据
  let address = [];
  Object.keys(addressObj).map((key) => {
    let paths = key.split(".");
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      let parent = paths[i - 1] || "root";
      address.push({
        name: path,
        level: pathKeys[i],
        path: key,
        parent,
      });
    }
  });
  //数组去重
  for (let i = 0; i < address.length; i++) {
    for (let j = i + 1; j < address.length; j++) {
      if (
        address[i].name === address[j].name &&
        address[i].parent === address[j].parent
      ) {
        address.splice(j, 1);
      }
    }
  }
  //生成地址树
  let tree = generateTree(address, "parent", "children", "name");
  //迭代树赋值用户列表
  function interatorTree(nodes) {
    nodes.forEach((item) => {
      if (addressObj[item.path] && !item.children) {
        item.children = addressObj[item.path];
      }
      delete item.parent;
      delete item.path;
      if (item.children) {
        interatorTree(item.children);
      }
    });
  }
  interatorTree(tree);
  let result = {
    id: "root",
    name: "root",
    children: tree,
  };
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
s