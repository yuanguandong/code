Array.prototype.binaryFind = function(val) {
  let low = 0;
  let high = this.length - 1;
  while (low <= high) {
    let midIndex = Math.floor((low + high) / 2);
    if (val < this[midIndex]) {
      high = midIndex - 1;
    } else if (val > this[midIndex]) {
      low = midIndex + 1;
    } else {
      return midIndex;
    }
  }
  return -1;
};

let arr = [1, 2, 3, 4, 5];
let res = arr.binaryFind(3);

console.log("res", res);
