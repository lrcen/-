var fs = require('fs')
    ,path = require('path')
    ,formidable = require('formidable')
    ,model = require('./model.js');


var controller = module.exports;
//显示主页
controller.showMainPage = function(res) {
    res.render('heroList', 'hero');
}
//显示增加英雄页面
controller.showHeroAddPage = function(res) {
    res.render('heroAdd');
}
//增加英雄操作
controller.doHeroAdd = function(req, res) {
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
            fs.readFile(path.join(__dirname, 'hero.json'), 'utf8', function(err, data){
                if(err) {
                    res.end(JSON.stringify({
                        err_code: 500,
                        err_message: err.message
                    }));
                }

                var heroObj = {};  //新建一个对象, 保存提交的信息
                heroObj.name = fields.name;
                heroObj.gender = fields.gender;
                heroObj.icon = '/public/images/' + files.icon.name;

                // 调用model模块中的添加英雄方法
                model.addHero(heroObj, function(err) { // 写入保存, 只会出错或成功
                    if(err) {  // 5.3, 如果报错
                        res.end(JSON.stringify({
                            err_code: 500,
                            err_message: err.message
                        }));
                    }
                    res.end(JSON.stringify({
                        success: true,
                        message: '保存成功'
                    }))
                });
            })

        })
    })
}

// 显示英雄信息
controller.showHeroInfo = function(id, res) {
    // 根据id查询英雄
    model.showHeroInfo(id, function(err, hero) {
        if(err) {
            res.end(JSON.stringify({
                err_code: 500,
                err_message: err.message
            }));

        }
        res.render('heroInfo', hero);
    });

    
}

//显示编辑页面
controller.showHeroEdit = function(id, res) {
    model.showHeroEdit(id, function(err, hero) {
        if(err) {
            res.end(JSON.stringify({
                err_code: 500,
                err_message: err.message
            }))
        }
        res.render('heroEdit', hero);
    })
}

//编辑功能
controller.doHeroEdit = function(req, res) {
    var form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, 'public/images'); //更改保存路径
    form.keepExtensions = true; //保留文件扩展名

    form.parse(req, function(err, fields, files) { //解析
        if(err) {
            res.end(JSON.stringify({
                err_code: 500,
                err_message: err.message
            }));
        }
        console.log(fields);
        console.log(files);

        var oldPath = path.join(files.icon.path);
        var newPath = path.join(form.uploadDir, files.icon.name);

        fs.rename(oldPath, newPath, function(err) { //重命名
            if(err) {
                res.end(JSON.stringify({
                    err_code: 500,
                    err_message: err.message
                })); 
            }

            var hero = {}; //定义一个新对象，保存修改后的信息
            hero.id = fields.id;
            hero.name = fields.name;
            hero.gender = fields.gender;
            hero.icon = '/public/images/' + files.icon.name;
            console.log(hero);

            model.doHeroEdit(hero, function(err) {
                if(err) {
                    res.end(JSON.stringify({
                        err_code: 500,
                        err_message: err.message
                    }));
                }

                //如果成功， 重新渲染首页
                // res.render('heroList', 'hero');
                res.end(JSON.stringify({
                    success: true,
                    message: '保存成功'
                }))
            })
        })
    })
}

//删除功能
controller.doHeroDelete = function(id, res) {
    model.doHeroDelete(id, function(err) {
        if(err) {
            res.end(JSON.stringify({
                err_code: 500,
                err_message: err.message
            }))
        }
        res.render('heroList', 'hero');
    })
}

//显示静态资源
controller.showStaticSrc = function(req, res) {
    // 因为静态资源中可能有中文, 所以进行解码
    fs.readFile(path.join(__dirname, decodeURI(req.url)), function(err, data) {
        if(err) {
            res.end('Failed to load' + url + 'Not Found');
        }
        res.end(data);
    })
}