const def = new Map()

const defaultOptions = {
  path:''
}

rj = {}

rj.config = (options)=>Object.assign(defaultOptions,options)

defind = (name,deps,factory)=>{
  def.set(name,{name,deps,factory})
}

require = (deps,factory)=>{
  return new Promise((resolve,reject)=>{
    Promise.all(deps.map(dep=>{

    })).then(resolve,reject)
  }).then(instances => factory(...instances))
}