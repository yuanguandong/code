// 多实例沙箱实现
class MultipleProxySandbox {
  active() {
    this.sandboxRunning = true;
  }
  inactive() {
    this.sandboxRunning = false;
  }
  constructor() {
    const rawWindow = window;
    const fakeWindow = {};
    const proxy = new Proxy(fakeWindow, {
      set: (target, prop, value) => {
        if (this.sandboxRunning) {
          target[prop] = value;
          return true;
        }
      },
      get: (target, prop) => {
        // 如果fakeWindow里面有，就从fakeWindow里面取，否则，就从外部的window里面取
        let value = prop in target ? target[prop] : rawWindow[prop];
        return value
      }
    })
    this.proxy = proxy;
  }
}

// 创建沙箱
const newSandBox1 = new MultipleProxySandbox();
// 激活沙箱
newSandBox1.active();
// 获取代理对象
const proxyWindow1 = newSandBox1.proxy;


// eval(
//   // 这里将 proxy 作为 window 参数传入
//   // 子应用的全局对象就是该子应用沙箱的 proxy 对象
//   (function (window) {
//     /* 子应用脚本文件内容 */
//     
//   })(proxyWindow1)
// );

// 执行字符串code
window.b = 'b'
proxyWindow1.a = 'a';
console.log('proxyWindow1.a', proxyWindow1.a)
console.log('window.a', window.a)
const code = `
console.log('沙箱内部this',this); 
console.log(window); 
console.log('直接在代理上获取a属性',window.a); 
console.log('在代理上获取b属性',window.b); 
window.b = 'b更改了';
console.log('沙箱内部更改后window.b',window.b);
document.body.innerHTML = 'app1';
`;
const functionWrappedCode = `(function(window){${code}})`;
const evalFunc = (eval)(functionWrappedCode);
evalFunc.call(proxyWindow1, proxyWindow1);
console.log('外部全局变量 window.b', window.b);

// 沙盒失活
newSandBox1.inactive();
// 清除dom
document.body.innerHTML = ''






// const newSandBox2 = new MultipleProxySandbox();
// newSandBox2.active();
// const proxyWindow2 = newSandBox2.proxy;
// console.log('共享对象是否相等', window.document === proxyWindow1.document, window.document === proxyWindow2.document);

// proxyWindow1.a = '1'; // 设置代理1的值
// proxyWindow2.a = '2'; // 设置代理2的值
// window.a = '3';  // 设置window的值
// console.log('打印输出的值', proxyWindow1.a, proxyWindow2.a, window.a);


// newSandBox1.inactive(); newSandBox2.inactive(); // 两个沙箱都失活

// proxyWindow1.a = '4'; // 设置代理1的值
// proxyWindow2.a = '4'; // 设置代理2的值
// window.a = '4';  // 设置window的值
// console.log('失活后打印输出的值', proxyWindow1.a, proxyWindow2.a, window.a);

// newSandBox1.active(); newSandBox2.active(); // 再次激活

// proxyWindow1.a = '4'; // 设置代理1的值
// proxyWindow2.a = '4'; // 设置代理2的值
// window.a = '4';  // 设置window的值
// console.log('失活后打印输出的值', proxyWindow1.a, proxyWindow2.a, window.a);
