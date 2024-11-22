import ReactDOM from "./react-dom";
import React from "./react.js";

// 类组件示例
class MyClassCmp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="class_2">这是{this.props.name}</div>;
  }
}

//函数组件示例
function MyFuncCmp(props) {
  return <div className="class_1">这是{props.name}</div>;
}

const hello = () => {
  alert("Hello Mini React");
};

let jsx = (
  <div>
    <h1>Mini React</h1>
    <div className="className1" onClick={hello}>
      <div>This is my Mini React</div>
      <MyFuncCmp name="函数组件" />
      <MyClassCmp name="类组件" />
    </div>
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));
