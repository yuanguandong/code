import React, { useState } from "react";
import ReactDOM from "react-dom";

function CounterEffect() {
    effectCursor = 0; // 注意将 effectCursor 重置为0

    const [count, setCount] = useState(0);
    const [count1, setCount1] = useState(0);

    useEffect(() => {
        console.log(count);
    }, [count]);

    useEffect(() => {
        console.log(count1 + "哈哈哈");
    }, [count1]);

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

const allDeps: Array<any[] | undefined> = [];
let effectCursor: number = 0;

function useEffect(callback: () => void, depArray?: any[]) {
    if (!depArray) {
        callback();
        allDeps[effectCursor] = depArray;
        effectCursor++;
        return;
    }
    const deps = allDeps[effectCursor];
    const hasChangedDeps = deps
        ? depArray.some((el, i) => el !== deps[i])
        : true;
    if (hasChangedDeps) {
        callback();
        allDeps[effectCursor] = depArray;
    }
    effectCursor++;
}

export function render() {
    ReactDOM.render(
        <React.StrictMode>
            <CounterEffect />
        </React.StrictMode>,
        document.getElementById("root")
    );
}
