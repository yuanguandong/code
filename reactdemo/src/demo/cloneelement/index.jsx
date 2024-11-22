import React from 'react';

function FatherComponent({ children }){
  const newChildren = React.cloneElement(children, { age: 18}, 'children')
  return <div> { newChildren } </div>
}

function SonComponent(props){
  console.log(props)
  const {name,age,children} = props
  return <div>{name} {age} {children}</div>
}

export default class Index extends React.Component{    
  render(){      
      return <div className="box" >
          <FatherComponent>
              <SonComponent name="alien"  />
          </FatherComponent>
      </div>   
  }
}