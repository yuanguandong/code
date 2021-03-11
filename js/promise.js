function Promi(fn) {
  let _this = this;
  _this.state = "pending";
  _this.successCallback = null;
  _this.failCallback = null;

  _this.reslove = function reslove(params) {
    if (_this.state === "pending") {
      _this.successCallback && _this.successCallback(params);
      _this.state = "resolved";
    }
  };

  _this.reject = function (params) {
    if (_this.state === "pending") {
      _this.successCallback && _this.failCallback(params);
      _this.state = "rejected";
    }
  };
  _this.then = function (success, fail) {
    _this.successCallback = success;
    _this.failCallback = fail;
  };

  fn.call(_this, _this.reslove, _this.reject);
}

new Promi((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
}).then((res) => {
  console.log("res", res);
});
