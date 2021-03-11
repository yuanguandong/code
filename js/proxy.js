var obj = {
  name: "john"
};
var proxyObj = new Proxy(obj, {
  get: function (originObj, key, proxy) {
      console.log('get originObj', originObj)
      console.log('get key', key)
      console.log('get proxy', proxy)
      return originObj[key]
  },
  set: function (originObj, key, value, proxy) {
      console.log('set originObj', originObj)
      console.log('set key', key)
      console.log('set value', value)
      console.log('set proxy', proxy)
      originObj[key] = value
  }
});

var a = proxyObj.name
proxyObj.name = 1