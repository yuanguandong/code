//枚举
export enum ActivityStatus {
  NOT_START = "notStart",
  STARTED = "started",
}

const value = "notStart";

if (value === ActivityStatus.NOT_START) {
  //
}

interface UserInfoA {
  name?: string;
  height?: number;
}

interface UserInfoB {
  width: number;
  name: string;
}

const userInfo: UserInfoA = {};

//联合类型
function test(params: UserInfoA | UserInfoB) {
  params.name = "name";
}

//typeof

typeof "a"; //string

function toArray(x: number): number[] {
  return [x];
}

type Func = typeof toArray; //()

//keyof

interface Person {
  name: string;
  age: number;
}

type KPerson = keyof Person; // 'name' | 'age'

const namestr: KPerson = "name";
const agestr: KPerson = "age";

//in 用来遍历枚举类型
type Keys = "a" | "b" | "c";

type Obj<T> = {
  [key in Keys]: T;
};

//extends
// 继承类型
interface ILength {
  length: number;
}

function loggingIdentity<T extends ILength>(arg: T) {
  return arg;
}

loggingIdentity("11");

// Partial
// 将某个类型的属性全部变为可选项
// Partial<T>
interface PageInfo {
  title: string;
}

type OptionalPageInfo = Partial<PageInfo>;

// {
//   title?: string;
// }

//Required
//把所有类型变为必选项

//Readonly

type ReadonlyPageInfo = Readonly<PageInfo>;

const pageInfo: ReadonlyPageInfo = { title: "" };

// pageInfo.title = 1

//Record
// 以第一个参数做key, 以第二个参数作为key值
// Record<K extends keyof any, T>
type Page = "home" | "about" | "contact";

//移除操作
type ExcludeContact = Exclude<Page, "contact">;

type PageRecord = Record<ExcludeContact, PageInfo>;

const pageRecord: PageRecord = {
  home: { title: "1" },
  about: { title: "1" },
  contact: { title: "1" },
};

// Exclude 将某一个类型中属于另一个类型移除掉

type TO = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract
// Extract<T,U> 的作用是从T中提取U,取交集

type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

type T2 = Extract<string | number | (() => void), Function>; //function
















