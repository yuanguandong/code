const bt = require("./bt");
//前序遍历
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
  while(stack.length>0){
    let n = stack.pop()
    console.log(n.val)
    if(n.right){stack.push(n.right)}
    if(n.left){stack.push(n.left)}
    
  }
};

preorder(bt);
