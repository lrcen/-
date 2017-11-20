// 路由模块: 根据不同的请求分发到不同的入口
var addRender = require('./render.js')
    ,controller = require('./controller.js');
    
module.exports = function(req, res) {
    var url = req.url;
    var method = req.method;
    addRender(res);  // 给res添加了一个渲染函数, 说明此时res对象上已经有一个render方法

    if(url === '/' && method === 'GET') {
        controller.showMainPage(res);
    }else if(url === '/heroAdd' && method === 'GET') { //当点击首页的添加英雄按钮
        controller.showHeroAddPage(res);
    }else if(url === '/heroAdd' && method === 'POST') {
        controller.doHeroAdd(req, res);
    }else if(url.indexOf('/node_modules') === 0 || url.indexOf('/public') === 0) {
        controller.showStaticSrc(req, res);
    }
}