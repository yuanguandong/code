import React from 'react'
import ReactDOM from 'react-dom'

function Text(){
  return <div>hello,world</div>
}

export default class Index extends React.Component{
  node = null
  constructor(props){
     super(props)
     this.state={
         numer:1,
     }
  }
  componentDidMount(){
      /*  组件初始化的时候，创建一个 container 容器 */
      ReactDOM.render(<Text/> , this.node )
  }
  handerClick=()=>{
     /* 点击卸载容器 */ 
     const state =  ReactDOM.unmountComponentAtNode(this.node)
     console.log(state)
  }
  render(){
      return <div > 
           <div ref={ ( node ) => this.node = node  }  ></div>  
          <button onClick={ this.handerClick } >click me</button>
      </div>
  }
}