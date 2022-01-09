const fs = require('fs');
const path = require('path');
const parse = require('@babel/parser').parse;
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const template = require('@babel/template').default;
const t = require('@babel/types');

const pluginName = 'AutoTryCatch'

class AutoTryCatch {
  constructor(options) {
    this.options = options || { dir: ['src'], pattern: ['.js'] };
    this.pattern = this.options.pattern;
  }
  
  apply(compiler) {
    compiler.hooks.done.tap(pluginName, () => {
      this.options.dir.forEach(item => {
        const path1 = path.resolve(item)
        fs.readdir(path1, (err, files) => {
          if (!err) {
            files.forEach(filename => {
              const absPath = path.resolve(item, filename)
              const extname = path.extname(filename)
              if (this.pattern.includes(extname)) {
                const ast = this.getAst(absPath);
                this.handleTraverse(ast, absPath);
              }
            })
          }
        })
      })
    })
  }
  
  getAst(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    try {
      return parse(content, {
        sourceType: 'module'
      })
    } catch (e) {
      console.error(e)
      return null;
    }
  }
  
  handleTraverse(ast, filePath) {
    let isChanged = false
    const shouldHandleAst = path => {
      const types = path.node.body.body.map(({ type }) => type);
      isChanged = path.node.body.body.length > 1 && types.includes('TryStatement') || path.node.body.body.length && !types.includes('TryStatement')
    }
    
    traverse(ast, {
      FunctionDeclaration: shouldHandleAst,
      FunctionExpression: shouldHandleAst,
      ArrowFunctionExpression: shouldHandleAst
    })
    
    if (isChanged) {
      this.handleAst(ast, filePath)
    }
  }
  
  handleAst(ast, filePath) {
    const _this = this;
    traverse(ast, {
      BlockStatement(path) {
        if (
        ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(path.parentPath.type) && path.node.body[0].type !== 'TryStatement' && path.parentPath.node.async
        ) {
          const tryStatement = _this.generateTryStatement(path.node);
          const blockStatement = t.blockStatement([tryStatement])
          
          path.replaceWith(blockStatement)
        }
      },
      Program: {
        exit() {
          _this.writeFileSync(ast, filePath)
        }
      }
    })
    
  }
  
  generateTryStatement({ body = [] }) {
    const nodeBody = t.blockStatement(body);
    
    return template.ast(`try
      ${generator(nodeBody).code}
      catch (err) {
        console.log(err);
      }
    `)
  }
  
  writeFileSync(ast, filePath) {
    const output = generator(ast, {
      retainLines: false,
      quotes: 'single',
      concise: false,
      compact: false
    })
    
    fs.writeFileSync(filePath, output.code)
  }
}

module.exports = AutoTryCatch;