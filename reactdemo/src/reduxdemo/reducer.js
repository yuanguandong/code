//数据处理器，纯函数
var countReducer = (state = {}, action) => {
  if (!action) return state;
  const { count = 0 } = state;
  console.log(action);
  switch (action) {
    case "INCREMENT":
      return { ...state, count: count + 1 };
    case "DECREMENT":
      return { ...state, count: count - 1 };
    default:
      return { ...state, count };
  }
};
export default {countReducer}