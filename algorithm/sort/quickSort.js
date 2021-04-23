Array.prototype.quickSort = function () {
  const res = (arr) => {
    if (arr.length <= 1) {
      return arr;
    }
    let left = [];
    let right = [];
    let mid = arr[0];
    for (let i = 1; i < arr.length; i += 1) {
      if (arr[i] < mid) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return [...res(left), mid, ...res(right)];
  };

  let temp = res(this);
  temp.forEach((n, i) => {
    this[i] = n;
  });
};

const arr = [5, 4, 3, 2, 1];
arr.quickSort();
console.log(arr);
