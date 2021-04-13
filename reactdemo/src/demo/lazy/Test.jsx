import React from 'react'

export default class Test extends React.Component {
  componentDidMount() {
    console.log("--componentDidMount--");
  }
  render() {
    return (
      <div>
        <img src={'https://images.unsplash.com/photo-1547049082-1a12c3bf2366?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=80'} className="alien" />
      </div>
    );
  }
}
