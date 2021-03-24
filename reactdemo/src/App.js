import React, { useState } from "react";

export default () => {
  const [state, setState] = useState({ a: 1 });
  const onClick = () => {
    let { a } = state;
    for (let i = 0; i < 100; i++) {
      setState({ a: a + i });
    }
  };
  // setState({b:2})
  console.log("state", state);
  return <div onClick={onClick}>123</div>;
};
