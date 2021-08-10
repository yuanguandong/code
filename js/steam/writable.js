const Writable = require('stream').Writable

const writeable = Writable()

writeable._write = function(data,enc,next){
  process.stdout.write(data.toString().toUpperCase())
  process.nextTick(next)
} 

writeable.on('finish',()=>process.stdout.write('DONE'))

writeable.write('a'+'\n')
writeable.write('b'+'\n')
writeable.write('c'+'\n')

writeable.end()
