Function.prototype.call = function (context, args) {
  let symbolFn = Symbol("fn");
  symbolFn = this;
  context[symbolFn](args);
  delete context[symbolFn];
};

Function.prototype.apply = function (context, args) {
  let symbolFn = Symbol("fn");
  symbolFn = this;
  context[symbolFn](...args);
  delete context[symbolFn];
};

Function.prototype.bind = function (context) {
  let symbolFn = Symbol("fn");
  symbolFn = this;
  return function () {
    let result = context[symbolFn](...arguments);
    delete context[symbolFn];
    return result;
  };
};

