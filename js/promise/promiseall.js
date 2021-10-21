const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});

const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(3);
  }, 3000);
}).catch((error) => {
  // error
  // console.error(error);
});

const promiseArr = [promise1, promise2, promise3];

Promise.prototype.all = function (promiseArr) {
  let index = 0;
  let result = [];
  const length = promiseArr.length;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < length; i++) {
      promise.resolve(promiseArr[i]).then(
        (value) => {
          result.push(value);
          index++;
          if (index === length) {
            return resolve(result);
          }
        },
        (error) => {
          return reject(error);
        }
      );
    }
  });
};

Promise.prototype.race = function (promiseArr) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseArr.length; i++) {
      promise.resolve(promiseArr[i]).then(
        (value) => {
          return resolve(result);
        },
        (error) => {
          return reject(error);
        }
      );
    }
  });
};

const result = Promise.race(promiseArr).then(
  (res) => {
    debugger;

    console.log("res: ", res);
  },
  (error) => {
    console.log("error", error);
  }
);
debugger;
