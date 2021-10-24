// 冒泡排序
// 时间复杂度：n^2
// 空间复杂度：n

Array.prototype.bubbleSort = function () {
  const arr = this;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
};

const arr = [5, 4, 3, 2, 1];
arr.bubbleSort();
console.log(arr);
