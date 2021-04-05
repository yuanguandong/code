const bt = require("./bt");

// const preorder = (root) => {
//   if (!root) {
//     return;
//   }
//   console.log(root.val);
//   preorder(root.left);
//   preorder(root.right);
// };

const preorder = (root) => {
  if (!root) {
    return;
  }
  let stack = [root];
  while (stack.length > 0) {
    const n = stack.pop();
    console.log(n.val);
    n.right && stack.push(n.right);
    n.right && stack.push(n.left);
  }
};

preorder(bt);
