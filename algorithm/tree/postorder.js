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
  let outputStack = []
  let stack = [root];
  while (stack.length > 0) {
    const n = stack.pop();
    outputStack.push(n)
    n.right && stack.push(n.left);
    n.right && stack.push(n.right);
  }
  while(outputStack.length){
    const n = outputStack.pop()
    console.log(n.val)
  }
};

postorder(bt);
