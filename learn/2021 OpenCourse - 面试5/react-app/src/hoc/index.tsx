import React, { Component } from "react";

interface State {
    name: string;
}

export const wrapWithUsername = (WrappedComponent: any) => {
    return class extends Component<any, any> {
        public state: State = {
            name: "",
        };

        componentWillMount() {
            let username = localStorage.getItem("myName")!;
            this.setState({
                name: username,
            });
        }

        render() {
            return <WrappedComponent name={this.state.name} {...this.props} />;
        }
    };
};

export const decoratorWithNameHeight = (height?: number) => {
    return (WrappedComponent: any) => {
        return class extends Component<any, State> {
            public state: State = {
                name: "",
            };

            componentWillMount() {
                let username = localStorage.getItem("myName")!;
                this.setState({
                    name: username,
                });
            }

            render() {
                return (
                    <div>
                        <WrappedComponent
                            name={this.state.name}
                            {...this.props}
                        />
                        <p>身高为: {height || 0}</p>
                    </div>
                );
            }
        };
    };
};

export const decoratorWithWeight = (weight?: number) => {
    return (WrappedComponent: any) => {
        return class extends Component<any, State> {
            render() {
                return (
                    <div>
                        <WrappedComponent {...this.props} />
                        <p>体重为: {weight || 0}kg</p>
                    </div>
                );
            }
        };
    };
};
