# 常见代码题

## 一、如何实现setTimeout?

通过一些现有的api, 尝试实现setTimeout?

即实现如下两个函数

```js
/**
 * 清除定时器
 * @param {Number} timerId 定时器Id 
 */
const mClearTimeout = (timerId) => {
    
}

/**
 * 设置定时器
 * @param {Function} fn 回调函数
 * @param {Number} timeout 延迟时间
 * @param  {...any} args 回调函数的参数
 */
const mSetTimeout = (fn, timeout, ...args) => {

}
```

## 二、用setTimeout实现setInterval ✅

期望利用原生的setTimeout来模拟实现setInterval, 即实现如下函数

```js
/**
 * 使用setTimeout模拟实现setInterval
 * @param {Function} fn 回调函数
 * @param {*} delay 延迟时间
 * @param  {...any} args 回调函数的参数
 */
function mockSetInterval(fn, delay, ...args) {

}
```


## 三、sleep的多种实现

实现sleep, 能够实现阻塞主流程一段时间, 尝试多种方式实现

```js
/**
 * @param {Number} delay 
 */
function sleep(delay) {
    
}
```
## 四、实现红绿灯 ✅

要求使用一个div实现红绿灯效果, 把一个圆形 div 按照绿色 3 秒，黄色 1 秒，红色 2 秒循环改变背景色。

Tips: 同学们可以回去尝试使用 setTimeout嵌套/promise链式调用 分别实现一下
