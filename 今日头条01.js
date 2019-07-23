var myAPP = {};
myAPP.toastNum = 0   //任务计数
myAPP.pagesNum = 30    //翻页次数，可修改


waitForActivity("com.ss.android.article.lite.activity.MainActivity")   //首页——推荐
// 文章页面
// com.ss.android.article.base.feature.detail2.view.NewDetailActivity
// 视频页面
// com.ss.android.article.base.feature.detail2.view.NewVideoDetailActivity   

var vionson = 1;

function main(){
    var object = id("cv").depth(17).find();
    if (!object.empty()) {
        toastLog("开始执行");
        object.forEach(function (currentValue, index) {
            // log(index)
            log(currentValue.text())
    
            // 点击标题，进入详情页
            if (currentValue.parent().parent().click()) {
                sleep(random(1000, 3000))
    
                if (currentActivity() == "com.ss.android.article.base.feature.detail2.view.NewVideoDetailActivity") {
                    log("进入了视频页面，跳过")
                } else if (currentActivity() == "com.ss.android.article.base.feature.detail2.view.NewDetailActivity") {
                    log("进入了文章页面")
                    //执行翻页
                    for (i = 0; i < myAPP.pagesNum; i++) {
                        log("执行翻页，第" + (myAPP.pagesNum + 1) + "次")
                        sleep(random(1000, 1500))  //等页面滑动执行完成
                        //当前页面逻辑
                        scrollForward();
                        sleep(random(1000, 3000))
                    }
                    myAPP.toastNum++;
                    log("已浏览完第" + myAPP.toastNum + "个")
                } else {
                    log(currentActivity())
                }
    
                back()
                sleep(2000)
            } else {
                log("点击标题失败")
            }
    
        });
    
    
        log("执行完毕，共执行" + myAPP.toastNum + "个")
    
    } else {
        log("没找到标题组件，请检查APP版本或机型╭(╯^╰)╮");
    }    
}


function jsclick(way,txt,clickKey,n){
    if(!n){n=1};
    var res = false;
    if(!clickKey){clickKey=false};
    if (way == "text"){
        res = text(txt).findOne(200);
    }else if(way == "id"){
        res = id(txt).findOne(200);
    }else if(way == "desc"){
        res = desc(txt).findOne(200);
    }
    if(res){
        log("找到->",txt)
    if (clickKey){
        log('准备点击->',txt);
        log("x:",res.bounds().centerX(),"y:",res.bounds().centerX());
        click(res.bounds().centerX(),res.bounds().centerY());
        // Tap(res.bounds().centerX(),res.bounds().centerY());
        sleep(1000*n);
    }
        return true;
    }else{
    log("没有找到->",txt)
    }
}

function news(){
    var readnews = 0;
    

    while(true){
        if(jsclick("text","首页",true,5)){
            log('home')

        }else if(textMatches("/写评论.*/").findOne(200)){
            log('look',readnews)

            readnews++
            if (readnews>20){
                return true
            }

        }else if(textMatches("/头条认证.*/").findOne(200)){
            log('头条认证')
        }else{
            log('other')
            back();
            app.launchApp("今日头条极速版");
        }
        sleep(2000)
    }
}


news()
