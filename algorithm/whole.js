let arr = ["a", "b", "c", "d"];

// function p(arr) {
//   let res = [];
//   let s = [];
//   for (let i = 0; i < arr.length; i++) {
//     s.push(arr[i])
//     for (let j = 0; j < res.length; j++) {
//       s.push(res[j] + arr[i]);
//     }
//     res = [...s]

//   }
//   // console.log("s", s);
//   console.log("res", res);
// }

// p(arr);

// function getGroup(arr, index, group) {
//   let arrTemp = [];
//   arrTemp.push(arr[index]);
//   for (let i = 0; i < group.length; i++) {
//     arrTemp.push(group[i] + arr[index]);
//   }
//   group = group.concat(arrTemp);
//   if (index >= arr.length-1) {
//     return group;
//   } else {
//     return getGroup(arr, index + 1, group);
//   }
// }

// let a = getGroup(arr, 0, []);

// const whole=(n)=>{
//   let arr1 = []
//   for(let i=1; i<n;i++){
//     arr1.push(String(i))
//   }
//   return getGroup(arr1, 0, [])
// }

// let b = whole(5)
// console.log('b',b)



var permute = function(nums) {
  const res = []
  const recursion = (arr = []) => {

      if (arr.length === nums.length) {
          res.push(arr)
          return
      }
      for (let i = 0; i < nums.length; i++) {
          if (!arr.includes(nums[i])) {
              recursion([...arr, nums[i]])
          }
      }
  }
  recursion([])
  return res
};


const b = permute(arr)
debugger