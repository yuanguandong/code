
  let arr = [5, 6, 2, 3, 4, 1]

  // 排序
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let min = arr[i];
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < min) {
        [arr[j], min] = [min, arr[j]];
      }
    }
    arr[i] = min;
  }

  //反转
  let result = []
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length-1 - i]
  }

  



  console.log(result)

  