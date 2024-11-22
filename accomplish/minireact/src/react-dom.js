//渲染函数
function render(vnode, container) {
  mount(vnode, container);
}

//主挂载函数
function mount(vnode, container) {
  const { vtype } = vnode;
  let nodeInstance
  if (!vtype) {
    //处理文本节点
    nodeInstance = mountTextNode(vnode, container);
  }
  if (vtype === 1) {
    //处理原生标签
    nodeInstance = mountHtml(vnode, container);
  }

  if (vtype === 3) {
    //处理函数组件
    nodeInstance = mountFunc(vnode, container);
  }

  if (vtype === 2) {
    //处理class组件
    nodeInstance =  mountClass(vnode, container);
  }
  return nodeInstance
}

//处理文本节点
function mountTextNode(vnode, container) {
  const node = document.createTextNode(vnode);
  container.appendChild(node);
  return node;
}

//原生节点挂载函数
function mountHtml(vnode, container) {
  const { type, props} = vnode;
  const {children, ...rest } = props
  const node = document.createElement(type); //创建一个真实dom
  children.map((item) => {
    //子元素递归
    if (Array.isArray(item)) {
      item.map((c) => {
        mount(c, node);
      });
    } else {
      mount(item, node);
    }
  });
  Object.keys(rest).map((item) => {
    if (item === "className") {
      node.setAttribute("class", rest[item]);
    }
    if (item.slice(0, 2) === "on") {
      node.addEventListener("click", rest[item]);
    }
  });
  container.appendChild(node);
  return node
}

//函数组件挂载函数
function mountFunc(vnode, container) {
  const { type, props } = vnode;
  const node = new type(props);
  const nodeInstance = mount(node, container);
  // setComponentProps( node, props );
  return nodeInstance
}

//类组件挂载函数
function mountClass(vnode, container) {
  const { type, props } = vnode;
  const node = new type(props);
  const nodeInstance = mount(node.render(), container);
  return nodeInstance
}

export default {
  render,
};
