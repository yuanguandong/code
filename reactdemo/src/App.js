import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [state, setState] = useState();
  const handleClick = () => {
    setState({ x: 1 });
    setState({ x: 2 });
    setState({ x: 3 });

    setTimeout(() => {
      setState({ x: 4 });
      setState({ x: 5 });
      setState({ x: 6 });
    }, 0);
  };

  console.log('state',state)

  return <div onClick={handleClick}>123</div>;
}

export default App;
