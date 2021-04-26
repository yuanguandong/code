const sum = (arg)=>{
   if(arg.length <=1){
     return arg[0]
   }else{
     const a = arg.shift()
     return a + sum(arg)
   }
}

const b= sum([1,2,3])


const length = (arr,total)=>{
  if(!total){total=0}
  const node = arr.shift()
  if(node){
    return length(arr,total+1)
  }else{
    return total
  } 
}

const c = length([1,2,3,4,5])


debugger