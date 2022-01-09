import React from "react";
import { render } from "react-dom";
import "./style.css";
import "./style.mobile";

const lazy = (fn) =>
  class extends React.Component {
    state = {
      Component: () => null,
    };

    async componentDidMount() {
      const { default: Component } = await fn();
      this.setState({ Component });
    }

    render() {
      const Component = this.state.Component;
      return <Component {...this.props} />;
    }
  };

// const Async = lazy(() => import('./Async'));

// 指定产出的模块名称（注意这里的注释是有用的）：
const Async = lazy(() => import(/* webpackChunkName: "Async" */ "./Async"));

const App = () => <div>ffffffffff</div>;

render(<App />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector("#app"));
  });
}
