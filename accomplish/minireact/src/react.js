/**
 * 创建虚拟dom函数
 *
 * @param {*} type // 节点类型
 * @param {*} props // 属性参数
 * @param {*} children // 子组件
 * @return {*}
 */
function createElement(type, props, ...children) {
  console.log("type", type);
  props.children = children;
  let vtype;
  if (typeof type === "string") {
    // 判断类型为string则是原生html类型
    vtype = 1;
  }
  if (typeof type === "function") {
    // 判断是否是函数组件或类组件
    vtype = type.isReactComponent ? 2 : 3; // 判断是函数组件还是类组件
  }
  return {
    // 返回虚拟dom节点
    vtype, // 虚拟dom类型
    type, // 节点类型
    props, // 属性参数
  };
}

// export function renderComponent( component ) {
//   let instance;
//   const renderer = component.render();
//   if ( component.instance && component.componentWillUpdate ) {
//       component.componentWillUpdate();
//   }
//   instance = _render( renderer );
//   if ( component.instance ) {
//       if ( component.componentDidUpdate ) component.componentDidUpdate();
//   } else if ( component.componentDidMount ) {
//       component.componentDidMount();
//   }
//   if ( component.instance && component.instance.parentNode ) {
//       component.instance.parentNode.replaceChild( instance, component.instance );
//   }
//   component.instance = instance;
//   instance._component = component;
// }

// // set props
// function setComponentProps( component, props ) {
//   if ( !component.instance ) {
//       if ( component.componentWillMount ) component.componentWillMount();
//   } else if ( component.componentWillReceiveProps ) {
//       component.componentWillReceiveProps( props );
//   }
//   component.props = props;
//   renderComponent( component );
// }


//类组件定义
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState(stateChange) {
    // 将修改合并到state
    Object.assign(this.state, stateChange);
    // renderComponent(this);
  }
}

export default {
  createElement,
  Component,
};
