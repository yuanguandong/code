const a = {
  b: {
    c: [1, 2, 3],
  },
};

const get = (obj, path, defaultValue = undefined) => {
  if(path.length===0){return obj}
  if(!obj){
    return defaultValue
  }
  if (typeof path === "string") {
    path = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }
  let p = path.shift();
  return get(obj[p],path)
};

const res = get(a, "b.c[3]");

console.log(res);