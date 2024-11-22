/**
 * @param {number} n
 * @return {number}
 */
 var fib = function(n) {
  
  if(n ===0 ){return 0}
  if( n===1){return 1}
  let n2 = 0  //n-2
  let n1 = 1   //n-1
  let sum = n1 + n2
  for(let i=2; i<=n;i++){
      sum = (n1 + n2)%1000000007
      n2 = n1
      n1 = sum
  }
  return sum%1000000007

};

