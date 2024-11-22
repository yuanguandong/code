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


