class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(name, fn) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(fn);
    return this;
  }
  emit(name, ...args) {
    if (!this.events[name]) {
      console.log("没有注册这个事件");
      return this;
    }
    this.events[name].forEach((fn) => fn.apply(this, args));
    return this;
  }
  once(name, fn) {
    //包一层多做一步off
    const func = (...args) => {
      this.off(name, func);
      fn.apply(this, args);
    };
    this.on(name, func);
    return this;
  }
  off(name, fn) {
    if (!this.events[name]) {
      return this;
    }
    //如果不指定fn,那么全部移除掉
    if (!fn) {
      delete this.events[name];
      return this;
    }
    //如果指定了fn,那么移除对应的fn
    const index = this.evnets[name].indexOf(fn);
    this.evnets[name].splice(index, 1);
    return this;
  }
}


const eventEmitter = new EventEmitter();

eventEmitter.on("test", (args) => {
  console.log(this);
});

eventEmitter.emit("test", { a: 1 });
