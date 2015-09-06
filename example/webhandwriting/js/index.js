/**
 * webhandwriting JS
 * index
 * 2015-09-06
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
            style = "style",
            addEventListener = "addEventListener";

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
            $CLS = Base.dealCls,
            $EF = Base.execFun,
            $ADPALLSTYLE = Base.adpAllStyle,
            $TXTREADER = Base.txtReader,
            $CREATESTYLE = Base.createStyle;

    var body = DOC.body;
    var Dpr = getDevicePixelRatio();
    var Type = 0, Color = '#000', Drawed;

    function initialize() {
        initEvent();
        initCanvas();
        setTimeout(function () {
            $D(body, 1);
        }, 0);
    }
    function initEvent() {
        triggerMenu($$("#btn_type_btn"), $$("#btn_type_menu"));
        triggerMenu($$("#btn_color_btn"), $$("#btn_color_menu"));
        $$("#btn_retry").onclick = function () {
            $EF($$("#canvas").clear);
        };
        $$("#btn_save").onclick = function () {
            if($CLS(this, 'disable'))
                return;
            $$("#btn_save").href = $$("#canvas").toDataURL('image/jpeg');;
        };
        dealType();
        dealColor();

        function dealType() {
            var children = $$("#btn_type_menu").children;
            for(var i = 0; i < children.length; i++)
                deal(i);

            function deal(i) {
                var item = children[i];
                item.onclick = function () {
                    Type = i;
                    $$("#btn_type_btn")[innerHTML] = item.children[0][innerHTML] + ' <span class="caret"></span>';
                };
            }
        }
        function dealColor() {
            var ary = ['#000', '#f0ad4e', '#5cb85c', '#428bca', '#d9534f'];
            var children = $$("#btn_color_menu").children;
            for(var i = 0; i < children.length; i++)
                deal(i);

            function deal(i) {
                var item = children[i];
                item.onclick = function () {
                    Color = ary[i];
                    $$("#btn_color_btn")[innerHTML] = item.children[0][innerHTML] + ' <span class="caret"></span>';
                };
            }
        }
    }
    function initCanvas() {
        var canvas = $$("#canvas");
        var ctx = canvas.getContext("2d");
        var scale = Touch ? (WIN.innerWidth / 480) : 1;
        var width, height;

        setInfo();
        initEvent();
        canvas.clear();

        function setInfo() {
            var styleWidth = Touch ? WIN.innerWidth : 480;
            var styleHeight = Touch ? 480 * scale : 480;
            width = styleWidth * Dpr;
            height = styleHeight * Dpr;

            canvas.width = width;
            canvas.height = width;
        }
        function initEvent() {
            var START_EVENT = Touch ? 'ontouchstart' : 'onmousedown',
                    MOVE_EVENT = Touch ? 'ontouchmove' : 'onmousemove',
                    END_EVENT = Touch ? 'ontouchend' : 'onmouseup';
            var begin;

            canvas[START_EVENT] = onStart;
            canvas.clear = onClear;

            function onStart(e) {
                e.stopPropagation();
                if (begin)
                    return;
                begin = true;
                e.preventDefault();
                drawStart(e);

                DOC[MOVE_EVENT] = onMove;
                DOC[END_EVENT] = onEnd;
            }
            function onMove(e) {
                e.preventDefault();
                e.stopPropagation();
                Drawed = 1;
                ctx.lineTo(getX(e), getY(e));
                ctx.stroke();
            }
            function onEnd(e) {
                e.stopPropagation();
                DOC[MOVE_EVENT] = "";
                DOC[END_EVENT] = "";
                begin = false;

                ctx.restore();
                Drawed && $CLS($$('#btn_save'), 'disable', 'del');
            }

            function onClear() {
                ctx.save();
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
                Drawed = 0;
                $CLS($$('#btn_save'), 'disable', 'add');
            }
            function drawStart(e) {
                ctx.lineJoin = ctx.lineCap = 'round';
                ctx.strokeStyle = Color;
                ctx.shadowColor = Color;

                var rateVal = scale * Dpr * 6;
                (Type === 2) && (rateVal *= 0.5);

                ctx.shadowBlur = 0;
                !Type && (ctx.shadowBlur = rateVal);
                ctx.lineWidth = rateVal;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(getX(e), getY(e));
            }
            function getX(e) {
                var tar = Touch ? e.touches[0] : e;
                return Touch ? (tar.pageX - canvas.clientLeft) * Dpr : (tar.offsetX === undefined ? tar.layerX : tar.offsetX) * Dpr ;
            }
            function getY(e) {
                var tar = Touch ? e.touches[0] : e;
                return Touch ? (tar.pageY - canvas.clientTop - 70 * scale) * Dpr : (tar.offsetY === undefined ? tar.layerY : tar.offsetY) * Dpr ;
            }
        }
    }
    function getDevicePixelRatio() {
        return WIN.devicePixelRatio || 1;
    }

    function triggerMenu(trigger, menu, parDom) {
        /**
         * show or hide menu
         * @trigger,@menu,@parDom HTMLElement
         */

        trigger[addEventListener]('click', function (e) {
            menu.clickTrigger = 1;
            menu.open ? hide() : show();
        });

        var dom = parDom ? parDom : DOC;
        dom[addEventListener]('click', function (e) {
            if (menu.clickTrigger)
                return menu.clickTrigger = 0;
            menu.open && hide();
        });

        function show() {
            $EF(menu.onShow);
            $D(menu, 1);
            menu.open = 1;
        }
        function hide() {
            $D(menu);
            menu.open = 0;
            $EF(menu.onHide);
        }
    }

    (function () {
        var styleStr;
        if (Touch) {
            styleStr = 'body{font-size:18px}#nav{height:70px}#nav>p{font-size:32px;line-height:70px}#nav>a{font-size:16px;bottom:4px}#con{height:480px}#btm{padding:15px 0}#btm .btn{width:100px}.btn{border-radius:4px;padding:8px 22px;font-size:18px}.btn-lg{padding:10px 30px;font-size:24px}.caret{margin-left:2px;border-bottom:4px solid;border-right:4px solid transparent;border-left:4px solid transparent}.dropdown-menu{line-height:40px;padding:5px 0;margin:2px 0 0;border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}.dropdown-menu>li>a{padding:0 20px}';
            $ADPALLSTYLE(styleStr, '', initialize);
        } else {
            styleStr = 'body{background-color:#d8e5f0}#main{width:480px}.fix{position:absolute}';
            $CREATESTYLE(styleStr, '', initialize);
        }
    })();
})();
