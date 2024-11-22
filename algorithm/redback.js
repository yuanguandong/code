
// const redBack = (amount, count) => {
//   const res = [];
//   const minNum = 0.01;
//   const rec = (amount, count) => {
//     if (count === 1) {
//       res.push(amount.toFixed(2));
//       return res;
//     }
//     const nextCount = count - 1;
//     const number = getRandom(minNum, amount / 2 - minNum * nextCount);
//     res.push(number);
//     return rec(amount - number, nextCount);
//   };
//   return rec(amount, count);
// };

const getRandom = (min, max) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

const redBack = (amount, count) => {
  let res = [];
  let temp = 0;
  for (let i = 0; i < count; i++) {
    const random = getRandom(0, amount);
    temp += random;
    res.push(random);
  }
  for (let i = 0; i < res.length; i++) {
    res[i] = ((amount * res[i]) / temp).toFixed(2)
  }
  return res
};

console.log(redBack(100, 10));

