const promise1 = new Promise((resolve, reject) => {
  resolve(1);
});

const promise2 = new Promise((resolve, reject) => {
  resolve(2);
});

const promise3 = new Promise((resolve, reject) => {
  reject(3);
}).catch((error) => {
  // console.error(error);
})

const promiseArr = [promise1, promise2,promise3];




Promise.all = function(arr){
  let count = 0
  let results = []
  return new Promise(function(resolve, reject){
    for(let i = 0; i< arr.length; i++){
      Promise.resolve(arr[i]).then((res)=>{
        results[i]=res
        count++;
        if(count===arr.length){
          return resolve(results)
        }
      },(err)=>{
        return reject(err)
      })
    }
    
  })
}




const result = Promise.all(promiseArr).then((res)=>{

  debugger
  
  console.log("res: ", res);
});























// Promise.all = (arr) => {
//   let results = [];
//   let promiseCount = 0;
//   let promisesLength = arr.length;
//   return new Promise((resolve, reject) => {
//     for (let val of arr) {
//       Promise.resolve(val).then(
//         function (res) {
//           results[promiseCount] = res;
//           promiseCount++;
//           if (promiseCount === promisesLength) {
//             return resolve(results);
//           }
//         },
//         function (err) {
//           return reject(err);
//         }
//       );
//     }
//   });
// };


