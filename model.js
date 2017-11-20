var path = require('path')
    ,fs = require('fs');

var model = module.exports;

model.addHero = function(heroData, callback) {
    // 1. 要添加数据, 首先要先获取所有的数据, 调用一个函数(此时还不知道要什么参数)
    getAllHeroData(function(err, data) {
        // 5.1 如果报错, 调用了callback(err, null), 也就是有err值
        if(err) {
            // 5.2 再返回错误信息, 所以又需要一个回调函数, 给该函数添加一个形参callback
            callback(err);
        }

        // 5.4 如果没有报错, 加添加进数据库, 所以再加一个保存方法, 将所有数据 以及 要保存的数据 传入
        saveHeroData(data, heroData, function(err){
            if(err) { // 5.10 如果报错, 返回错误信息
                callback(err);
            }
            //5.12 成功
            callback(null);
        });
    })
}

// 因为获取全部数据这个方法不需要暴露出去, 不需要添加给model对象
// 为了发挥node的优势(高性能), 所以这里不使用同步
// 同步方式: 
// function getAllHeroData() {
//     try {
//         var data = fs.readdirSync(path.join(__dirname, 'hero.json'));
//     } catch (error) {
//         if(error) {
//             throw error;
//         }
//     }
//     return data;
// }

// 2. 定义了一个getAllHeroData函数(此时没有决定参数)
function getAllHeroData(callback) {
    fs.readFile(path.join(__dirname, 'hero.json'), 'utf-8', function(err, data) { 
    // 3. 因为是异步, 就不能使用return了, 因为, 异步函数会在同步之后执行, 当getAllHeroData函数时, 发现异步, 先向后执行, 
    // 到头了之后函数结束, 永远也不会执行到里的异步函数, 也就永远拿不到数据
        if(err) {// 4. 如果报错了, 应该把错误信息返回, 但又用不了return, 所以使用回调函数, 给getAllHeroData一个形参 , 此时给函数定义了一个形参(回调函数), 所以给调用时也加入一个回调函数
            callback(err, null); //5. 报错时就没有data, 所以data返回null
        }

        callback(null, data); // 6. 否则就返回data
    })
}

// 同样的, 不需要暴露出去
function saveHeroData(data, heroData, callback) { //接收所有数据 和 要保存的数据
    // 5.5 转换成对象
    var allHeroData = JSON.parse(data);
    heroData.id = allHeroData.heros.length + 1; // 5.6 赋值id, 总长度+1
    //5.7 存入
    allHeroData.heros.push(heroData);

    // 5.8 重新写入
    fs.writeFile(path.join(__dirname, 'hero.json'), JSON.stringify(allHeroData), function(err) {
        if(err) { //5.9 如果报错, 返回错误信息
            callback(err);
        }

        //5.11 没有报错, 则成功
        callback(null);
    })

}