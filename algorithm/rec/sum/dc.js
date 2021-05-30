//递归求和
// const sum = (arg)=>{
//    if(arg.length <=1){
//      return arg[0]
//    }else{
//      const a = arg.shift()
//      return a + sum(arg)
//    }
// }

// const b= sum([1,2,3])

//递归求长度
// const length = (arr,total)=>{
//   if(!total){total=0}
//   const node = arr.shift()
//   if(node){
//     return length(arr,total+1)
//   }else{
//     return total
//   } 
// }

// const c = length([1,2,3,4,5])


// debugger
//递归找最大值
const findMax = (arr,max)=>{
  if(!max){max=arr[0]}
  if(arr.length===0){return max}
  const node = arr.shift()
  if(node>max){
    return findMax(arr,node)
  }else{
    return findMax(arr,max)
  }
}

const max = findMax([1,2,66,22,55,888])
debugger