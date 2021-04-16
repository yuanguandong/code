import React from 'react'
import ReactDOM from 'react-dom'

export default class Index extends React.Component{
  handerFindDom=()=>{
      console.log(ReactDOM.findDOMNode(this))
  }
  render(){
      return <div>
          <div>hello,world</div>
          <button onClick={ this.handerFindDom } >获取容器dom</button>
      </div>
  }
}
