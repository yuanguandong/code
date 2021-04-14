import React, { useState } from "react";
import "./App.css";
import demos from './demo'


function App() {
  const [key, setKey] = useState(Object.keys(demos)[0]);
  const [visible, setVisible] = useState(true);
  return (
    <div className="main">
      <div className="leftSide">
        <div
          className="menuItem"
          key={"demo"}
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          ★ DEMO
        </div>
        {Object.keys(demos).map((key) => (
          <div
            className="menuItem"
            key={key}
            onClick={() => {
              setKey(key);
            }}
          >
            {key}
          </div>
        ))}
      </div>
      <div className="rightSide">
        <div className="header">
          <div onClick={() => setVisible(false)}>卸载</div>
          <div onClick={() => setVisible(true)}>挂载</div>
        </div>
        <div className="mainContent">
          <div className="title">{key}</div>
          <div className="content">
            <div>{visible && React.createElement(demos[key])}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
