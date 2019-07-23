var myAPP = {};
myAPP.appName = "抖音短视频"
myAPP.version = "7.2.1"
myAPP.packageName = "com.ss.android.ugc.aweme"
myAPP.letterTotalNum = 300   //私信任务总数
myAPP.letterTaskNum = 0   //私信任务计数
myAPP.letterTimeOut = 60000   ///私信超时时间

myAPP.every = 10
myAPP.suspend = 60000
myAPP.delayMin = 1000   //延时最小值
myAPP.delayMax = 3000   //延时最大值

myAPP.findTimeOut = 1000   //查找节点超时时长

//--------------------------------------------------------------------------------------------------------------------------

var date1 = new Date();    //开始时间
var date2 = date1.getTime()

// log(currentPackage());
// log(currentActivity());

console.show()
toastLog("设备分辨率：" + device.width + "*" + device.height)


//监听弹窗事件(异常处理)
threads.start(function () {
    while (true) {
        sleep(1200);
        if (text('发现通讯录好友').exists()) {
            text('取消').click();
        } else if (text('修改备注名').exists()) {
            text('取消').click();
        } else if (textStartsWith('安装').exists()) {
            text('取消').click();
        };
    };
});

app_letter()


date1 = new Date();    //结束时间
var date3 = date1.getTime()
log("本次共执行 " + (date3 - date2 - 2) + " ms")

//--------------------------------------------------------------------------------------------------------------------------

//取随机话术
function getRndTalking() {
    let talkings = Array();
    //这里可以添加多条话术。内容可从后台传入。
    talkings.push("hello");
    talkings.push("你是哪里的？");
    return talkings[random(0, talkings.length - 1)].toString();  //返回字符串（对象转换成字符串）
};


// 发送私信
function app_letter() {
    log(getNowFormatDate() + "任务总数：" + myAPP.letterTotalNum + "个")
    log(getNowFormatDate() + "每执行：" + myAPP.every + "个，暂停" + myAPP.suspend + "毫秒")
    log(getNowFormatDate() + "执行间隔：" + myAPP.delayMin + "-" + myAPP.delayMax + "毫秒")


    while (true) {
        myAPP.activity = currentActivity()
        log("页面地址：" + myAPP.activity)

        if (myAPP.letterTaskNum >= myAPP.letterTotalNum) {
            log("任务已完成")
            device.vibrate(500);  //震动
            break;   //跳出循环
        }

        switch (myAPP.activity) {
            case "com.ss.android.ugc.aweme.main.MainActivity":
                log("页面地址：首页/视频作者资料页")
            case "com.ss.android.ugc.aweme.following.ui.FollowRelationTabActivity":
                log("页面地址：粉丝列表")
                app_loopSend()
                break;
            case "com.ss.android.ugc.aweme.profile.ui.UserProfileActivity":
                log("页面地址：粉丝个人资料页")
                break;
            case "com.ss.android.ugc.aweme.im.sdk.chat.ChatRoomActivity":
                log("页面地址：私信会话页")
                break;
            default:
                break;
        }

        sleep(random(myAPP.delayMin, myAPP.delayMax))
    };
};



// 循环操作列表
function app_loopSend() {
    while (true) {
        if (myAPP.letterTaskNum >= myAPP.letterTotalNum) {
            log("任务已完成")
            device.vibrate(500);  //震动
            break;   //跳出循环
        }

        // 遍历用户昵称
        var object = className("TextView").depth(13).find();
        if (!object.empty()) {
            for (var i = 0; i < object.length; i++) {
                if (object[i].text() != "" && object[i].text() != "关注") {
                    var tv = object[i].parent().parent().parent();
                    if (tv != null) {
                        tv.click()   //点击列表项,进入用户资料页
                        sleep(random(myAPP.delayMin, myAPP.delayMax))

                        if (APP_发送文本私信(false)) {
                            //每执行多少个暂停多少秒
                            if (myAPP.letterTaskNum % parseInt(myAPP.every) == 0 && myAPP.letterTaskNum > 0) {
                                let timeOut = parseInt(myAPP.suspend)
                                toastLog('任务暂停' + "，等待" + timeOut + "毫秒");
                                sleep(timeOut);  //随机延时
                            };
                        }
                        if (textStartsWith("作品").exists() && textStartsWith("动态").exists() && textStartsWith("粉丝").exists()) {
                            back()
                            sleep(random(myAPP.delayMin, myAPP.delayMax))
                        }
                    } else {
                        log("点击表项失败")
                    };
                }
            };
        } else {
            log("Error:没找到用户昵称╭(╯^╰)╮");
        };

        // 检查是否到达页面底部
        if (textStartsWith("没有更多了~").exists()) {
            log("没有更多了~")
            break;
        }

        if (textStartsWith("关注").exists() && textStartsWith("粉丝").exists()) {
            log("执行翻页")
            scrollForward()   //翻页
        }

        sleep(random(myAPP.delayMin, myAPP.delayMax))
    }
}

/*
修改日期：20190605
功能说明：
起始界面：用户资料页
备注说明：
分辨率：全分辨率
模块作者：
@isSend：是否发送。true，发送；false，不发送内容
*/
function APP_发送文本私信(isSend) {
    let 是否执行 = false
    let 执行结果 = false

    // 判斷是否在用戶資料頁
    waitForActivity("com.ss.android.ugc.aweme.profile.ui.UserProfileActivity")  //等待用户资料页出现

    if (text("这是私密账号").exists()) {
        log(getNowFormatDate() + "该用户设置了隐私，跳过")
    } else {
        // 间接私信
        // 有的用户进入个人资料页以后，会展开动态
        // 这时会出现两个“更多”按钮。两个按钮的depth不同。需要做下判断，过滤掉下面的按钮
        if (desc("更多").depth(13).findOne().click()) {
            sleep(random(myAPP.delayMin, myAPP.delayMax))
            log(getNowFormatDate() + "点击更多，成功")
            if (desc("私信").findOne().click()) {
                sleep(random(myAPP.delayMin, myAPP.delayMax))
                是否执行 = true
            };
        } else {
            log(getNowFormatDate() + "Error：点击更多，失败")
        };
    };

    textStartsWith("发送消息").waitFor();  //等待控件出现（底部输入框）
    if (desc("语音").exists() && desc("图片").exists() && desc("表情").exists()) {  //判断是否出现指定节点

        if (APP_是否已发过消息()) {
            log(getNowFormatDate() + "该用户已发送过，不在重复发送")
            是否执行 = false
        };

        //寻找会话气泡
        if (是否执行) {
            object = textStartsWith("发送消息").findOnce();
            if (object != null) {
                object.click();  //输入框置焦点
                sleep(random(100, 500));

                var sendContent = getRndTalking();
                // 检查分割
                if (sendContent.match("|")) {
                    sendContent = sendContent.replace(/｜/g, '|');
                    let strs = new Array();
                    strs = sendContent.split("|"); //字符分割 
                    for (i = 0; i < strs.length; i++) {
                        if (textStartsWith("由于对方关闭了私信功能").findOne(parseInt(myAPP.findTimeOut)) != null) {
                            log(getNowFormatDate() + "对方关闭了私信")
                            执行结果 = false
                            break;  //跳出for
                        } else {
                            setText(strs[i]);
                            sleep(random(100, 500));
                            // 发送信息，调试时可根据需要屏蔽

                            isSend && desc("发送").findOne().click();   //发送
                            let timeOut = random(parseInt(myAPP.delayMin), parseInt(myAPP.delayMax))
                            log(getNowFormatDate() + "私信成功" + "，延时" + timeOut + "毫秒")
                            sleep(timeOut);  //随机延时
                            执行结果 = true
                        };

                        object = textStartsWith("由于对方没有关注你").findOne(parseInt(myAPP.findTimeOut));
                        if (object != null && i >= 2) {
                            log(getNowFormatDate() + "对方未关注你，最多发送3条")
                            break;  //跳出for
                        };
                        object = textStartsWith("对方账号已被封禁").findOne(parseInt(myAPP.findTimeOut));
                        if (object != null) {
                            log(getNowFormatDate() + "对方账号已被封禁，不再发送")
                            break;  //跳出for
                        };
                    };

                } else {
                    setText(sendContent);
                    sleep(random(100, 500));
                    // 发送信息，调试时可根据需要屏蔽
                    isSend && desc("发送").findOne().click();   //发送
                    let timeOut = random(parseInt(myAPP.delayMin), parseInt(myAPP.delayMax))
                    log(getNowFormatDate() + "私信成功" + "，延时" + timeOut + "毫秒")
                    sleep(timeOut);  //随机延时
                    执行结果 = true
                };

            };
        };

        if (desc("语音").exists() && desc("表情").exists()) {
            desc("返回").findOne().click();   //返回
            sleep(random(myAPP.delayMin, myAPP.delayMax))
            //更多页
            if (text("举报").exists() && text("拉黑").exists() && text("对TA隐藏随拍").exists()) {
                desc("返回").findOne().click();   //返回
                // sleep(random(100, 500));
            };
            let timeOut = random(parseInt(myAPP.delayMin), parseInt(myAPP.delayMax))
            sleep(timeOut);  //随机延时
        };
    };

    return 执行结果;
};

/*
修改日期：20190722
功能说明：
起始界面：用户资料页
备注说明：
分辨率：全分辨率
模块作者：
*/
function APP_取用户昵称() {
    // 判斷是否在用戶資料頁
    waitForActivity("com.ss.android.ugc.aweme.profile.ui.UserProfileActivity")  //等待用户资料页出现
    // desc("更多").waitFor();  //等待控件出现
    let userName = ""
    if (className("TextView").depth(17).exists()) {
        userName = className("TextView").depth(17).findOne().text();
    } else {
        log(getNowFormatDate() + "Error：界面分析失败，请检查抖音版本或运行环境")
    };
    return userName;
};


/*
修改日期：20190722
功能说明：
起始界面：用户资料页
备注说明：不太完善，如果对方先给自己发了消息，会误判
分辨率：全分辨率
模块作者：
*/
function APP_是否已发过消息() {
    // 判斷是否在会话页
    waitForActivity("com.ss.android.ugc.aweme.im.sdk.chat.ChatRoomActivity")  //等待会话页出现
    // 检查会话内容
    let isSend = false
    let message = ""
    if (className("TextView").depth(11).exists()) {
        message = className("TextView").depth(11).findOne().text();
    };

    if (!message) {
        // isSend = false
    } else {
        isSend = true
    }

    return isSend;
};


//取格式化时间：[2019-06-06 14:54:26:72]
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() + 1 < 10 ? "0" + (date.getHours() + 1) : date.getHours() + 1;
    var minuate = date.getMinutes() + 1 < 10 ? "0" + (date.getMinutes() + 1) : date.getMinutes() + 1;
    var second = date.getSeconds() + 1 < 10 ? "0" + (date.getSeconds() + 1) : date.getSeconds() + 1;
    var millisecond = date.getMilliseconds() + 1 < 10 ? "0" + (date.getMilliseconds() + 1) : date.getMilliseconds() + 1;

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hours + seperator2 + minuate
        + seperator2 + date.getSeconds() + seperator2 + millisecond;
    return "[" + currentdate + "]";
};

/*
判断value是否在array中。
是，返回true;
否，返回false。
*/
function isInArray(value, array) {
    return (array.join() + ",").indexOf(value + ",") != -1;
};


