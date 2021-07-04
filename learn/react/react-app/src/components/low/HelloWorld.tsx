import React, { Component } from "react";

interface State {
    name: string;
}

interface Props {}

class HelloWorld extends Component<Props, State> {
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
        return (
            <div>hello, beautiful world !! my name is {this.state.name}</div>
        );
    }
}

export default HelloWorld;
