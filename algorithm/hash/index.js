const MAP = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

const romanToInt = function (s) {
  let len = s.length;
  let res = 0;
  let pre = 0;

  while (len--) {
    let num = MAP[s[len]];
    if (num < pre) {
      res -= num;
      continue;
    }
    pre = num;
    res += num;
  }
  return res;
};
