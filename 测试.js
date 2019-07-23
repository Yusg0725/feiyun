log(currentPackage());
log(currentActivity());

killApp("com.ss.android.ugc.aweme")



/*
强制结束app，无需root权限
@author：飞云
@packageName：包名
返回值：Boolean，是否执行成功
*/
function killApp(packageName) {
    let result = false   //执行结果

    let appName = getAppName(packageName)
    if (appName) {
        if (!openAppSetting(packageName)) {
            log("找不到应用，请检查packageName")
        } else {
            text(appName).waitFor()
            sleep(500)  //等待设置页加载
            // 测试不同的机型和安卓版本，可能结束按钮的名称不同。这里也许要做多机型适配
            if (text("结束运行").exists()) {
                click("结束运行");

                text("确定").waitFor()
                click("确定");
                result = true;
            } else if (text("强制停止").exists()) {
                click("强制停止");

                text("确定").waitFor()
                click("确定");
                result = true;
            } else {
                log("结束进程失败,请检查机型/安卓版本/是否卡机")
            };
        };
    } else {
        log("找不到应用，请检查packageName")
    }

    if (result) {
        // back();
        desc("返回").click();   //右上角返回按钮
    }
    return result;
};