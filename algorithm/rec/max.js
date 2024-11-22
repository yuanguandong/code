let arr = [1, 2, 3, 4, 5];

const rec = (index, max) => {
  if(!index){index=0}
  if(!max){max=arr[0]}
  if (index >= arr.length) {
    return max;
  } else {
    return rec(index + 1, arr[index] > max ? arr[index] : max);
  }
};


const a = rec(0,arr[0]);
debugger

