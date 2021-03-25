import React, { useEffect, useState, memo, useMemo } from "react";
import ReactDOM from "react-dom";

// 迷你版redux实现
// 全局数据集合构造函数
function createStore(reducer) {
  var state;
  var listeners = [];
  var getState = () => state;
  var dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((l) => l());
  };
  var subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  dispatch();
  return {
    getState,
    dispatch,
    subscribe,
  };
}
//数据处理器，纯函数
var reducer = (state = {}, action) => {
  if (!action) return state;
  const { count = 0 } = state;
  console.log(action);
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: count + 1 };
    case "DECREMENT":
      return { ...state, count: count - 1 };
    default:
      return { ...state, count };
  }
};

//迷你版redux-react实现
const ConnectAdvanced = ({ WrappedComponent, actualChildProps }) => {
  const renderedWrappedComponent = useMemo(
    () => <WrappedComponent {...actualChildProps} />,
    [WrappedComponent, actualChildProps]
  );
  return <>{renderedWrappedComponent}</>;
};

const ConnectFunction = (props) => {
  const { store, mapStateToProps, dispatch, state, component } = props;
  let [actualProps, setActualProps] = useState(state);
  store.subscribe(function () {
    const storeData = store.getState();
    let state = mapStateToProps(storeData);
    setActualProps(state);
  });
  return (
    <ConnectAdvanced
      WrappedComponent={component}
      actualChildProps={{ ...actualProps, dispatch }}
    />
  );
};

const connect = (mapStateToProps) => {
  var store = createStore(reducer);
  const storeData = store.getState();
  let state = mapStateToProps(storeData);
  let dispatch = store.dispatch;
  return (component) => {
    return () => {
      return (
        <ConnectFunction
          component={component}
          store={store}
          mapStateToProps={mapStateToProps}
          dispatch={dispatch}
          state={state}
        />
      );
    };
  };
};

const Page = function (props) {
  const { count = 0, dispatch } = props;
  console.log("count", count);
  return (
    <>
      <div id="counter">count:{count}</div>
      <button
        id="addBtn"
        onClick={() => {
          dispatch({ type: "INCREMENT" });
        }}
      >
        addBtn
      </button>
      <button
        id="minusBtn"
        onClick={() => {
          dispatch({ type: "DECREMENT" });
        }}
      >
        minusBtn
      </button>
    </>
  );
};

const connectedPage = connect((props) => ({ count: props.count }))(Page);
export default connectedPage;
