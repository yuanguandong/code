import React, { useState } from "react";
export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <h1 onClick={() => setCount(() => count + 1)}>
        <p title={count}>{count}</p> and save to reload.
      </h1>
    </div>
  );
}
