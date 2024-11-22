let a = [1, 2, 3, 4, 5, 6, 7, 7]
let b = [3, 4, 5, 6, 'a']

//补集
function findComplementarySet(a, b) {
  let sa = new Set(a);
  let sb = new Set(b);
  let res = [...a.filter(x => !sb.has(x)), ...b.filter(x => !sa.has(x))];
  if (res.length === a.length + b.length) {
    return [];
  } else {
    return res.sort();
  }
}
// console.log('补集', findComplementarySet(a, b))

//交集
function findIntersectionSet(a, b) {
  let sa = new Set(a);
  let sb = new Set(b);
  let arr = [...a.filter(x => sb.has(x)), ...b.filter(x => sa.has(x))];
  let res = []
  new Set(arr).forEach(o => res.push(o))
  if (res.length === a.length + b.length) {
    return [];
  } else {
    return res.sort();
  }
}
// console.log('交集', findIntersectionSet(a, b))



//改变函数传参顺序
function generateIndex(fn, indexs) {
  return function () {
    let argus = Array.from(arguments)
    let newArguments = []
    argus.forEach((item, i) => {
      newArguments[indexs[i]] = item
    })
    console.log('newArguments', newArguments)
    return fn(...newArguments)
  }
}

function consoleArgus(...params) {
  console.log('arguments', params)
}

// generateIndex(consoleArgus, [2, 0, 1])('a', 'b', 'c')



class WeiboClient {
  constructor(options) {

  }
  //关注
  follow(userId) {

  }

  unFollow(userId) {

  }
  postNewWeibo(content) {

  }

}


class WeiboServer {
  constructor() {

  }

  getWeiboList(userId) {

  }
}


function fib(n) {
  if (n == 1 || n == 2) {
    return 1
  };
  var n1 = 1, n2 = 1, sum;

  for (let i = 2; i < n; i++) {
    sum = n1 + n2
    n1 = n2
    n2 = sum
  }
  return sum
}

// console.log(fib(2))




var reverse = function (x) {
  let str = String(x)
  let arr = str.split('')
  let tempStr = arr.reverse().join('').replace('-', '')
  console.log('tempStr', tempStr)
  if (str.indexOf('-') == 0) {
    return 0 - Number(tempStr)
  }
  return tempStr
};
// console.log(reverse(-123))


var isPalindrome = function (x) {
  let arr = String(x).split('')
  return arr.join('') == arr.reverse().join('')
};


var romanToInt = function (s) {
  var map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  }
  var arr = s.split('')
  let res = 0
  for (let i = 0; i < arr.length; i++) {
    if (i < arr.length - 1) {
      if (map[arr[i]] >= map[arr[i + 1]]) {
        res += map[arr[i]]
      } else {
        res -= map[arr[i]]
      }
    } else {
      res += map[arr[i]]
    }

  }
  return res
};

// console.log(romanToInt('III'))



var longestCommonPrefix = function (strs) {
  if (strs.length == 0) { return '' }
  if (strs.length == 1) { return strs[0] }
  let minLength = Infinity;
  strs.forEach((str, index) => {
    if (str.length < minLength) {
      minLength = str.length
    }
  })
  console.log('minLength', minLength)
  let res = ''
  for (let i = 0; i < minLength; i++) {
    let hasIndex = -1
    for (let j = 0; j < strs.length - 1; j++) {

      if (strs[j][i] == strs[j + 1][i]) {
        // debugger
        hasIndex = i
      } else {
        hasIndex = -1
        break
      }
    }
    console.log('hasIndex', hasIndex)
    if (hasIndex >= 0) {
      res += strs[0][hasIndex]
    } else {
      break
    }
  }
  return res
};


// console.log(longestCommonPrefix(["cir","car"]))


var isValid = function (s) {
  var map = new Map()
  map.set("(", ")")
  map.set("[", "]")
  map.set("{", "}")
  let stack = []
  // debugger
  var arr = s.split('')
  // let res = true
  for (let i = 0; i < s.length; i++) {
    console.log('stack1', stack)
    if (map.has(s[i])) {
      stack.push(s[i])
    } else {
      if (stack.length == 0) {
        return false
      }
      if (map.get(stack[stack.length - 1]) === s[i]) {
        stack.pop()
      } else {
        return false
      }
    }
    console.log('stack2', stack)
  }
  if (stack.length) return false
  return true
};

// console.log(`isValid('[]')`, isValid('[{]'))

// let mergeTwoLists = (l1, l2) => {
//   if(!l1) return l2
//   if(!l2) return l1
//   if(l1.val<l2.val){
//       l1.next = mergeTwoLists(l1.next, l2)
//       return l1
//   }else{
//       l2.next = mergeTwoLists(l2.next, l1)
//       return l2
//   }
// };
// var mergeTwoLists = function(l1, l2) {
//   if(!l1) return l2
//   if(!l2) return l1
//   var l1Arr = l1.split('->')
//   var l2Arr = l2.split('->')
//   var newArr = [...l1Arr,...l2Arr]
//   // for(let i = 0; i<newArr.length; i++){
//   //     if(newArr[i+1]>newArr[i+1]){

//   //     }
//   // }
//   newArr.sort()
//   console.log('newArr',newArr)
//   return newArr.join('->')
// };
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) {
    return l2;
  }
  if (l2 === null) {
    return l1;
  }
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};

// 作者：guanpengchn
// 链接：https://leetcode-cn.com/problems/merge-two-sorted-lists/solution/hua-jie-suan-fa-21-he-bing-liang-ge-you-xu-lian-bi/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
console.log('mergeTwoLists', mergeTwoLists(
  {
    val: 1,
    next: {
      val: 2,
      next: {
        val: 3
      }
    }
  },
  {
    val: 1,
    next: {
      val: 3,
      next: {
        val: 4
      }
    }
  }))

