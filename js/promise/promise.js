function Promi(fn) {
  var _this = this;
  _this.state = "pending";
  _this.successCallback = null;
  _this.failCallback = null;

  _this.resolve = function (params) {
    if (_this.state !== "resolved") {
      _this.successCallback && _this.successCallback(params);
      _this.state = "resolved";
    }
  };

  _this.reject = function (params) {
    if (_this.state !== "rejected") {
      _this.failCallback && _this.failCallback(params);
      _this.state = "rejected";
    }
  };

  _this.then = function (success, fail) {
    _this.successCallback = success;
    _this.failCallback = fail;
  };

  fn.call(_this, _this.resolve, _this.reject);
}

Promi.all = arr => {
  let aResult = [];    //用于存放每次执行后返回结果
  return new Promi(function (resolve, reject) {
    let i = 0;
    next();    // 开始逐次执行数组中的函数(重要)
    function next() {
      arr[i].then(function (res) {
        aResult.push(res);    // 存储每次得到的结果
        i++;
        if (i == arr.length) {    // 如果函数数组中的函数都执行完，便resolve
          resolve(aResult);
        } else {
          next();
        }
      })
    }
  })
};

new Promi((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
}).then((res) => {
  console.log(res);
});

const a = Promi.all([
  new Promi((resolve, reject) => {
    resolve(1);
  }),
  new Promi((resolve, reject) => {
    reject(2);
  }),
]);

a.then(
  (res) => {console.log(1)},
  (rej) => {console.log(2)}
);
