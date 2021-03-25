// 迷你版redux实现,全局数据仓库构造函数
function createStore(reducers) {
  var state = {};
  var listeners = [];
  var getState = () => state;
  var dispatch = (actionObj) => {
    let [model, action] = actionObj.type.split("/");
    state = reducers[model](state, action);
    listeners.forEach((l) => l());
  };
  var subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  return {
    getState,
    dispatch,
    subscribe,
  };
}
export default createStore;
