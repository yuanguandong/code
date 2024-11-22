var CQueue = function () {
  this.stackA = [];
  this.stackB = [];
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function (value) {
  return this.stackA.push(value);
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function () {
  if (!this.stackB.length) {
    if (!this.stackA.length) {
      return -1;
    }
      while (this.stackA.length) {
        this.stackB.push(this.stackA.pop());
      }
    
  }
  return this.stackB.pop();
};

var obj = new CQueue();
debugger;
obj.appendTail(3);
debugger;
var param_2 = obj.deleteHead();
debugger;
