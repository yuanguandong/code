/* import CountChange from './es6';
const instance = new CountChange();

function test(content) {
  document.querySelector('#app').innerHTML = content;
}

// setInterval(() => {
  instance.increment();
  test(instance.count)
// }, 1000) */
// 开发模式的包在内存中，不输出文件  memory-fs

import React from 'react';
import { render } from 'react-dom';
import './style.css'
// import App from './App'

const lazy = fn => class extends React.Component {
  state = {
    Component: () => null
  }
  async componentDidMount() {
    const { default: Component } = await fn();
    this.setState({ Component });
  }
  render() {
    const Component = this.state.Component;
    return <Component {...this.props} />;
  }
}
// babel 6-, polyfill, Symbol, Promise, Set, Map
/* if (typeof Proxy === 'undefined') {
  window.Proxy = XXX
} */

const Async = lazy(() => import(/* webpackChunkName: "Async" */'./Async'));


// import alert from './requireEnsure'

require('./xxx');


const onClick = () => {
  require.require([], function () {
    const ensure = require('./requireEnsure');
    ensure.default();
  })
}


const App = () => <div onClick={onClick}>App</div>;

render(<App />, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector('#app'));
  });
}

// render(<App /> , $el)


/* getComponent() {
  require.ensure(_, () => {
    const ensure = require('./requireEnsure').default;
    cb(ensure);
  }, err, 'Home')
} */

// happy-pack

// vite