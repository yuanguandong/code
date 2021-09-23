//最多有几个互不相交的区间
let arr = [
  [1, 2],
  [2, 3],
  [1, 5],
  [5, 6],
  [4, 5],
  [2, 4],
  [3, 6],
];

const greedy = (arr) => {
  if (arr.length ===0) {
    return arr;
  }
  const temp = arr.sort((a, b) => a[1] - b[1]);

  let count = 1
  let xEnd =temp[0][1]

  for (let i = 0; i < temp.length; i++) {
    const start = temp[i][0]
    if(start>=xEnd){
      count++;
      xEnd = temp[i][1]
    }
  }
  return count
};

console.log(greedy(arr))
