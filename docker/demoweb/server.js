const Koa = require('koa');
const app = new Koa();

// response
app.use(ctx => {
    ctx.body = 'Hello Koa 111';
});

app.listen(3000);
console.log('Server running at http://127.0.0.1:3000')