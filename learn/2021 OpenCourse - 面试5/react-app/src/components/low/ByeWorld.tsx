import React, { Component } from "react";

interface State {
    name: string;
}

interface Props {}

class ByeWorld extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
        };
    }

    componentWillMount() {
        let username = localStorage.getItem("myName")!;
        this.setState({
            name: username,
        });
    }

    render() {
        return <div>bye, ugly world !! my name is {this.state.name}</div>;
    }
}

export default ByeWorld;
