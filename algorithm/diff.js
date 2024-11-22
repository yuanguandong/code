const get = (obj, path, defaultValue = undefined) => {
  if (path.length === 0) {
    return obj;
  }
  if (!obj) {
    return defaultValue;
  }
  if (typeof path === "string") {
    path = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }
  let p = path.shift();
  return get(obj[p], path);
};

export const getDiffProps = (srcObj, targetObj) => {
  let res = {};
  const getDiff = (srcChild, targetChild, path = '') => {
    if (!srcChild || !targetChild) {
      return null;
    }
    for (let key in srcChild) {
      const srcItem = srcChild[key];
      const targetItem = targetChild[key];
      if (srcItem !== targetItem) {
        let p = path;
        if (!p) {
          p = key;
        } else {
          p = p + '.' + key;
        }
        if (typeof srcItem === 'object') {
          getDiff(srcItem, targetItem, p);
        }else{
          res[p] = targetItem;
        }
      }
    }
  };
  getDiff(srcObj, targetObj);
  return res;
};

const a = {
  avatar: "http://placeimg.com/20/20/animals",
  createBy: "Brant",
  createDate: "2054-06-01",
  de: "Rath",
  en: "Mayer",
  gender: "男",
  id: "6fded013-9df2-41b5-bf07-40c46be55a80",
  name: "Leonie",
  tel: { number: "(933) 649-8763" },
  updateBy: "Collin",
  updateDate: "2016-06-26",
  usage: 21387,
  zh: "Nader",
};
const b = {
  avatar: "http://placeimg.com/20/20/animals",
  createBy: "Brant",
  createDate: "2054-06-01",
  de: "Rath",
  en: "Mayer",
  gender: "女",
  id: "6fded013-9df2-41b5-bf07-40c46be55a80",
  name: "Leonie",
  tel: { number: "(933) 649-8763" },
  updateBy: "Collin",
  updateDate: "2016-06-26",
  usage: 21387,
  zh: "Nader",
};

console.log("getDiffProps", getDiffProps(a, b));
