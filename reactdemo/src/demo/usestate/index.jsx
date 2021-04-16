import React, { useState } from "react";
import ReactDom from "react-dom";

export type Hook = {
  memoizedState: any, 
  baseState: any,    
  
  baseUpdate: Update<any, any> | null,  
  queue: UpdateQueue<any, any> | null,  
 
  next: Hook | null, 
}


let _state = [];
let index = 0;

const myUseState = function (initialValue) {
  return function () {
    console.log(this, arguments);
    const currentIndex = index;
    _state[currentIndex] =
      _state[currentIndex] === undefined ? initialValue : _state[currentIndex];
    const setState = (newValue) => {
      _state[currentIndex] = newValue;
      index = 0; //重置index
      ReactDom.render(<App />, document.querySelector("#root"));
    };
    index += 1;
    return [_state[currentIndex], setState];
  }
};

const App = () => {
  const [count1, setCount1] = myUseState(0);
  const [count2, setCount2] = myUseState(0);
  const add1 = () => {
    setCount1(count1 + 1);
  };
  const add2 = () => {
    setCount2(count2 + 1);
  };
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
