const babel = require('@babel/core');
const code = "class glass {get name() { return '水杯' }}";
const options = {
    presets: ['@babel/preset-env'],
}

const parsedAst = babel.parse(code);
console.log(parsedAst);

const  parser  = require('@babel/parser');
const ast = parser.parse(code);
console.log(ast);