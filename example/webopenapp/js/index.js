/**
 * webopenapp JS
 * index
 * 2018-08-06
 */

(function () {
    var WIN = window,
            DOC = document,
            NAV = navigator,
            LOC = location,
            HIS = history;
    var innerHTML = "innerHTML",
            className = "className",
            appendChild = "appendChild",
            style = "style";

    var Base = BASE;
    var Touch = Base.cfg.isTouch;
    var $$ = Base.getEle,
            $_ = Base.creEle,
            $D = Base.disEle,
            $T = Base.txtEle,
            $R = Base.rmvEle,
            $G = Base.getUrl,
            $GC = Base.getCoord,
            $EF = Base.execFun,
            $JP = Base.jsonParse,
            $JS = Base.jsonStringify,
            $SS = Base.setStorage,
            $GS = Base.getStorage,
            $AJAX = Base.ajax,
            $ADPALLSTYLE = Base.adpAllStyle,
            $CREATESTYLE = Base.createStyle;

    var body = DOC.body;

    var OpenUrl = 'lingxi://browser?url=http://tangzhengwen.com';
    var DownLoad = 'http://s1.voicecloud.cn/resources/lxdl/index.html';
    var WaitTime = 1200;
    var BlurTime = 2400;

    function initialize() {
        $$('#lx').onclick = openWatch;
        setTimeout(function () {
            $D(body, 1);
        }, 0);
    }
    function openWatch() {
        var iframe = $$("#iframe") ? $$("#iframe") : $_("iframe", body, 'iframe', 'zero');
        iframe.src = OpenUrl;
        if (iframe.isOpened === 1)
            return;

        iframe.clearBlur && clearTimeout(iframe.clearBlur);
        iframe.openTimeout && clearTimeout(iframe.openTimeout);

        iframe.openTimeout = setTimeout(function () {
            iframe.isOpened = 0;
            openWatchDlg();
        }, WaitTime);
        iframe.clearBlur = setTimeout(function () {
            WIN.onblur = '';
        }, BlurTime);
        WIN.onblur = function () {
            iframe.openTimeout && clearTimeout(iframe.openTimeout);
            iframe.isOpened = 1;
            var watchPanel = $$("#watchPanel");
            watchPanel && watchPanel.isOpen && watchPanel.close();
            $T($$("#lx"), '灵犀语音助手-已安装');
        };
    }
    function openWatchDlg() {
        var watchPanel = $$("#watchPanel");
        !watchPanel && create();
        open();

        function create() {
            watchPanel = $_();
            watchPanel.close = close;
            watchPanel.id = "watchPanel";
            $$("#main")[appendChild](watchPanel);

            var con = $_('', watchPanel, 'watchPanel_con');
            $T($_('', con, 'watchPanel_title'), '下载灵犀');
            var div = $_('', con, 'watchPanel_info');
            $_('img', div, 'watchPanel_img').src = 'img/logo.png';
            $T($_('', div, 'watchPanel_desc'), '灵犀语音助手，您贴身的语音小秘书。解放手指，从容生活。');
            var dl = $_('', con, 'watchPanel_dl', 'btn btn-danger btn-lg');
            $T(dl, '立即安装');

            event();

            function event() {
                watchPanel.onclick = function (e) {
                    e && e.preventDefault();
                    e && e.stopPropagation();
                    close();
                };
                con.onclick = function (e) {
                    e && e.preventDefault();
                    e && e.stopPropagation();
                };
                dl.onclick = function (e) {
                    close(function () {
                        LOC.href = DownLoad;
                    });
                };
            }
        }

        function open() {
            watchPanel.isOpen = 1;
            $D(watchPanel, 1);
            setTimeout(function () {
                watchPanel[className] = 'open';
            }, 0);
        }
        function close(callback) {
            watchPanel.isOpen = 0;
            watchPanel[className] = '';
            setTimeout(function () {
                $D(watchPanel);
                $EF(callback);
            }, 301);
        }
    }

    (function () {
        var styleStr;
        if (Touch) {
            styleStr = 'body{font-size:18px}#nav{height:70px}#nav>p{line-height:70px;font-size:32px}#nav>a{bottom:4px;font-size:16px}.con-head{padding:15px 4%;line-height:40px}.con-body{padding:50px 4%}.btn{border-radius:4px;padding:8px 22px;font-size:18px}.btn-lg{padding:10px 30px;font-size:24px}#watchPanel_con{height:300px;bottom:-300px;border-radius:6px 6px 0 0}#watchPanel_title{font-size:28px;line-height:60px}#watchPanel_info{padding:40px 4%}#watchPanel_img{width:80px;height:80px;margin-top:-40px}#watchPanel_desc{padding-left:100px}';
            $ADPALLSTYLE(styleStr, '', initialize);
        } else {
            styleStr = 'body{background-color:#d8e5f0}#main{width:480px;height:500px;overflow:hidden}#watchPanel{position:absolute}';
            $CREATESTYLE(styleStr, '', initialize);
        }
    })();
})();