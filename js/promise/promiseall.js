const promise1 = new Promise((resolve, reject) => {
  resolve(1);
});

const promise2 = new Promise((resolve, reject) => {
  resolve(2);
});

const promise3 = new Promise((resolve, reject) => {
  reject(3);
}).catch((error) => {
  console.error(error);
})

const promiseArr = [promise1, promise2, promise3];

Promise.all = (arr) => {
  let results = [];
  let promiseCount = 0;
  let promisesLength = arr.length;
  return new Promise((resolve, reject) => {
    for (let val of arr) {
      Promise.resolve(val).then(
        function (res) {
          results[promiseCount] = res;
          promiseCount++;
          if (promiseCount === promisesLength) {
            return resolve(results);
          }
        },
        function (err) {
          return reject(err);
        }
      );
    }
  });
};

const result = Promise.all(promiseArr).then((res)=>{

  debugger
  
  console.log("res: ", res);
});


