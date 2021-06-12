const generator = require("@babel/generator")
const parser = require("@babel/parser")
const traverse = require("@babel/traverse")
const t = require("@babel/types")


function compile(code) {
  const ast = parser.parse(code);

  const visitor = {
    CallExpression(path){
      const {callee} = path.node;
      if(
        t.isMemberExpression(callee)
        && callee.object.name ==='console'
        && callee.property.name ==='log'
      ){
        const functionPath = path.findParent(p=>{
          return p.isFunctionDeclaration()
        })
        path.node.arguments.unshift(
          t.stringLiteral(`[${functionPath.node.id.name}]`)
        )
      }
    }
  };
  traverse.default(ast, visitor)

  return generator.default(ast, {}, code)
}

const code = `function foo(){
  console.log('bar')
}`;

const result = compile(code)
console.log(result.code)

