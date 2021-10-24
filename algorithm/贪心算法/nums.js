//给定一个整数数组nums, 找到连续最大和子串和

const maxSubArray = function (nums) {
  //传入值判断
  if (nums.length <= 1) return nums;

  let ans = nums[0];
  let sum = 0;

  for (const num of nums) {
    if (sum > 0) {
      sum += num;
    } else {
      sum = num;
    }
    ans = Math.max(ans, sum);
  }

  return ans;
};

const arr = [1, 2, 3, -4, 5, 6, 7, -8, 9, 10];
const a = maxSubArray(arr);
console.log("a", a);
