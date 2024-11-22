// function MyInstanceOf(obj, constructor) {
//   let objP = obj.__proto__;
//   while (1) {
//     if (objP === null) {
//       return false;
//     }
//     if (objP === constructor.prototype) {
//       return true;
//     }
//     objP = objP.__proto__;
//   }
// }

// function Foo(){
//   this.name = 'haha'
// }
// let Fo = new Foo()
// console.log(MyInstanceOf(Fo,Array))

let a = 1;

const fun = () => {
  while (true) {
    console.log('a',a)
    // if (a > 5) {
    //   return false;
    // }
    // if(a<7){
    //   return true
    // }
    // a=a+1
    // return false
  }
};
fun()