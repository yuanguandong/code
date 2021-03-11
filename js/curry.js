// 普通的add函数
function add(x, y) {
  return x + y
}

function curry (fn, currArgs) {
  return function() {
      let args = [].slice.call(arguments);

      // 首次调用时，若未提供最后一个参数currArgs，则不用进行args的拼接
      if (currArgs !== undefined) {
          args = args.concat(currArgs);
      }

      // 递归调用
      if (args.length < fn.length) {
          return curry(fn, args);
      }

      // 递归出口
      return fn(...args);
  }
}

// add(1, 2)           // 3
let curryAdd = curry(add)
console.log(curryAdd(1)(2)(3))



 //函数柯里化
 function add() {
  const _args = [...arguments]

  function fn() {
    _args.push(...arguments)
    return fn
  }
  fn.toString = function () {
    return _args.reduce((sum, cur) => sum + cur)
  }
  return fn
}
add(1)(2)