import React from 'react'

const Text = () => <div>hello,world</div> 

class WarpComponent extends React.Component{
  constructor(props){
      super(props)
      this.newChidren = this.props.children.filter(item => React.isValidElement(item) )
  }
  render(){
      return this.newChidren
  }
}

export default function Index(){
    return <div>
        <WarpComponent>
            <Text/>
            <div> my name is alien </div>
            Let's learn react together!
        </WarpComponent>
    </div>
}
