import React from "react";
// import React, { useState } from "react";
import ReactDOM from "react-dom";

// let init = false;

// function Counter() {
//     console.log(1111);
//     var [count, setCount] = testUseState(0);

//     if (!init) {
//         var [test, setTest] = testUseState(1);
//         init = true;
//     }

//     var [count1, setCount1] = testUseState(2);

//     console.log(stateArray);

//     const onClick = () => {
//         setCount(count + 1);
//     };

//     const onClick1 = () => {
//         setCount1(count1 + 1);
//     };

//     return (
//         <div>
//             <div>{count}</div>
//             <button onClick={onClick}>点击</button>
//             <div>{count1}</div>
//             <button onClick={onClick1}>点击</button>
//         </div>
//     );
// }

function Counter() {
    var [count, setCount] = useState(0);

    var [count1, setCount1] = useState(0);

    const onClick = () => {
        setCount(count + 1);
    };

    const onClick1 = () => {
        setCount1(count1 + 1);
    };

    return (
        <div>
            <div>{count}</div>
            <button onClick={onClick}>点击</button>
            <div>{count1}</div>
            <button onClick={onClick1}>点击</button>
        </div>
    );
}

// 前面 useState 的简单实现里，初始的状态是保存在一个全局变量中的。
// 以此类推，多个状态，应该是保存在一个专门的全局容器中。这个容器，就是一个朴实无华的 Array 对象。具体过程如下：

// -   第一次渲染时候，根据 useState 顺序，逐个声明 state 并且将其放入全局 Array 中。
// -   每次声明 state，都要将 cursor 增加 1。
// -   更新 state，触发再次渲染的时候，cursor 被重置为 0。
// -   按照 useState 的声明顺序，依次拿出最新的 state 的值，视图更新。

let stateArray: any[] = [];
let cursor = 0;

function useState<T>(initialState: T): [T, (newState: T) => void] {
    const currentCursor = cursor;
    stateArray[currentCursor] = stateArray[currentCursor] || initialState;

    function setState(newState: T) {
        stateArray[currentCursor] = newState;
        render();
    }

    ++cursor;
    return [stateArray[currentCursor], setState];
}

export function render() {
    ReactDOM.render(
        <React.StrictMode>
            <Counter />
        </React.StrictMode>,
        document.getElementById("root")
    );
    cursor = 0;
}
