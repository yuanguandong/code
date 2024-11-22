const start = new Date()
setImmediate(()=>{
	console.log('time elapsed',new Date() - start, 'ms')
},500)