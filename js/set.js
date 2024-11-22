let mySet = new Set()

mySet.add(1)
mySet.add(5)
mySet.add(5)
let o = {a:1,b:2}
mySet.add(o)
mySet.add({a:1,b:2})

const has = mySet.has({a:1,b:2})
debugger