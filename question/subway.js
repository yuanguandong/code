const fileA = [
  {
    name: "张三",
    code: "642154545787874212",
  },
  {
    name: "李四",
    code: "642154545787874213",
  },
  {
    name: "王五",
    code: "642154545787874214",
  },
];

const fileB = [];

const maxTicketLength = 50;

const resultMap = {
  hasBuy: {
    message: "您已购票",
  },
  hasNotBuy: {
    message: "您没有购票",
  },
  illegal: {
    message: "身份证格式不对",
  },
  hasCheck: {
    message: "您已经检过票",
  },
  beyondLimit: {
    message: "当前车次票以售完",
  },
  buySuccess: {
    message: "购票成功",
  },
  checkSuccess: {
    message: "检票成功",
  },
  refundSuccess: {
    message: "退票成功",
  },
};

const resolve = (str) => {
  const [name, code] = str.split(" ");
  return { name, code };
};

//检验身份证合法性
const checkCode = (code) => {
  return /^(d{18,18}|d{15,15}|d{17,17}X)$/.test(code);
};
//获取当前票已购信息
const getBuy = (code) => {
  return fileA.find((o) => o.code === code);
};

//获取当前票已检信息
const getCheckin = (code) => {
  return fileB.find((o) => o.code === code);
};

//检测票是否已售完
const checkBeyond = () => {
  return fileB.length >= maxTicketLength;
};

//检票
const checkin = (code) => {
  //非法的省份证号码
  if (!checkCode(code)) {
    return {
      success: false,
      message: resultMap.illegal.message,
    };
  }
  let res = {
    success: true,
    message: resultMap.checkSuccess.message,
  };

  if (getCheckin(code)) {
    //已检票
    res = {
      success: false,
      message: resultMap.hasCheck.message,
    };
  } else if (!getBuy(code)) {
    // 没有购票
    res = {
      success: false,
      message: resultMap.hasNotBuy.message,
    };
  } else {
    fileB.push(getBuy(code));
  }
  return res;
};

//购票
const buy = ({ name, code }) => {
  //非法的省份证号码

  if (!checkCode(code)) {
    return {
      success: false,
      message: resultMap.illegal.message,
    };
  }
  //已售完
  if (checkBeyond()) {
    return {
      success: false,
      message: resultMap.beyondLimit.message,
    };
  } else if (getBuy(code)) {
    return {
      success: false,
      message: resultMap.hasBuy.message,
    };
  } else {
    fileA.push({
      name,
      code,
    });
    return {
      success: true,
      message: resultMap.buySuccess.message,
    };
  }
};

//退票
const refund = (code) => {
  //没买票
  if (!getBuy(code)) {
    return {
      success: false,
      message: resultMap.hasNotBuy.message,
    };
  }
  //已检票
  if (getCheckin(code)) {
    return {
      success: false,
      message: resultMap.hasCheck.message,
    };
  } else {
    fileA.map((item, index) => {
      if (item.code === code) {
        fileA.splice(index, 1);
      }
    });
    return {
      success: true,
      message: resultMap.refundSuccess.message,
    };
  }
};

const buyResult = buy(resolve("小明 64012119910503001X"));
debugger
// const buyResult1 = buy(resolve('小明 64012119910503001X'))
// debugger
// const checkResult = checkin('64012119910503001X')
// debugger
// const checkResult1 = checkin('64012119910503001X')
// debugger
// const refundResult = refund('64012119910503001X')
// debugger

module.exports = {
  resolve,
  checkCode,
  checkin,
  buy,
  getBuy,
  getCheckin,
  checkBeyond,
  refund,
};

var options = process.argv;
let fn = options[2];
let name = options[3];
let code = options[4];

console.log(options);

if (fn) {
  const res = module.exports[fn](name, code);

  console.log(res);
}


// for(var i=0;i<canshu.length;i++)
// {
//     if(options[i].indexOf("-string")==0)
//   {
//         。。。。。
//   }
//     else if(options[i].indexOf("--start")==0)
//   {
//     ........
//   }
// }
