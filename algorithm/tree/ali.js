var userList = [
  {
    name: "user1",
    age: 18,
    province: "四川",
    city: "成都",
    district: "高新区",
  },
  {
    name: "user2",
    age: 19,
    province: "四川",
    city: "成都",
    district: "天府新区",
  },
  {
    name: "user3",
    age: 20,
    province: "四川",
    city: "南充",
    district: "顺庆区",
  },
  {
    name: "user4",
    age: 22,
    province: "江苏",
    city: "南京",
    district: "鼓楼区",
  },
  {
    name: "user5",
    age: 21,
    province: "江苏",
    city: "南京",
    district: "玄武区",
  },
  {
    name: "user6",
    age: 21,
    province: "江苏",
    city: "镇江",
    district: "京口区",
  },
];

var data = [     
  {name:'name1',a:'a1',b:'b1',c:'c1',d:'d1',e:'e1',f:'f1'},
  {name:'name2',a:'a2',b:'b2',c:'c2',d:'d2',e:'e2',f:'f2'},
  {name:'name2',a:'a3',b:'b3',c:'c3',d:'d3',e:'e3',f:'f3'},
]

function list2tree(list, path) {
  const res = { id: "root", name: "root", children: [] };
  const pathArr = path.split("/");
  while (list.length > 0) {
    const item = list.shift();
    const index = 0;
    const rec = (resItem, index) => {
      if (index > pathArr.length) {
        return item;
      }
      resItem.children = resItem.children || [];
      const has = resItem.children.find(
        (child) => child.name === item[pathArr[index]]
      );
      const newItem = {
        name: item[pathArr[index]],
        level: pathArr[index],
        children: [],
      };
      if (has) {
        rec(has, index + 1);
      } else {
        resItem.children.push(rec(newItem, index + 1));
      }
      return resItem;
    };
    rec(res, index);
  }
  return res;
}

var userTree = list2tree(data, "a/b/c/d");

console.log(JSON.stringify(userTree, null, 2));

const res = {
  id: "root",
  name: "root",
  children: [
    {
      name: "四川",
      level: "province",
      children: [
        {
          name: "天府新区",
          level: "district",
          children: [
            {
              name: "user1",
              age: 18,
            },
          ],
        },
      ],
    },
    {
      name: "江苏",
      level: "province",
    },
  ],
};
