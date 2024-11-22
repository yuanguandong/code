const arr = [1, 2, 3, 4];

Array.prototype.MyReduce = function (callback, initialArray) {
  let instance = this;
  if (!callback) {
    return initialArray;
  }
  const fn = function (res, index) {
    if (index >= instance.length) {
      return res;
    }
    const currentValue = instance[index];
    return fn(callback(res, currentValue, index, instance), index + 1);
  };
  return fn(initialArray, 0);
};

const res = arr.MyReduce((result, currentValue, index, array) => {
  return result + currentValue;
}, 0);

console.log("res", res);
