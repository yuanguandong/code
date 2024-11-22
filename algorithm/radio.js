function convert(num,radio){
  let currcy = num
  let stack = []
  while(currcy>=radio){
    let num = currcy % radio
    currcy = Math.floor(currcy / radio)
    stack.unshift(num)
  }
  if(currcy){stack.unshift(currcy)}
  return stack.join('')
}

console.log(
  convert(8,2)
)