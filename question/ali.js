

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


