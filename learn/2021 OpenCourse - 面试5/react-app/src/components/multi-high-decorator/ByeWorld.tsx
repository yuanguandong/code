import React, { Component } from "react";
import { decoratorWithNameHeight, decoratorWithWeight } from "../../hoc";

interface Props {
    name?: string;
}

@decoratorWithWeight(60)
@decoratorWithNameHeight(170)
class UglyWorld extends Component<Props, any> {
    render() {
        return <div>bye, ugly world !! my name is {this.props.name}</div>;
    }
}

export default UglyWorld;

// class UglyWorld extends Component<Props, any> {
//     render() {
//         return <div>bye, ugly world !! my name is {this.props.name}</div>;
//     }
// }

// export default decoratorWithWeight(111)(
//     decoratorWithNameHeight(170)(UglyWorld)
// );
