// 路由模块: 根据不同的请求分发到不同的入口
var addRender = require('./render.js')
    ,controller = require('./controller.js')
    ,Url = require('url');
    
module.exports = function(req, res) {
    // 有中文时 进行解码
    var url = req.url;
    var method = req.method;
    req.id = Url.parse(url, true).query.id;
    addRender(res);  // 给res添加了一个渲染函数, 说明此时res对象上已经有一个render方法

    if(url === '/' && method === 'GET') {
        controller.showMainPage(res);
    }else if(url === '/heroAdd' && method === 'GET') { //当点击首页的添加英雄按钮
        controller.showHeroAddPage(res);
    }else if(url === '/heroAdd' && method === 'POST') {
        controller.doHeroAdd(req, res);
    }else if(url.indexOf('/heroInfo') === 0 && method === 'GET') {
        // var id = Url.parse(url, true).query.id; // 会多次用到, 赋给req或者res
        controller.showHeroInfo(req.id, res);
    }else if(url.indexOf('/heroEdit') === 0 && method === 'GET') {
        controller.showHeroEdit(req.id, res);
    }else if(url === '/heroEdit' && method === 'POST') {
        controller.doHeroEdit(req, res);
    }else if(url.indexOf('/heroDelete') === 0 && method === 'GET') {
        controller.doHeroDelete(req.id, res);
    }else if(url.indexOf('/node_modules') === 0 || url.indexOf('/public') === 0) {
        controller.showStaticSrc(req, res);
    }
}