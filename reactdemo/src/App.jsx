import React, { useState } from "react";
import Lights from "./Lights";
import Reduxdemo from "./reduxdemo";
import Hooks from "./hooks";
import State from "./hooks/usestate";
import PureComponent from "./purecomponent";
import LifeCycle from "./lifecycle";
import Memo from "./memo";

const demos = {
  Lights,
  Reduxdemo,
  Hooks,
  State,
  PureComponent,
  LifeCycle,
  Memo,
};

// eslint-disable-next-line import/no-anonymous-default-export
function App() {
  const [key,setKey] = useState(Object.keys(demos)[0]);
  // setState({b:2})
  console.log("key", key);
  return (
    <div className="main">
      <div className="leftSide">
        {Object.keys(demos).map((key) => (
          <div className="menuItem" key={key} onClick={()=>{
            setKey(key)
          }}>{key}</div>
        ))}
      </div>
      <div className="rightSide">

        <div>{React.createElement(demos[key])}</div>
      </div>
    </div>
  );
}

export default App;
