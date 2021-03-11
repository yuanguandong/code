// worker.js
// 接收主线程发来的消息
self.addEventListener('message', function (e) {
  debugger
  console.log('You said: ' + e.data);
}, false);


// worker线程计算结果
var i=0; 
function timedCount(){ 
    for(var j=0,sum=0;j<100;j++){
        for(var i=0;i<100000000;i++){ 
            sum+=i; 
        } 
    } 
    // 调用 postMessage 向主线程发送计算结果消息
    this.postMessage(sum); 
} 
postMessage("Before computing,"+new Date().toLocaleString()); 
timedCount(); 
postMessage("After computing,"+new Date().toLocaleString());

// self.close();
