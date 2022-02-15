
$("#vhall-saas-watchbox").css({
  width: "100vw",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
});

const player = $(".prism-player")
player.style.width = "100vw"
player.style.height = "100vh"
player.style.position = "fixed"
player.style.top = 0
player.style.left = 0
player.style.zIndex = 999999
player.style.transform = 'translateZ(10000px)'



// // 不支持直接设置超时, 可以用promise
// function fetchTimeout(url, init, timeout = 3000) {
//   return new Promise((resolve, reject) => {
//     fetch(url, init).then(resolve).catch(reject);
//     setTimeout(reject, timeout);
//   });
// }

const fetchA = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ a: 1 });
    }, 100);
  });
};

function fetchTimeout(url, init, timeout = 3000) {
  const res = fetchA(url, init);
  
  setTimeout(() => {
    return;
  }, timeout);
  return res;
}

fetchTimeout(
  "https://getman.cn/mock/route/to/demo",
  {
    method: "GET",
    "Access-Control-Allow-Origin": "*",
    "no-cors": false,
  },
  90
).then((res, rej) => {
  console.log(res, rej);
});

constructor
getInitialState  
getDefaultProps  //私有

componentWillMount  //废弃
getDevideStateFromProps //新增
componentDidMount
render

componentWillReceiveProps //废弃
getDevideStateFromProps //新增
shouldComponentUpdate

componentWillUpdate   //废弃
render
getSnapshotBeforeUpdate //新增
componentDidUpdate

componentWillUnmount


