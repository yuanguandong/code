import React, { Component } from "react";
import { decoratorWithNameHeight, decoratorWithWeight } from "../../hoc";

interface Props {
    name?: string;
}

@decoratorWithWeight(100)
@decoratorWithNameHeight(188)
class HelloWorld extends Component<Props, any> {
    render() {
        return (
            <div>hello, beautiful world !! my name is {this.props.name}</div>
        );
    }
}

export default HelloWorld;

// class HelloWorld extends Component<Props, any> {
//     render() {
//         return (
//             <div>hello, beautiful world !! my name is {this.props.name}</div>
//         );
//     }
// }

// export default decoratorWithNameHeight(188)(HelloWorld);
