const {transformSync} = requie('@babel/core');
const plugin = require('./index')

const code =`

`

const options = {
  plugin:['index.js']
}

const output = transformSync(code, options)