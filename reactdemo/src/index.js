import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Lights from "./Lights";
import Redux from "./Redux";
import Reduxdemo from "./reduxdemo";
// import Hooks from './hooks';
import State from "./hooks/usestate";
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Lights/> */}
    {/* <Redux/> */}
    {/* <Reduxdemo/> */}
    {/* <Hooks/> */}
    <State />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
