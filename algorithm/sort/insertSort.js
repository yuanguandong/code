Array.prototype.insertSort = function () {
  let arr = this;
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    const temp = arr[j];

    while (j > 0) {
      if (arr[j - 1] > temp) {
        arr[j] = arr[j - 1];
      } else {
        break;
      }
      j--;
    }
    arr[j] = temp

  }
};

const arr = [5, 4, 3, 2, 1];
arr.insertSort();
console.log(arr);




