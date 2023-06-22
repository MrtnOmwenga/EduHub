const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(require('./Database.js')());
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(router);
server.listen(port, function() {
    console.log('Json server is running')
});