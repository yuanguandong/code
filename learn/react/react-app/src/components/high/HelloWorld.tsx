import React, { Component } from "react";
import { wrapWithUsername } from "../../hoc";

interface Props {
    name: string;
}

class HelloWorld extends Component<Props, any> {
    render() {
        return (
            <div>hello, beautiful world !! my name is {this.props.name}</div>
        );
    }
}

export default wrapWithUsername(HelloWorld);
