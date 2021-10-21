const babel = require('@babel/core');
const code = "class glass {get name() { return '水杯' }}";
const options = {
    presets: ['@babel/preset-env'],
}

const parsedAst = babel.parse(code);
console.log(parsedAst);

import { parse } from '@babel/parser';
const ast = parse(code);
console.log(ast);