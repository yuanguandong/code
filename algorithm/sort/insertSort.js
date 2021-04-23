// Array.prototype.insertSort = function () {
//   let arr = this;
//   for (let i = 1; i < arr.length; i++) {
//     let j = i;
//     const temp = arr[j];

//     while (j > 0) {
//       if (arr[j - 1] > temp) {
//         arr[j] = arr[j - 1];
//       } else {
//         break;
//       }
//       j--;
//     }
//     arr[j] = temp

//   }
// };

Array.prototype.insertSort = function () {
  for (let i = 1; i < this.length; i++) {
    let j = i;
    let temp = this[j];
    while (j > 0) {
      if (this[j - 1] > temp) {
        this[j] = this[j - 1];
      }else{
        break
      }
      j--;
    }
    this[j] = temp;
  }
};

const arr = [5, 4, 3, 2, 1];
arr.insertSort();
console.log(arr);
