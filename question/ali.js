//进制转换
function convent(n,radio) {
  let stack = []
  let C = n // 位集
  while(C>radio){
    let M = C % radio
    stack.push(M)
    C = Math.floor(C / radio)
  }
  stack.push(C)
  return stack.reverse().join()
}
console.log(convent(2019,7))

let str = "My name is ${ name }, I'm ${ age } years old.";
let data = { name: "F", age: 20 };


//数组切片对象
function slice(arr) {
  let result = new Proxy({},{
    get:function(target,key,receiver){
      // debugger
      // const [start,end] = key.split(':')
      return arr.slice(...key.split(':'))
    }
  })
  return result
}
const arr = slice([1, '2', 3, '4', 5, '6', 7, '8', 9, '0']);

console.log(arr['2:5']); // [3, '4', 5]


