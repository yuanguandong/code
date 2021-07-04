import React from "react";
// import React, { useState } from "react";
import ReactDOM from "react-dom";

function Counter() {
    var [count, setCount] = useState(0);
    // var [name, setName] = useState("");

    const onClick = () => {
        setCount(count + 1);
    };

    // const onClickName = () => {
    //     setName("name" + Math.random());
    // };

    return (
        <div>
            <div>{count}</div>
            <button onClick={onClick}>点击</button>
            {/* <div>{name}</div>
            <button onClick={onClickName}>点击</button> */}
        </div>
    );
}

let state: any;

/**
 * 简易版实现
 * 看起来是可以了，但是如果有多个useState，那么只有第一个生效
 */
function useState<T>(initialState: T): [T, (newState: T) => void] {
    state = state || initialState;

    function setState(newState: T) {
        state = newState;
        render();
    }

    return [state, setState];
}

export function render() {
    ReactDOM.render(
        <React.StrictMode>
            <Counter />
        </React.StrictMode>,
        document.getElementById("root")
    );
}
