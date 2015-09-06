/**
 * webscratch JS
 * index
 * 2015-08-06
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
            $GP = Base.getPrefix,
            $EF = Base.execFun,
            $ADPALLSTYLE = Base.adpAllStyle,
            $TXTREADER = Base.txtReader,
            $CREATESTYLE = Base.createStyle;

    var body = DOC.body;
    var Dpr = getDevicePixelRatio();

    function initialize() {
        $T($$("#dpr"), Dpr);
        initCanvas();
        var img = $_('img', $$("#con"));
        img.src = 'img/avatar.jpg';
        img.onload = function () {
            $D(body, 1);
        };
    }
    function initCanvas() {
        var canvas = $$("#canvas");
        var ctx = canvas.getContext("2d");

        var scale = Touch ? (WIN.innerWidth / 480) : 1;
        var width, height;
        var WidthDotNum = 6;
        var MonteCarlo = [];

        setInfo();
        initEvent();
        initDraw();

        function setInfo() {
            //var styleWidth = canvas.offsetWidth;
            //var styleHeight = canvas.offsetHeight;

            var styleWidth = Touch ? WIN.innerWidth : 480;
            var styleHeight = Touch ? 480 * scale : 480;
            width = styleWidth * Dpr;
            height = styleHeight * Dpr;

            //canvas.style.width = styleWidth + 'px';
            //canvas.style.height = styleHeight + 'px';
            canvas.width = width;
            canvas.height = width;
        }
        function initEvent() {
            var START_EVENT = Touch ? 'ontouchstart' : 'onmousedown',
                    MOVE_EVENT = Touch ? 'ontouchmove' : 'onmousemove',
                    END_EVENT = Touch ? 'ontouchend' : 'onmouseup';
            var begin;

            canvas[START_EVENT] = onStart;

            function onStart(e) {
                e.stopPropagation();
                if (begin)
                    return;
                begin = true;
                e.preventDefault();
                drawPoint(e);

                DOC[MOVE_EVENT] = onMove;
                DOC[END_EVENT] = onEnd;
            }
            function onMove(e) {
                e.preventDefault();
                e.stopPropagation();
                drawPoint(e);
            }
            function onEnd(e) {
                e.stopPropagation();
                DOC[MOVE_EVENT] = "";
                DOC[END_EVENT] = "";
                begin = false;
                docheck();
            }

            function drawPoint(e) {
                var tar = Touch ? e.touches[0] : e;
                var x = Touch ? (tar.pageX - 0 * scale) : (tar.offsetX === undefined ? tar.layerX : tar.offsetX);
                var y = Touch ? (tar.pageY - 70 * scale) : (tar.offsetY === undefined ? tar.layerY : tar.offsetY);

                ctx.save();
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();

                ctx.arc(x * Dpr, y * Dpr, width / WidthDotNum / 2, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.restore();

                if (!MonteCarlo[getIndex(x * Dpr, width)])
                    MonteCarlo[getIndex(x * Dpr, width)] = [];
                MonteCarlo[getIndex(x * Dpr, width)][getIndex(y * Dpr, height)] = 1;

                $T($$("#cx"), x);
                $T($$("#cy"), y);

                function getIndex(num, par) {
                    var val = Math.floor(num * WidthDotNum / width);
                    var maxVal = Math.round(par / width * WidthDotNum);
                    (val >= maxVal) && (val = maxVal - 1);
                    return val;
                }
            }
        }
        function initDraw() {
            ctx.fillStyle = "#222B2C";
            ctx.fillRect(0, 0, width, height);
            var adp = scale * Dpr;

            ctx.font = (60 * adp) + "px Helvetica";
            ctx.lineWidth = 2 * adp;
            ctx.strokeStyle = "#656565";
            ctx.fillStyle = '##515151';

            ctx.strokeText("刮开看看", 120 * adp, 240 * adp);
            ctx.fillText('刮开看看', 120 * adp, 240 * adp);
        }
        function docheck() {
            var num = 0;
            var Ay = Math.round(height / width * WidthDotNum);
            for (var i = 0; i < WidthDotNum; i++) {
                for (var j = 0; j < Ay; j++) {
                    if (MonteCarlo[i] && MonteCarlo[i][j])
                        num++;
                }
            }
            if (num / WidthDotNum / Ay > 0.5) {
                ctx.clearRect(0, 0, width, width);
                $D(canvas);
            }

            $T($$("#ma"), Ay * WidthDotNum);
            $T($$("#mn"), num);
        }
    }
    function getDevicePixelRatio() {
        return WIN.devicePixelRatio || 1;
    }

    (function () {
        var styleStr;
        if (Touch) {
            styleStr = 'body{font-size:18px}#nav{height:70px}#nav>p{line-height:70px;font-size:32px}#nav>a{bottom:4px;font-size:16px}#con{height:480px}#btm{padding:10px 15px}#btm>div{margin:5px 0}';
            $ADPALLSTYLE(styleStr, '', initialize);
        } else {
            styleStr = 'body{background-color:#d8e5f0}#main{width:480px}.fix{position:absolute}';
            $CREATESTYLE(styleStr, '', initialize);
        }
    })();
})();
