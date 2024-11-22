const arr = [5, 4, 3, 2, 1];

Array.prototype.mergeSort = function () {
  const rec = (arr) => {
    if (arr.length === 1) {
      return arr;
    }
    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid, arr.length);
    let leftRes = rec(left);
    let rightRes = rec(right);
    let res = [];
    while (leftRes.length || rightRes.length) {
      if (leftRes.length && rightRes.length) {
        res.push(leftRes[0] < rightRes[0] ? leftRes.shift() : rightRes.shift());
      } else if (leftRes.length) {
        res.push(leftRes.shift());
      } else if (rightRes.length) {
        res.push(rightRes.shift());
      }
    }
    return res;
  };
  const res = rec(this);
  res.forEach((item, index) => {
    this[index] = item;
  });

};

arr.mergeSort();
debugger;
