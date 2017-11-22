//  自定义一个渲染模块, 负责将数据渲染到html中 并返回

var fs = require('fs')
    ,template = require('art-template')
    ,path = require('path');

module.exports = function(res) {
    res.render = function (fileName, jsonFileName) {
        var file = '/views/'+ fileName +'.html';
        var json = jsonFileName + '.json';
        fs.readFile(path.join(__dirname, file), 'utf-8', function(err, data) {  //拿到html本文模板
            if(err) {
                return res.end('404 Not Found' + url);
            }
            // res.end(data);
            if(Object.prototype.toString.call(jsonFileName) == '[object Object]') { //如果传的就是一个对象, 那么就直接渲染
                // console.log(jsonFileName);
                var html = template.render(data, jsonFileName);
                return res.end(html);
            }else if(typeof jsonFileName === 'string') { //如果需要json, 就加载json进行渲染再返回渲染好的html
                fs.readFile(path.join(__dirname, json),'utf-8', function(err, jsondata) {
                    if(err) {
                        res.end('404 Not Found' + url);
                    }
                    // res.end(jsondata);
                    
                    var html = template.render(data, JSON.parse(jsondata));
                    // console.log(html);
                    return res.end(html);
                })
            }else {// 否则直接返回读取到的html
                return res.end(data);
            }
        })
    }
}

// 默认会返回一个 modules.exports