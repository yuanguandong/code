import React, { useState } from "react";
import ReactDOM from "react-dom";

export function CounterEffect() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log(count);
    }, [count]);

    useEffect(() => {
        console.log(count + "哈哈哈");
    }, [count]);

    const onClick = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <div>{count}</div>
            <button onClick={onClick}>点击</button>
        </div>
    );
}

let _deps: any[] | undefined = undefined; // _deps 记录 useEffect 上一次的 依赖

function useEffect(callback: () => void, depArray?: any[]) {
    if (!depArray) {
        // 如果 dependencies 不存在
        callback();
        _deps = depArray;
        return;
    }

    const hasChangedDeps = _deps
        ? depArray.some((el, i) => el !== _deps![i]) // 两次的 dependencies 是否完全相等
        : true;

    /* 如果dependencies 有变化*/
    if (hasChangedDeps) {
        callback();
        _deps = depArray;
    }
}

export function render() {
    ReactDOM.render(
        <React.StrictMode>
            <CounterEffect />
        </React.StrictMode>,
        document.getElementById("root")
    );
}
