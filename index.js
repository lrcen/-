var http = require('http')
    ,server = http.createServer()
    ,fs = require('fs')
    ,template = require('art-template')
    ,path = require('path')
    ,formidable = require('formidable');

var url = method = data = ''
server.on('request', function(req ,res) {
    url = req.url;
    method = req.method;
    render(req);

    if(url === '/' && method === 'GET') {
        req.render('heroList', 'hero');
    }else if(url === '/heroAdd' && method === 'GET') { //当点击首页的添加英雄按钮
        req.render('heroAdd');
    }else if(url === '/heroAdd' && method === 'POST') {
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '/public/images');
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {
            if(err) {
                res.end('Failed to load' + url);
            }
            var oldPath = path.join(files.icon.path);
            var newPath = path.join(form.uploadDir, files.icon.name);
            fs.rename(oldPath, newPath, function(err) {
                if(err) {
                    res.end(JSON.stringify({
                        err_code: 500,
                        err_message: err.message
                    }));
                }
                // console.log('数据保存成功');

                // 将新增的数据添加到json数据中
                fs.readFile(path.join(__dirname, 'hero.json'), 'utf8',function(err, data){
                    if(err) {
                        res.end(JSON.stringify({
                            err_code: 500,
                            err_message: err.message
                        }));
                    }
                    
                    var heroObj = JSON.parse(data);
                    heroObj.heros.push({
                        id: heroObj.heros.length + 1,
                        name: fields.name,
                        gender: fields.gender,
                        icon: '/public/images/' + files.icon.name
                    });

                    //stringify() : 可以接收三个参数, 第一个数要字符串化的对象, 第二个可以指定序列化(详见MDN文档), 为null时就是序列化所有对象的属性, 第三个参数指定缩进的空格, 用于美化输出
                    fs.writeFile(path.join(__dirname, 'hero.json'), JSON.stringify(heroObj, null, '  '), function(err) {
                        if(err) {
                            res.end(JSON.stringify({
                                err_code: 500,
                                err_message: err.message
                            }));
                        }
                        res.end(JSON.stringify({
                            success: true,
                            message: '操作成功'
                        }))
                    })
                })

            })
        })
    }else if(url.indexOf('/node_modules') === 0 || url.indexOf('/public') === 0) {
        fs.readFile(path.join(__dirname, url), function(err, data) {
            if(err) {
                res.end('Failed to load' + url + 'Not Found');
            }
            res.end(data);
        })
    }

    //因为渲染操作会很频繁, 单独封装
    // function render(fileName, jsonFileName) {
    //     var file = '/views/'+ fileName +'.html';
    //     var json = jsonFileName + '.json';
    //     fs.readFile(path.join(__dirname, file), 'utf-8', function(err, data) {  //拿到html本文模板
    //         if(err) {
    //             res.end('404 Not Found' + url);
    //         }
    //         // res.end(data);

    //         fs.readFile(path.join(__dirname, json),'utf-8', function(err, jsondata) {
    //             if(err) {
    //                 res.end('404 Not Found' + url);
    //             }
    //             // res.end(jsondata);
                
    //             var html = template.render(data, JSON.parse(jsondata));
    //             // console.log(html);
    //             res.end(html);
    //         })
    //     })
    // }
    function render(req) {
        req.render = function (fileName, jsonFileName) {
            var file = '/views/'+ fileName +'.html';
            var json = jsonFileName + '.json';
            fs.readFile(path.join(__dirname, file), 'utf-8', function(err, data) {  //拿到html本文模板
                if(err) {
                    res.end('404 Not Found' + url);
                }
                // res.end(data);
                if(jsonFileName) { //如果需要json, 就加载json进行渲染再返回渲染好的html
                    fs.readFile(path.join(__dirname, json),'utf-8', function(err, jsondata) {
                        if(err) {
                            res.end('404 Not Found' + url);
                        }
                        // res.end(jsondata);
                        
                        var html = template.render(data, JSON.parse(jsondata));
                        // console.log(html);
                        res.end(html);
                    })
                }else {// 否则直接返回读取到的html
                    res.end(data);
                }
            })
        }
    }
});


server.listen(3000, function(err) {
    if(!err) {
        console.log('服务器启动成功!');
    }
})