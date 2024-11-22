const tree = {
  val:'a',
  children:[{
    val:'b',
    children:[{
      val:'d',
      children:[]
    }]
  },{
    val:'c',
    children:[{
      val:'e',
      children:[]
    }]
  }],
}

const dfs = (root)=>{
  console.log(root.val)
  root.children.forEach(dfs)
}
dfs(tree)