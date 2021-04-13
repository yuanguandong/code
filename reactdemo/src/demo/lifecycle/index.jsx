import React from "react";

class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  render() {
    return (
      <>
        <button
          onClick={() => {
            this.setState((state) => {
              const { count } = state;
              return { ...state, count: count + 1 };
            });
          }}
        >
          增加count
        </button>
        <Child count={this.state.count} />
      </>
    );
  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 10,
    };
  }
  // getDefaultProps() { //私有
  //   console.log("getDefaultProps", arguments);
  // }
  getInitialState() { //私有
    console.log("getInitialState", arguments);
  }





  componentWillMount() {//废弃
    console.log("componentWillMount", arguments);
  }
  componentDidMount() {
    console.log("componentDidMount", arguments);
  }



  componentWillReceiveProps(nextProps) {//废弃
    if (nextProps.count !== this.state.count) {
      this.setState({
        count: nextProps.count,
      });
    }
    console.log("componentWillReceiveProps", arguments);
  }
  static getDerivedStateFromProps(props, state){ //新增
    console.log("getDerivedStateFromProps", arguments);
    return props
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate", arguments);
    return true
    return nextState.count !== this.state.count;
  }
  componentWillUpdate(){//废弃
    console.log("componentWillUpdate", arguments);
  }
  getSnapshotBeforeUpdate(prevProps, prevState){ //新增
    console.log("getSnapshotBeforeUpdate", arguments);
    return true
  }
  componentDidUpdate(perProps, perState, snapShot){
    console.log("componentDidUpdate", snapShot);
  }





  componentWillUnmount(){
    console.log("componentWillUnmount", arguments);
  }




  
  handerClick = () => {
    this.setState((state) => ({
      count: state.count++,
    }));
  };



  render() {
    console.log("render");
    return <div>{this.state.count}</div>;
  }
}

export default Father;
