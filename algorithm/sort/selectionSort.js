Array.prototype.selectionSort = function () {
  let indexMin = 0;
  let arr = this;
  for (let j = 0; j < this.length; j += 1) {
    if (arr[j] < arr[indexMin]) {
      let temp = arr[j];
      arr[j] = arr[indexMin];
      arr[indexMin] = temp;
    }
  }
};

const arr = [5, 4, 3, 2, 1];
arr.selectionSort();
console.log(arr);
