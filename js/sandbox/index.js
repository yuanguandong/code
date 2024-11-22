// const str = `window.a = 1; function add(b){return window.a+b}; window.b = add(5)`
// eval(str)
// let a = 1
// let str = `console.log(name)`
// let fun1 = new Function('name', str)
// fun1(a)
// with (fun1) { a = 2 }
// fun1(a)

// 监控执行代码
function compileCode(src) {
  src = `with (exposeObj){${src}}`
  return new Function('exposeObj', src)
}
// 代理对象
function proxyObj(originObj) {
  let exposeObj = new Proxy(originObj, {
    has: (target, key) => {
      if (['console', 'Math', 'Date'].indexOf(key) >= 0) {
        return target[key]
      }
      if (!target.hasOwnProperty(key)) {
        throw new Error(`${target}上不存在${key}`)
      }
      return target[key]
    }
  })
  return exposeObj
}
// 创建沙盒
function createSandbox(src, obj) {
  let proxy = proxyObj(obj);
  compileCode(src).call(proxy, proxy)
}

const testObj = {
  value: 1,
  a: {
    b: 2
  },
  c: '3'
}
const c = 'c'
createSandbox(`value='32323';console.log(c);`, testObj)