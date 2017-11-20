var fs = require('fs')
    ,path = require('path')
    ,formidable = require('formidable')
    ,model = require('./model.js');


var controller = module.exports;

controller.showMainPage = function(res) {
    res.render('heroList', 'hero');
}

controller.showHeroAddPage = function(res) {
    res.render('heroAdd');
}

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

controller.showStaticSrc = function(req, res) {
    fs.readFile(path.join(__dirname, req.url), function(err, data) {
        if(err) {
            res.end('Failed to load' + url + 'Not Found');
        }
        res.end(data);
    })
}