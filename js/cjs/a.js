// a.js
const { count, add, get } = require('./b');
console.log('a')

console.log(count);    // 1
add();
console.log(count);    // 1
console.log(get());    // 2
console.log(get());    // 2