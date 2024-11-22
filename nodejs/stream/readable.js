'use strict'
const Readable = require('stream').Readable

class ToReadable extends Readable {
  constructor(iterator) {
    super()
    this.iterator = iterator
  }

  // 子类需要实现该方法
  // 这是生产数据的逻辑
  _read() {
    const res = this.iterator.next()
    if (res.done) {
      // 数据源已枯竭，调用`push(null)`通知流
      return this.push(null)
    }
    setTimeout(() => {
      // 通过`push`方法将数据添加到流中
      this.push(res.value + '\n')
    }, 0)
  }
}

module.exports = ToReadable