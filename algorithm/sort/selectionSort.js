// Array.prototype.selectionSort = function () {

//   let arr = this;
//   for (let i = 0; i < arr.length-1; i++) {
//     let indexMin = i;
//     for (let j = i; j < arr.length; j += 1) {
//       if (arr[j] < arr[indexMin]) {
//         indexMin = j;
//       }
//     }
//     let temp = arr[i];
//     arr[i] = arr[indexMin];
//     arr[indexMin] = temp;
//   }
// };

Array.prototype.selectionSort = function () {
  let arr = this;
  
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i; j < arr.length; j++) {
      if(arr[j] < arr[minIndex]){
        minIndex = j
      }
    }
    let temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
};

const arr = [5, 4, 3, 2, 1];
arr.selectionSort();
console.log(arr);
