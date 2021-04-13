const graph = require('./graph')

// const visited = new Set()


const bfs = (n)=>{
  const q = [n]
  const visited = new Set()
  while(q.length){
    const node = q.shift()
    
    console.log(node)
    visited.add(c)
    graph[node].forEach(c=>{
      if(!visited.has(c)){
        q.push(c)
        
      }
    })
  }

}

bfs(2)