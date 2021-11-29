strs = ["adog", "aracecar", "acar"];

const prefix = function (strs) {
  if (strs.length === 0) {
    return "";
  }
  if (strs.length === 1) {
    return strs[0];
  }
  let pre = "";
  let minLength = Infinity;

  strs.forEach((str, index) => {
    if (str.length < minLength) {
      minLength = str.length;
    }
  });
  console.log("minLength", minLength);
  for (let i = 0; i < minLength; i++) {
    let hasIndex = -1;
    for (let j = 0; j < strs.length - 1; j++) {
      if (strs[j][i] === strs[j + 1][i]) {
        hasIndex = i;
      } else {
        hasIndex = -i;
        break;
      }
    }
    if (hasIndex >= 0) {
      pre += strs[0][hasIndex];
    } else {
      break;
    }
  }

  return pre;
};

const res = prefix(strs);
console.log("res", res);
