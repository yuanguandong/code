import React, { useState } from "react";
import ReactDom from "react-dom";

const Hook = {
  memoizedState: [],
  baseState: [],

  baseUpdate: {},
  queue: {},

  next: {},

  cursor: 0,
};

// function useState(initialState) {
//   const currentCursor = Hook.cursor;
//   Hook.memoizedState[currentCursor] =
//     Hook.memoizedState[currentCursor] || initialState;
//   function setState(newState) {
//     Hook.memoizedState[currentCursor] = newState;
//     ReactDom.render(<App />, document.getElementById("root"));
//     Hook.cursor = 0;
//   }
//   ++Hook.cursor;
//   return [Hook.memoizedState[currentCursor], setState];
// }

let allDeps = [];
let effectCursor = 0;

function useEffect(fn, depArray) {
  if (!depArray) {
    fn();
    allDeps[effectCursor] = depArray;
    effectCursor++;
    return;
  }
  const deps = allDeps[effectCursor];
  const flag = deps
    ? depArray.some((item, index) => item !== deps[index])
    : true;
  if (flag) {
    effectCursor++;
    allDeps[effectCursor] = [deps];
    fn();
  }
}

const App = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const add1 = () => {
    setCount1(count1 + 1);
  };
  const add2 = () => {
    setCount2(count2 + 1);
  };

  useEffect(() => {
    console.log("effect");
  }, [count1]);

  return (
    <div>
      <div>{count1}</div>
      <button onClick={add1}>+1</button>
      <div>{count2}</div>
      <button onClick={add2}>+1</button>
    </div>
  );
};

export default App;
