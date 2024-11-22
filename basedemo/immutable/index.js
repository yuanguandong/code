// const { Map, List } = Immutable
// // const { Map } = require('immutable');
// const map1 = Map({ a: 1, b: 2, c: 3 });
// const map2 = map1.set('b', 50);
// map1.get('b') + " vs. " + map2.get('b'); // 2 vs. 50


// const map3 = Map({ c: 1, b: 2 })
// const map4 = map1.set('b', 699)
// console.log(map4.get('b'))

// const root = document.getElementById('root')

// const print = (List) => {
//   root.innerHTML = List.toJS().toString()
// }

// const actionBtn = document.getElementById('action')
// const redoBtn = document.getElementById('redo')
// const undoBtn = document.getElementById('undo')

// // const Lists = []

// // const list1 = List([])
// // const list2 = list1.push(3, 4, 5)
// // const list3 = list2.splice(0, 9).concat([1, 2])


// // const a = list1.equals(list3)
// // console.log(a)
// // // list2.unshift(0,3)
// // console.log(list1.toJS())
// // console.log(list2.toJS())
// // console.log(list3.toJS())


// // Lists.push(list1, list2, list3)
// // console.log(Lists)

// // console.log(actionBtn)

// class dataManager {
//   constructor() {
//     this.total = 0
//     this.current = 0
//     this.history = []
//   }
//   do(List) {
//     ++this.current
//     ++this.total
//     this.history.push(List)
//     console.log(this.history, this.current)
//     print(List)
//   }
//   redo() {
//     if (this.current < 0) {
//       ++this.current
//       print(this.history[this.current])
//       return this.history[this.current]
//     }

//   }
//   undo() {
//     if (this.current > 0 && this.current < this.total) {
//       --this.current
//       print(this.history[this.current])
//       return this.history[this.current]
//     }
//   }
// }

// const dataManager1 = new dataManager


// actionBtn.addEventListener('click', () => {
//   const newData = List([parseInt(Math.random(0, 10) * 100)])
//   dataManager1.do(newData)
// })

// redoBtn.addEventListener('click', () => {
//   dataManager1.redo()
// })

// undoBtn.addEventListener('click', () => {
//   dataManager1.undo()
// })



//支持数据嵌套
const arr = Immutable.fromJS([1, 2])
const object = Immutable.fromJS({ a: 1 })


//不支持数据嵌套
const list = Immutable.List([1, 2])
const map = Immutable.Map({ a: 1 })


const arrtemp = arr.toJS()

console.log('arrtemp', arrtemp)
