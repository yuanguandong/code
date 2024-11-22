// 分治法
// 时间复杂度：n*log(N)
// 空间复杂度：n

Array.prototype.quickSort = function () {
  const res = (arr) => {
    if (arr.length <= 1) {
      return arr;
    }

    //找到基线
    let left = [];
    let right = [];
    let mid = arr[0];

    //遍历当前内容，按照基线去划分左右
    for (let i = 1; i < arr.length; i += 1) {
      if (arr[i] < mid) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    //递归处理
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
