// 装饰器 函数运行时间
export function measure(target: any, name: any, descriptor: any) {
  // console.log('arguments1', arguments);
  const oldValue = descriptor.value;
  descriptor.value = async function () {
    const start = Date.now();
    // console.log('arguments2', arguments);
    const res = await oldValue.apply(this, arguments);
    console.log(`${name}执行耗时 ${Date.now() - start}ms`);
    return res;
  };
  return descriptor;
}

// const P1 = new Promise((resolve, reject) => {
//   resolve(1);
// });
// const P2 = Promise.resolve(1);
// const P3 = Promise.resolve(P1);
// console.log('P2', P2);
// console.log('P3', P3);

//缓存修饰器
const cacheMap = new Map();
export function enableCache(target: any, name: string, desciptor: any) {
  const val = desciptor.value;
  desciptor.value = async function (...args: any) {
    const cacheKey = name + JSON.stringify(args);
    if (!cacheMap.get(cacheKey)) {
      const cacheValue = Promise.resolve(val.apply(this, args)).catch((_) => {
        cacheMap.set(cacheKey, null);
      });
      cacheMap.set(cacheKey, cacheValue);
    }
    return cacheMap.get(cacheKey);
  };
}

enum RoutePath {
  Index = '/',
  About = '/about',
  User = '/user',
}

type Dictionary<T> = { [key: string]: T };

export type BaseRouteType = Dictionary<string>;

export interface IndexParams extends BaseRouteType {
  name: string;
}

export interface AboutParams extends BaseRouteType {
  testName: string;
}

export interface UserParams extends BaseRouteType {
  userId: string;
}

interface ParamMap {
  [RoutePath.Index]: IndexParams;
  [RoutePath.About]: AboutParams;
  [RoutePath.User]: UserParams;
}

export class RouterHelper {
  public static replace<T extends RoutePath>(
    routePath: T,
    params: ParamMap[T],
  ) {}

  public static push() {}
}

RouterHelper.replace(RoutePath.About, { testName: '1' });
RouterHelper.replace(RoutePath.Index, { name: '11', testName: '1' });

const a = {
  effect: {
    b: function () {},
    c: function () {},
  },
  reducer: {
    save: function* () {},
  },
};

type actions = typeof a.effect & typeof a.reducer;

// interface Props extends actions {}
interface Props {
  [K in actions]: a.effect[K];
}

const A = function (props: Props) {
  const { save, b, c } = props;
};

interface AA {
  a: string;
  b: string;
  c?: string;
}
// 使属性变为可选
type PartialByKeys<T, K extends keyof T> = {
  [P in K]?: T[P];
} & Pick<T, Exclude<keyof T, K>>;

type A = PartialByKeys<AA, 'a'>;

const some: A = {
  // a:'1',
  b: '1',
};

// 使属性变为必填
type RequireByKeys<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & Omit<T, K>;

type RequiredByKeys<T, Keys extends keyof T = keyof T> = Omit<T, Keys> & {
  [P in Keys]-?: T[P];
};

type RequireC = RequireByKeys<AA, 'c'>;
const someB: RequireC = {
  a: '1',
  b: '1',
  // c:'1'
};

type Simplify<T> = {
  [P in keyof T]: T[P];
};

type User = {
  id: number;
  name: string;
  age: number;
};

const B: Simplify<User> = {};

interface Vector1D {
  x: number;
}

interface Vector2D {
  x: number;
  y: number;
}

type SubtypeOf<T,U> = T extends U ? true : false

enum YY {
  A = 'a',
  B = 'b'
}

type K = keyof typeof YY