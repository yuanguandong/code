// var buffer = new ArrayBuffer(8)
// var view  = new Int16Array(buffer)

// console.log('bugger',buffer)
// console.log('view',view)
var uint8 = new Uint8Array(2);
uint8[0] = 42;
console.log(uint8[0]); // 42
console.log(uint8.length); // 2
console.log(uint8.BYTES_PER_ELEMENT); // 1