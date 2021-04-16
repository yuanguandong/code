import React from "react";
import ReactDOM from "react-dom";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  handerClick = () => {
    // for (let i = 0; i < 5; i++) {
    //  setTimeout(()=>{
    //      this.setState({ number:this.state.number+1 })
    //      console.log(this.state.number)
    //  },1000)
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
    // }
  };

  render() {
    return (
      <div>
        <button onClick={this.handerClick}>num++</button>
      </div>
    );
  }
}
