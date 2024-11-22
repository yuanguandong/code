import React, { useState, useLayoutEffect } from "react";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  handerClick = () => {
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
    }, 1000);
    Promise.resolve().then(() => {
      // ReactDOM.unstable_batchedUpdates(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      // });
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.handerClick}>num++</button>
      </div>
    );
  }
}

// export default () => {
//   const [num, setNum] = useState(0);
//   const handerClick = () => {

//     setNum(num + 1);
//     console.log(num);
//     setNum(num + 1);
//     console.log(num);
//     setNum(num + 1);
//     console.log(num);

//     setTimeout(() => {
//       setNum(num + 1);
//       console.log(num);
//       setNum(num + 1);
//       console.log(num);
//       setNum(num + 1);
//       console.log(num);
//     }, 1000);

//     Promise.resolve().then(() => {
//       setNum(num + 1);
//       console.log(num);
//       setNum(num + 1);
//       console.log(num);
//       setNum(num + 1);
//       console.log(num);
//     });
//   };

//   useLayoutEffect(() => {
//     const dom = document.getElementById("button");
//     if (!dom) return;
//     dom.addEventListener("click", handerClick);
//   }, []);

//   console.log('render',num)
//   return (
//     <div>
//       <button id="button">{num}</button>
//     </div>
//   );
// };
