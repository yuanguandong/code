interface Dog {
  wong(): number;
}

const dog: Dog = {
  wong: () => {
    return 1;
  },
};

//装饰器
export function measure(target: any, name: any, descriptor: any) {
  const oldValue = descriptor.value;
  descriptor.value = async function () {
    const start = Date.now();
    const res = await oldValue.apply(this);
    console.log(`${name}执行耗时 ${Date.now() - start}ms`);
    return res;
  };
  return descriptor;
}

class Obj {
  @measure
  create() {
    console.log("create");
  }
}

const obj = new Obj();

obj.create();

const cacheMap = new Map();

export function EnableCache(target: any, name: string, desciptor) {
  const val = desciptor.value;

  desciptor.value = async function (...args: any) {
    const cacheKey = name + JSON.stringify(args);
    if (!cacheMap.get(cacheKey)) {
      const cacheValue = Promise.resolve(val.apply(this, args)).cache((_) => {
        cacheMap.set(cacheKey, null);
      });
      cacheMap.set(cacheKey, null);
      cacheMap.set(cacheKey, cacheValue);
    }
    return cacheMap.get(cacheKey);
  };
}
