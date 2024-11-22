const {parse} = require("@babel/parser");
import generate from "@babel/generator";
const code = "class glass {get name() { return '水杯' }}";
const ast = parse(code);

const output = generate(ast, { minified: true }, code);
console.log(output);
