var http = require('http')
    ,server = http.createServer()
    ,router = require('./router.js');

var url = method = data = ''
server.on('request', function(req ,res) {
    router(req, res);
});

server.listen(3000, function(err) {
    if(!err) {
        console.log('服务器启动成功!');
    }
})