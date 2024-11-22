let index = 0
let cache = {
  method:function(){
    debugger
    console.log('this is cache',index)
  }
}

function cacheInfo(info) {
  index += 1
  const prevCache = cache

  const method = function(){
    if(prevCache){
      prevCache.method()
    }
  }

  cache = {
    info:info,
    method(){
      method()
      console.log('this',index)
    }
  }

}


for(var i = 0; i<100000; i++){
  const info = new Array(1000000);
  cacheInfo(info)
  debugger
}