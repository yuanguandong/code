let arr = [
  
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
  { id: 1, name: "部门1", pid: 0 },
];

// const convert = () => {
//   const obj = {};
//   arr.forEach((item) => {
//     obj[item.id] = item;
//   });
//   let res = [];
//   while (arr.length) {
//     const item = arr.pop();
//     const pid = item.pid;
//     if (!obj[pid]) {
//       res.push(item);
//     } else {
//       if(!obj[pid].children) obj[pid].children = [];
//       obj[pid].children.push(item);
//     }
//   }
//   return res
// };



// const r = convert();

// console.log(JSON.stringify(r,null,4))


function arrayToTree(items) {
  const result = [];   // 存放结果集
  const itemMap = {};  // 
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children']
    }

    const treeItem =  itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }

  }
  return result;
}

const r = arrayToTree(arr)
console.log(JSON.stringify(r,null,4))