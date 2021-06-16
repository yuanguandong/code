const a = {
  b:{
    c:[1,2,3]
  }
}

const get = (obj,path)=>{
  path = path.replace(/\[/g,'.').replace(/\]/g,'')
  let pathArr = path.split('.')
  let p = 0
  let target = obj
  while(p<pathArr.length){
    target = target[pathArr[p]]
    p++
  }
  return target
}

const res = get(a,'b.c[2]')

debugger