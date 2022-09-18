class SnapshotSandBox {
  constructor(name) {
    this.modifyMap = {}; // 存放修改的属性
    this.windowSnapshot = {};
  }
  active() {
    // 缓存active状态的沙箱
    this.windowSnapshot = {};
    for (const item in window) {
      this.windowSnapshot[item] = window[item];
    }

    Object.keys(this.modifyMap).forEach(p => {
      window[p] = this.modifyMap[p];
    })

  }
  inactive() {
    for (const item in window) {
      if (this.windowSnapshot[item] !== window[item]) {
        // 记录变更
        this.modifyMap[item] = window[item];
        // 还原window
        window[item] = this.windowSnapshot[item];
      }
    }
  }
}
window.a = '1'
const diffSandbox = new SnapshotSandBox();
diffSandbox.active();  // 激活沙箱
debugger
window.a = '0'
console.log('开启沙箱：', window.a);
diffSandbox.inactive(); //失活沙箱
debugger
console.log('失活沙箱：', window.a);
diffSandbox.active();   // 重新激活
debugger
console.log('再次激活', window.a);

