let arr = [
  { id: 5, name: "部门5", pid: 4 },
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  
];

const toTree = () => {
  let res = []
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const { id } = item;
    map[id] = item;
  }
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const { id, pid } = item;
    if(pid === 0){
      res.push(item)
    }
    if (map[pid]) {
      if (!map[pid].children) {
        map[pid].children = [];
      }
      map[pid].children = [...map[pid].children, item];
    }
  }
  return res
  console.log(JSON.stringify(map,null,4));
};

console.log(JSON.stringify(toTree(arr),null,4));
