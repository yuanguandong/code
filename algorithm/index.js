const list = [[1, 2, [5, [5, [6]]], 3]];
const list1 = [1, 2, 3, 4];

//扁平化
const flat1 = (list) => {
  let res = [];
  for (let i = 0; i < list.length; i++) {
    if (Array.isArray(list[i])) {
      res = res.concat(flat(list[i]));
    } else {
      res = [...res, list[i]];
    }
  }
  return res;
};

const flat2 = (list) => {
  return list.reduce((total, cur, index, array) => {
    return total.concat(Array.isArray(cur) ? flat2(cur) : cur);
  }, []);
};

function flat3(arr) {
  while (arr.some((o) => Array.isArray(o))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// console.log(flat3(list));

//reverse
const reverse = (arr) => {
  let res = [];
  while (arr.length) {
    res = [...res, arr.pop()];
  }
  return res;
};

const list2 = ["a", "b", "a", "a", "b"];

const findLess = (arr) => {
  const map = new Map();
  list2.forEach((item, index) => {
    const has = map.get(item);
    if (has) {
      map.set(item, has + 1);
    } else {
      map.set(item, 1);
    }
  });
  let min;
  let minKey;
  map.forEach((value, key) => {
    if (value < min) {
      min = value;
      minKey = key;
    }
    minKey = key;
  });
  return minKey;
};

// console.log(findLess(list2));

const a = new Set([{a:1}])
// let o = {a: 1, b: 2};
// let b = {a: 1, b: 2};
// a.add(o)
// a.add(b)
// a.delete(o)
console.log(...a)