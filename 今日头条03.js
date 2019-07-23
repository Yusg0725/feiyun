var myAPP = {};
myAPP.appName = "今日头条极速版"
myAPP.version = "7.0.4"
myAPP.packageName = "com.ss.android.article.lite"
myAPP.readTotalNum = 300   //阅读任务总数 （共阅读几篇文章）
myAPP.readTaskNum = 0   //阅读任务计数
myAPP.readTimeOut = 60000   ///阅读超时时间

myAPP.searchTotalNum = 6   //搜索任务总数
myAPP.searchTaskNum = 0   //搜索任务计数

myAPP.every = 10
myAPP.suspend = 60000
myAPP.delayMin = 1000   //延时最小值
myAPP.delayMax = 3000   //延时最大值

var date1 = new Date();    //开始时间
var date2 = date1.getTime()

var info = [];


threads.start(function () {
    while (true) {
        if (text("允许").exists()) {
            // 地理位置授权（京东广告，商品详情页）
            text("允许").click()
        };
        if (text("确定").exists()) {
            // 程序没有响应
            text("确定").click()
        };
        if (text("立即领取").exists()) {
            // 支付宝广告页 
            back()
        };

        sleep(random(myAPP.delayMin, myAPP.delayMax));
    };
});

console.show()
toastLog("设备分辨率：" + device.width + "*" + device.height)

app_readArticle()
// app_getData()
// app_search()

date1 = new Date();    //结束时间
var date3 = date1.getTime()
log("本次共执行 " + (date3 - date2 - 2) + " ms")


// 搜索
function app_search() {

    while (true) {
        myAPP.activity = currentActivity()
        // log("页面地址：" + myAPP.activity)

        if (myAPP.searchTaskNum >= myAPP.searchTotalNum) {
            log("搜索任务已完成")
            break;   //跳出循环
        };


        if (text("首页").exists()) {
            log("页面地址：main")
            // 刷新文章列表
            if (text("首页").findOne().parent().click()) {
                sleep(random(myAPP.delayMin, myAPP.delayMax))
            };

            // 寻找搜索框
            var object = className("TextView").depth(13).find();
            for (var i = 0; i < object.length; i++) {
                // log(i)
                var tv = object[i];
                if (tv.text() != "") {
                    tv.parent().parent().parent().click();  //点击搜索框，进入搜索页
                    sleep(random(myAPP.delayMin, myAPP.delayMax))
                    break;
                };
            };
        } else if (text("搜索").exists()) {
            switch (myAPP.activity) {

                case "com.ss.android.article.base.feature.search.SearchActivity":
                    if (text("查看全部推荐词").exists()) {
                        text("查看全部推荐词").findOne().parent().click()
                        sleep(random(myAPP.delayMin, myAPP.delayMax))
                    } else if (text("隐藏推荐词").exists()) {
                        var object = className("TextView").depth(18).find();
                        var index = random(0, object.length - 1)   //取随机索引
                        for (var i = 0; i < object.length; i++) {
                            var tv = object[i];
                            if (tv.text() != "" && index == i) {
                                tv.parent().click()   //随机点一个关键词
                                sleep(random(myAPP.delayMin, myAPP.delayMax))

                                myAPP.searchTaskNum++;
                                log("已搜索完第" + myAPP.searchTaskNum + "个")
                            };
                        };
                    } else {
                        // 搜索结果列表页
                        if (random(1, 100) % 2 == 0) {
                            log("随机滑动")
                            swipeEx(device.width / 2, device.height * 0.8, device.width / 2, random(device.height / 4, device.height / 5), random(500, 1000)); //向上滑动翻页
                        } else {
                            log("固定滑动")
                            scrollForward();   //下滑+右滑
                        };
                        sleep(random(myAPP.delayMin, myAPP.delayMax))
                        //返回后会自动刷新关键词
                        back();
                    };
                    break;
                default:
                    break;
            };
        } else {
            log("页面地址：other")
            back()  //返回
            sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时
            launchPackage(myAPP.packageName)   //启动APP
        };

        sleep(random(myAPP.delayMin, myAPP.delayMax))
    };
};




// 获取数据
function app_getData() {
    while (true) {
        myAPP.activity = currentActivity()
        // log("页面地址：" + myAPP.activity)

        if (text("首页").exists()) {
            log("页面地址：main")
            // 刷新文章列表
            if (text("我的").findOne().parent().click()) {
                sleep(random(myAPP.delayMin, myAPP.delayMax))

                info['money'] = app_getRMB();
                info['gold'] = app_getGold();
                info['gift'] = app_getCode();

                log(info)

                break;   //跳出循环
            }
        } else {
            log("页面地址：other")
            back()  //返回
            sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时
            launchPackage(myAPP.packageName)   //启动APP
            sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时
            // 请求打开APP
            // if (text("允许").exists()) {
            //     if (text("允许").click()) {
            //         sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时
            //     }
            // }
        }

        sleep(random(myAPP.delayMin, myAPP.delayMax))
    };
};


//开宝箱领金币
function app_openBox() {
    if (text("任务").findOne().parent().click()) {
        sleep(random(myAPP.delayMin, myAPP.delayMax))
    }
    if (text("开宝箱得金币").exists()) {
        // 运行时间长了以后，开箱得金币的文本会变。
        if (className("android.view.View").text("开宝箱得金币").exists()) {
            var scope = className("android.view.View").text("开宝箱得金币").findOne().bounds();
            click(scope.centerX(), scope.centerY());
            sleep(random(myAPP.delayMin, myAPP.delayMax))
        }
    } else if (text("去邀请").exists()) {
        log("开宝箱得金币按钮不存在，另一种方式领取")
        if (className("android.widget.Button").text("去邀请").exists()) {
            var scope = className("android.widget.Button").text("去邀请").findOne().bounds();
            click(scope.centerX(), scope.bottom);
            sleep(random(myAPP.delayMin, myAPP.delayMax))
        }
    } else {
        log("未找到宝箱")
    }

}

// 阅读文章
function app_readArticle() {
    log(getNowFormatDate() + "任务总数：" + myAPP.readTotalNum + "个")
    log(getNowFormatDate() + "每执行：" + myAPP.every + "个，暂停" + myAPP.suspend + "毫秒")
    log(getNowFormatDate() + "执行间隔：" + myAPP.delayMin + "-" + myAPP.delayMax + "毫秒")


    while (true) {
        myAPP.activity = currentActivity()
        log("页面地址：" + myAPP.activity)

        if (myAPP.readTaskNum >= myAPP.readTotalNum) {
            log("阅读任务已完成")
            device.vibrate(500);  //震动
            break;   //跳出循环
        }




        if (text("首页").exists()) {
            log("页面地址：main")

            if (text("任务").depth(10).exists()) {
                app_openBox();
            } else {
                // 刷新文章列表
                if (text("首页").findOne().parent().click()) {
                    sleep(random(myAPP.delayMin, myAPP.delayMax))
                }
                if (text("推荐").findOne().parent().click()) {
                    sleep(random(myAPP.delayMin, myAPP.delayMax))

                    // 翻页
                    swipeEx(device.width / 2, device.height * 0.8, device.width / 2, device.height / 5, random(500, 1000)); //向上滑动翻页
                    sleep(random(myAPP.delayMin, myAPP.delayMax))

                    //点击文章标题
                    list_clickTitle()
                    sleep(random(myAPP.delayMin, myAPP.delayMax))
                }
            };

        } else if (textStartsWith("写评论").exists()) {
            switch (myAPP.activity) {
                case "com.ss.android.article.lite.activity.MainActivity":
                    if (!text("首页").exists()) {
                        back()  //返回
                        sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时
                    }
                case "com.ss.android.article.base.feature.detail2.view.NewDetailActivity":
                    log("页面地址：article")
                    //阅读文章
                    if (list_readArticle()) {
                        //每执行多少个暂停多少秒
                        if (myAPP.readTaskNum % parseInt(myAPP.every) == 0 && myAPP.readTaskNum > 0) {
                            let timeOut = parseInt(myAPP.suspend)
                            toastLog('任务暂停' + "，等待" + timeOut + "毫秒");
                            sleep(timeOut);  //随机延时
                        };
                    };

                    break;
                case "com.bytedance.learningplugin.LearningLiteVideoActivity":
                case "com.ss.android.article.base.feature.detail2.view.NewVideoDetailActivity":
                case "com.ss.android.wenda.answer.list.AnswerListActivity":
                    log("页面地址：video/answer")
                    sleep(random(myAPP.delayMin, myAPP.delayMax))
                    back()  //返回
                    sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时
                    break;
                default:
                    break;
            }
        } else {
            log("页面地址：other")
            back()  //返回
            sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时
            launchPackage(myAPP.packageName)   //启动APP
        }

        sleep(random(myAPP.delayMin, myAPP.delayMax))
    };
};


// 阅读文章
function list_readArticle() {
    let date1 = new Date();    //开始时间
    let date2 = date1.getTime()
    let result = false
    //执行翻页
    while (true) {
        if (textStartsWith("写评论").exists()) {
            // 取随机偶数
            if (random(1, 100) % 2 == 0) {
                log("随机滑动")
                swipeEx(device.width / 2, device.height * 0.8, device.width / 2, random(device.height / 4, device.height / 5), random(500, 1000)); //向上滑动翻页
                sleep(random(500, 1000))
            } else {
                log("固定滑动")
                scrollForward();   //下滑+右滑
                sleep(random(500, 1000))
            };

            // 检测是否到达文章正文尾部
            let obj = text("搜索").depth(21)
            if (obj.exists()) {
                let y = obj.findOne().bounds().centerY();
                if (y < device.height && y > 0) {
                    log("内容已浏览完")
                    break;  //跳出循环
                };
            } else if (text("广告").depth(11).exists() || text("已显示全部评论").depth(20).exists() || textStartsWith("暂无评论").depth(21).exists()) {
                log("内容已浏览完")
                break;  //跳出循环
            };

        } else {
            log("不在内容页面")
            break;  //跳出循环
        };

        date1 = new Date();    //结束时间
        let date3 = date1.getTime()
        if ((date3 - date2) > myAPP.readTimeOut) {
            // 设置超时：防止有的页面，比如广告页，没有明显的标识。会出现阅读阻塞的问题。
            log("阅读已超时")
            break;  //跳出循环
        };

    };
    if (textStartsWith("写评论").exists()) {
        myAPP.readTaskNum++;
        result = true
        log("已浏览完第" + myAPP.readTaskNum + "个")
    };
    back()  //返回
    sleep(random(myAPP.delayMin, myAPP.delayMax))  //随机延时

    return result;
};

// 点击标题
function list_clickTitle() {
    var object = className("TextView").depth(17).findOne(0);
    if (object != null) {
        if (object.text().length > 10) {
            // 点击标题，进入详情页
            let title = object.parent().parent()
            if (title != null) {
                if (title.click()) {
                    log("点击标题成功")
                } else {
                    log("点击标题失败")
                };
            };
        };
    } else {
        log("没找到标题组件，请检查APP版本或机型╭(╯^╰)╮");
    };
};



// 取邀请码
function app_getCode() {
    var code = ""
    if (textStartsWith("点击复制邀请码").exists()) {
        code = textStartsWith("点击复制邀请码").findOne().text().replace("点击复制邀请码: ", "")
    }
    return code
};

// 取现金金额
function app_getRMB() {
    var arr = new Array()
    var num = 0
    if (text("现金金额").exists()) {
        var uc = className("TextView").depth(15).find();
        for (var i = 0; i < uc.length; i++) {
            var tv = uc[i];
            if (tv.text() != "" && tv.id() != null) {
                arr.push(tv.text())
            }
        }
    }
    if (arr.length > 1) {
        num = Number(arr[0])
    }
    return num
};


// 取金币余额
function app_getGold() {
    var arr = new Array()
    var num = 0
    if (text("金币余额").exists()) {
        var uc = className("TextView").depth(15).find();
        for (var i = 0; i < uc.length; i++) {
            var tv = uc[i];
            if (tv.text() != "" && tv.id() != null) {
                arr.push(tv.text())
            }
        }
    }
    if (arr.length > 1) {
        num = Number(arr[1])
    }
    return num
};



//仿真随机带曲线滑动  
//qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
function swipeEx(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };

    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {

        eval("point.push(dx" + i + ")");

    };
    // log(point[3].x)

    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]

        xxy.push(xxyy);

    }

    // log(xxy);
    gesture.apply(null, xxy);
};

function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};



/*
强制结束app，无需root权限
@author：飞云
@packageName：包名
@timeOut：超时时长，毫秒
返回值：Boolean，是否执行成功
*/
function killApp(packageName, timeOut) {
    if (!timeOut) {
        timeOut = 30000   //默认30秒
    };
    let date1 = new Date();    //开始时间
    let date2 = date1.getTime()
    let result = false   //执行结果

    if (!openAppSetting(packageName)) {
        log("找不到应用，请检查packageName")
    } else {
        while (true) {
            // 测试不同的机型和安卓版本，可能结束按钮的名称不同。这里要做多机型适配
            if (text("结束运行").exists()) {
                click("结束运行");
            } else if (text("强制停止").exists()) {
                click("强制停止");
            } else if (text("确定").exists()) {
                // 确定按钮
                click("确定");
                result = true;

                break;  //跳出循环
            } else {
                date1 = new Date();    //结束时间
                let date3 = date1.getTime()
                if ((date3 - date2) > timeOut) {
                    log("killApp已超时，无法结束程序，请检查机型或安卓版本")
                    break;  //跳出循环
                };
            };
            sleep(500)
        };
    };
    if (result) {
        // back();
        desc("返回").click();   //右上角返回按钮
    }
    return result;
};