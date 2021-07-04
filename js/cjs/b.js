// b.js
let count = 1;

console.log('b')
module.exports = {
  count,
  add() {
    count++;
  },
  get() {
    return count;
  }
};
console.log('count',count)