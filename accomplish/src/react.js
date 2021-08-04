
/**
 * 创建虚拟dom函数
 *
 * @param {*} type // 节点类型 
 * @param {*} props // 属性参数
 * @param {*} children // 子组件
 * @return {*} 
 */
function createElement(type, props, ...children) {
  console.log('type',type)
  props.children = children;
  let vtype;
  if (typeof type === "string") { // 判断类型为string则是原生html类型
    vtype = 1;
  }
  if (typeof type === "function") { // 判断是否是函数组件或类组件
    vtype = type.isReactComponent ? 2 : 3; // 判断是函数组件还是类组件
  }
  return { // 返回虚拟dom节点
    vtype, // 虚拟dom类型
    type,  // 节点类型
    props, // 属性参数
  };
}

//类组件定义
class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState = () => {};
}

export default {
  createElement,
  Component,
};
