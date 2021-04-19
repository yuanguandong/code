let task = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("data");
    }, 1000);
  });

function* gen(a) {
  console.log("a", a);
  const data1 = yield task();
  console.log("1", data1);
  const data2 = yield task();
  console.log("2", data2);
  return "success";
}

function asyncToGenerator(generatorFunc) {
  return function () {
    const gen = generatorFunc.apply(this, arguments);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult;
        try {
          generatorResult = gen[key](arg);
        } catch (error) {
          reject(error);
        }
        const { value, down } = generatorResult;
        if (down) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            (val) => step("next", val),
            (err) => step("throw", err)
          );
        }
      }
      step("next");
    });
  };
}

const asyncTask = asyncToGenerator(gen);

asyncTask("a");


