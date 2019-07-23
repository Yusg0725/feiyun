var myAPP = {};
myAPP.package = "com.ss.android.article.lite"
myAPP.toastNum = 0   //任务计数
myAPP.pagesNum = 30    //翻页次数，可修改

app_main()


// 主框架
function app_main() {
    while (true) {
        myAPP.activity = currentActivity()
        log("页面地址：" + myAPP.activity)

        switch (myAPP.activity) {
            case "com.ss.android.article.lite.activity.MainActivity":
                log("页面地址：main")
                // 刷新文章列表
                if (text("首页").findOne().parent().click()) {
                    sleep(random(1000, 3000))
                }
                if (text("推荐").findOne().parent().click()) {
                    sleep(random(1000, 3000))
                }

                // 翻页
                swipeEx(device.width / 2, device.height / 2, device.width / 2, device.height / 5, random(500, 1000)); //向上滑动翻页
                sleep(random(1000, 1500))  //随机延时

                //点击文章标题
                app_clickTitle()
                sleep(random(1000, 1500))  //随机延时

                break;
            case "com.ss.android.article.base.feature.detail2.view.NewDetailActivity":
                log("页面地址：article")

                //阅读文章
                app_readArticle()

                break;
            case "com.ss.android.article.base.feature.detail2.view.NewVideoDetailActivity":
                log("页面地址：video")
                back()  //返回
                sleep(random(1000, 3000))  //随机延时
                break;
            case "com.ss.android.wenda.answer.list.AnswerListActivity":
                log("页面地址：answer")
                back()  //返回
                sleep(random(1000, 3000))  //随机延时
                break;
            default:
                log("页面地址：other")
                back()  //返回
                sleep(random(1000, 3000))  //随机延时
                launchPackage(myAPP.package)
                break;
        }

        sleep(random(1000, 3000))
    };
}


// 阅读文章
function app_readArticle() {

    //执行翻页
    for (i = 0; i < myAPP.pagesNum; i++) {
        if (textStartsWith("写评论").exists()) {
            log("执行翻页，第" + (i + 1) + "次")
            // 取随机偶数
            if (random(1, 100) % 2 == 0) {
                log("随机滑动")
                swipeEx(device.width / 2, device.height * 0.8, device.width / 2, random(device.height / 4, device.height / 5), random(500, 1000)); //向上滑动翻页
                // sleep(random(500, 1000))
                sleep(random(100, 500))
            } else {
                log("固定滑动")
                scrollForward();
                // sleep(random(1000, 1500))  //随机延时
                sleep(random(100, 500))
            }

            // 检测是否到达文章正文尾部
            if (text("广告").depth(11).exists() || text("已显示全部评论").depth(20).exists()) {
                log("跳出文章内容页")
                swipeEx(device.width / 2, device.height / 2, device.width / 2, random(device.height / 4, device.height / 5), random(500, 1000)); //向上滑动翻页
                sleep(random(1000, 1500))  //随机延时
                break;  //跳出循环
            }

        } else {
            log("不在内容页面")
            break;  //跳出循环
        }
    }
    if (textStartsWith("写评论").exists()) {
        myAPP.toastNum++;
        log("已浏览完第" + myAPP.toastNum + "个")

        back()  //返回
        sleep(random(1000, 3000))  //随机延时
    }
}

// 点击标题
function app_clickTitle() {
    var object = className("TextView").depth(17).findOne(0);
    if (object != null) {
        if (object.text().length > 10) {
            // 点击标题，进入详情页
            let title = object.parent().parent()
            if (title != null) {
                if (title.click()) {
                    return
                } else {
                    log("点击标题失败")
                }
            }
        }
    } else {
        log("没找到标题组件，请检查APP版本或机型╭(╯^╰)╮");
    }


    // var object = className("TextView").depth(17).find();
    // if (!object.empty()) {
    //     object.forEach(function (currentValue, index) {
    //         // log(currentValue.text())
    //         // log(currentValue.text().length)
    //         if (currentValue.text().length > 10) {
    //             // 点击标题，进入详情页
    //             let title = currentValue.parent().parent()
    //             if (title != null) {
    //                 if (title.click()) {
    //                     return
    //                 } else {
    //                     log("点击标题失败")
    //                 }
    //             }
    //         }
    //     });
    // } else {
    //     log("没找到标题组件，请检查APP版本或机型╭(╯^╰)╮");
    // }
}






function jsclick(way, txt, clickKey, n) {
    if (!n) { n = 1 };
    var res = false;
    if (!clickKey) { clickKey = false };
    if (way == "text") {
        res = text(txt).findOne(200);
    } else if (way == "id") {
        res = id(txt).findOne(200);
    } else if (way == "desc") {
        res = desc(txt).findOne(200);
    }
    if (res) {
        log("找到->", txt)
        if (clickKey) {
            log('准备点击->', txt);
            log("x:", res.bounds().centerX(), "y:", res.bounds().centerX());
            click(res.bounds().centerX(), res.bounds().centerY());
            // Tap(res.bounds().centerX(),res.bounds().centerY());
            sleep(1000 * n);
        }
        return true;
    } else {
        log("没有找到->", txt)
    }
}

function news() {
    var readnews = 0;


    while (true) {
        if (jsclick("text", "首页", true, 5)) {
            log('home')

        } else if (textMatches("/写评论.*/").findOne(200)) {
            log('look', readnews)

            readnews++
            if (readnews > 20) {
                return true
            }

        } else if (textMatches("/头条认证.*/").findOne(200)) {
            log('头条认证')
        } else {
            log('other')
            back();
            app.launchApp("今日头条极速版");
        }
        sleep(2000)
    }
}


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



