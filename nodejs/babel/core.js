const babel = require('@babel/core');
const code = "class glass {get name() { return '水杯' }}";
const options = {
    presets: ['@babel/preset-env'],
}
// 直接转换
// const result1 = babel.transform(code, options);

// 异步转换
// babel.transformAsync(code, options).then(res => console.log(res));
// console.log(result);

// 加载文件同步转换
// const content = babel.transformFileSync('./babel-file.js');
// console.log(content);

// 生成AST语法树
// const parsedAst = babel.parse(code, { parserOpts: { allowReturnOutsideFunction: true } });
// console.log(parsedAst);

// 通过语法树转换
// const result3 = babel.transformFromAst(parsedAst, code, options);
// console.log(result3);

// 生成config
const config = babel.loadPartialConfig(options); // 提前生成config
const result = babel.transform(code, config.options);
console.log(result);