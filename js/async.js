let task = (num) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num+1);
    }, 1000);
  });

function* gen(a) {
  console.log("a", a);
  const data1 = yield task(a);
  console.log("1", data1);
  const data2 = yield task(data1);
  console.log("2", data2);
  return "success";
}

// const g = gen('1')
// debugger

// function asyncToGenerator(generatorFunc) {
//   return function () {
//     const gen = generatorFunc.apply(this, arguments);
//     return new Promise((resolve, reject) => {
//       function step(key, arg) {
//         let generatorResult;
//         try {
//           generatorResult = gen[key](arg);
//         } catch (error) {
//           reject(error);
//         }
//         const { value, down } = generatorResult;
//         if (down) {
//           return resolve(value);
//         } else {
//           return Promise.resolve(value).then(
//             (val) => step("next", val),
//             (err) => step("throw", err)
//           );
//         }
//       }
//       step("next");
//     });
//   };
// }

function asyncToGenerator(generatorFunc) {
  return function () {
    const genFn = generatorFunc.apply(this, arguments);
    const next = (data) => {
      const { value, done } = genFn.next(data);
      if (done) return;

      value.then((data) => {
        next(data);
      });
    };
    next(arguments);
  };
}

// function asyncFn(generator){
//   const iterator = generator()
//   const next = (data) => {
//     const {value,done} = iterator.next(data)
//     if(done)return
//     value.then((data)=>{
//       next(data)
//     })
//   }
//   next()
// }

asyncFn(gen)(1);


debugger;
