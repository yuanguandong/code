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

const bfs = (root)=>{
  const q = [root]
  while(q.length){
    const n = q.shift()
    console.log(n.val)
    n.children.forEach((item)=>{
      q.push(item)
    })
  }
}
bfs(tree)