const bt = require("./bt");

// const postorder = (root) => {
//   if(!root) return
//   inorder(root.left)
//
//   inorder(root.right)
// console.log(root.val)
// }

const postorder = (root) => {
  if (!root) {
    return;
  }
  let stack =[root]
  let outPutStack = []
  while(stack.length){
    const n = stack.pop()
    outPutStack.push(n)
    if(n.left){stack.push(n.left)}
    if(n.right){stack.push(n.right)}
  }
  while(outPutStack.length){
    const n = outPutStack.pop()
    console.log(n.val)
  }
};

postorder(bt);
