import React, { memo } from "react";

function TextMemo(props) {
  console.log("子组件渲染");
  if (props) return <div>hello,world</div>;
}

const controlIsRender = (preProps, nextProps) => {
  const { number, num } = preProps;
  const { number: number1, num: num1 } = nextProps;
  return num1 > 5;
};

const NewTexMemo = memo(TextMemo, controlIsRender);

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1,
      num: 1,
    };
  }
  render() {
    const { num, number } = this.state;
    return (
      <div>
        <div>
          改变num：当前值 {num}
          <button onClick={() => this.setState({ num: num + 1 })}>num++</button>
          <button onClick={() => this.setState({ num: num - 1 })}>num--</button>
        </div>
        <div>
          改变number： 当前值 {number}
          <button onClick={() => this.setState({ number: number + 1 })}>
            {" "}
            number ++
          </button>
          <button onClick={() => this.setState({ number: number - 1 })}>
            {" "}
            number --{" "}
          </button>
        </div>
        <NewTexMemo num={num} number={number} />
      </div>
    );
  }
}

export default Index;
