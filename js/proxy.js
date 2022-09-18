var obj = {
  name: "john"
};
var proxyObj = new Proxy(obj, {
  "has1": function (oTarget, sKey) {
    console.log('skey')
    return sKey in oTarget || oTarget.hasItem(sKey);
  },
  // get: function (originObj, key, proxy) {
  //   console.log('get originObj', originObj)
  //   console.log('get key', key)
  //   console.log('get proxy', proxy)
  //   return originObj[key] + 1
  // },
  // set: function (originObj, key, value, proxy) {
  //   console.log('set originObj', originObj)
  //   console.log('set key', key)
  //   console.log('set value', value)
  //   console.log('set proxy', proxy)
  //   originObj[key] = value
  // }
});

var a = proxyObj.b
console.log('a', a)
proxyObj.b = 1