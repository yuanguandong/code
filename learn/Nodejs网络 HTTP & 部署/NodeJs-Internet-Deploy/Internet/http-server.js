const http = require('http')
const host = '0.0.0.0';
const port = 80;
http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })
    res.end('Hello World111')
}).listen(port, host)

console.log(`Server running at http://${host}:${port}/`)