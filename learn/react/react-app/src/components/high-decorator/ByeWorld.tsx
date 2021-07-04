import React, { Component } from "react";
import { wrapWithUsername } from "../../hoc";

interface Props {
    name?: string;
}

@wrapWithUsername
class UglyWorld extends Component<Props, any> {
    render() {
        return <div>bye, ugly world !! my name is {this.props.name}</div>;
    }
}

export default UglyWorld;
