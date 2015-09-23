/**
 * BASE Function JS
 * author: Don
 * copyright: http://tangzhengwen.com
 * update: 2015-09-21
 * version: 2.5.1
 * desc:
 *      WIN.BASE
 */

(function (name, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        this[name] = factory();
    }
}('BASE', function () {
    var WIN = window,
            DOC = document,
            NAV = navigator,
            LOC = location;
    var innerHTML = "innerHTML",
            className = "className",
            appendChild = "appendChild",
            style = "style",
            addEventListener = "addEventListener";
    var CFG = {
        isTouch: 'ontouchstart' in WIN  //Boolean, is touch device
    };
    var P = {
        cfg: CFG,
        /*===== No dependence =====*/
        //tool
        getUrl: getUrl,
        concatUrl: concatUrl,
        extendObj: extendObj,
        jsonParse: jsonParse,
        jsonStringify: jsonStringify,
        strCompare: strCompare,
        dataRound: dataRound,
        getCoord: getCoord,
        execFun: execFun,
        newXhr: newXhr,
        //dom
        getEle: getEle,
        creEle: creEle,
        txtEle: txtEle,
        disEle: disEle,
        rmvEle: rmvEle,
        parEle: parEle,
        dealCls: dealCls,
        /*===== No dependence =====*/
        getPrefix: getPrefix, //creEle
        xhrRes: xhrRes, //execFun
        styleReady: styleReady, //execFun
        getStorage: getStorage, //execFun,jsonParse
        setStorage: setStorage, //jsonStringify
        ajax: ajax, //concatUrl,newXhr,xhrRes,execFun
        txtReader: txtReader, //newXhr,xhrRes,execFun
        jsReader: jsReader, //execFun
        cssReader: cssReader, //execFun,styleReady
        createStyle: createStyle, //execFun,styleReady
        adpAllStyle: adpAllStyle  //execFun,createStyle
    };

    /*========== function ==========*/
    /*===== No dependence =====*/
    function getUrl(attr, ignore) {
        /**
         * get the value of attr from URL search, e.g. ?a=1&b=123
         * @attr String
         * @ignore Boolean, ignore case
         * return String, e.g. BASE.getUrl('b') === '123'
         */
        if (typeof attr !== "string") {
            console.log('%cBASE.js->getUrl->Error:%c @attr must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        var t = "", n;
        var reg = ignore ? 'gi' : 'g';
        decodeURIComponent(LOC.search).toString().replace(new RegExp("[?&]" + attr + "=[^&]+", reg), function (r) {
            n = r.split("=")[1];
            n && (t = n);
        });

        console.log('%cBASE.js->getUrl->Info:%c ' + t, 'color: #269abc', 'color: auto');
        return t;
    }
    function concatUrl(url, obj) {
        /**
         * concat url
         * @url String
         * @obj Object
         * return String, e.g. ?a=1&b=123
         */
        if (typeof url !== "string") {
            console.log('%cBASE.js->concatUrl->Error:%c @url must be a String', 'color: #ac2925', 'color: auto');
            return url;
        }
        if (typeof obj !== "object") {
            console.log('%cBASE.js->concatUrl->Error:%c @obj must be a Object', 'color: #ac2925', 'color: auto');
            return url;
        }
        if (url.indexOf('?') < 0) {
            url += '?';
        } else {
            url += '&';
        }
        for (var va in obj) {
            url += va + "=" + obj[va] + "&";
        }
        var len = url.length;
        if (url[len - 1] === '&' || url[len - 1] === '?') {
            url = url.slice(0, len - 1);
        }
        console.log('%cBASE.js->concatUrl->Info:%c ' + url, 'color: #269abc', 'color: auto');
        return url;
    }
    function extendObj(srcObj, tarObj, bool, subExtend) {
        /**
         * extend the source obj according to the target obj
         * @srcObj,@tarObj Object
         * @bool Boolean, true tar is srcObj else is tarObj
         * @subExtend Boolean, extend sub obj
         * return undefined
         */
        if (typeof srcObj !== "object" || typeof tarObj !== "object") {
            console.log('%cBASE.js->extendObj->Error:%c @srcObj & @tarObj must be a Object', 'color: #ac2925', 'color: auto');
            return;
        }
        var tar = tarObj;
        bool && (tar = srcObj);
        for (var va in tar) {
            if (subExtend) {
                dealSubExtend(va);
            } else {
                if (tarObj[va] !== undefined)
                    srcObj[va] = tarObj[va];
            }
        }
        console.log('%cBASE.js->extendObj->Info:%c %o', 'color: #269abc', 'color: auto', srcObj);

        function dealSubExtend(attr) {
            if (typeof tarObj[attr] === "object") {
                if (typeof srcObj[attr] === "object") {
                    for (var val in tarObj[attr]) {
                        srcObj[attr][val] = tarObj[attr][val];
                    }
                } else {
                    srcObj[attr] = tarObj[attr];
                }
            } else {
                if (tarObj[va] !== undefined)
                    srcObj[attr] = tarObj[attr];
            }
        }
    }
    function jsonParse(txt) {
        /**
         * try to catch JOSN parse error
         * @txt String
         * return Object
         */
        var ret;
        try {
            ret = JSON.parse(txt);
        } catch (e) {
            console.log('%cBASE.js->jsonParse->Error:%c JSON.parse error - %c' + e, 'color: #ac2925', 'color: auto', 'color: red');
        }
        return ret;
    }
    function jsonStringify(obj) {
        /**
         * try to catch JOSN stringify error
         * @obj Object
         * return String
         */
        var ret;
        try {
            ret = JSON.stringify(obj);
        } catch (e) {
            console.log('%cBASE.js->jsonStringify->Error:%c JSON.stringify error - %c' + e, 'color: #ac2925', 'color: auto', 'color: red');
        }
        return ret;
    }
    function strCompare(aStr, bStr, splitDot) {
        /**
         * string compare
         * @bStr,@aStr String
         * @splitDot String, default '.'
         * aStr > bStr return 1
         * aStr < bStr return -1
         * aStr == bStr return 0
         * 2.0.123 > 2.0.1221.5
         */
        if (typeof aStr !== "string" || typeof bStr !== "string") {
            console.log('%cBASE.js->strCompare->Error:%c @aStr & @bStr must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        var ret = 0;
        if (bStr === aStr)
            return ret;
        var dot = '.';
        if (splitDot && typeof splitDot === "string")
            dot = splitDot;

        var bAry = bStr.split(dot);
        var aAry = aStr.split(dot);
        var len = bAry.length;
        (aAry.length < len) && (len = aAry.length);
        for (var i = 0; i < len; i++) {
            if (aAry[i] - 0 > bAry[i] - 0) {
                ret = 1;
                break;
            } else if (aAry[i] - 0 < bAry[i] - 0) {
                ret = -1;
                break;
            }
        }
        console.log('%cBASE.js->strCompare->Info:%c ' + aStr + ' - ' + bStr + ' = ' + ret, 'color: #269abc', 'color: auto');
        return ret;
    }
    function dataRound(val, bit) {
        /**
         * numerical precision control
         * @val Number or String, e.g. 123 or '123'
         * @bit Number, precision, default is 0
         * return Number, e.g. BASE.dataRound('123.25', 1) === '123.3'
         */
        var ret;
        if ((val || val === 0) && !isNaN(val - 0)) {
            if (!bit || typeof bit !== 'number') {
                bit = 0;
            }
            var e = 1;
            for (var i = 0; i < bit; i++) {
                e *= 10;
            }
            ret = Math.round(val * e) / e;
        } else {
            console.log('%cBASE.js->dataRound->Warn:%c Invalid @val -%c ' + val, 'color: #d58512', 'color: auto', 'color: red');
        }
        console.log('%cBASE.js->dataRound->Info:%c ' + ret, 'color: #269abc', 'color: auto');
        return ret;
    }
    function getCoord(e, c) {
        /**
         * get event targe coord
         * @e Event
         * @c String, 'Y' or 'X'(default)
         * return Number
         */
        if (!e) {
            console.log('%cBASE.js->getCoord->Error:%c @e can not be empty', 'color: #ac2925', 'color: auto');
            return;
        }
        var org = e.originalEvent,
                ct = e.changedTouches;
        (c !== 'Y' && c !== 'y') && (c = 'X');
        c = c.toUpperCase();
        return ct || (org && org.changedTouches) ? (org ? org.changedTouches[0]['page' + c] : ct[0]['page' + c]) : e['page' + c];
    }

    function getEle(str) {
        /**
         * get DOM Element
         * @str String, '#id', '.class', 'tag'
         * return Element(#id) or Array Elements(.class tag)
         */
        if (typeof str !== "string") {
            console.log('%cBASE.js->getEle->Error:%c @str must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        var ary = str.split(' ');
        var par = DOC;
        for (var i = 0; i < ary.length; i++) {
            par = getTargetElement(ary[i]);
        }
        return par;

        function getTargetElement(subStr) {
            if (!par)
                return;
            if (par[0])
                par = par[0];
            var tar;
            try {
                if (subStr.indexOf("#") === 0) {  //id
                    tar = par.getElementById(subStr.substring(1));
                } else if (subStr.indexOf(".") === 0) {  //class
                    tar = par.getElementsByClassName(subStr.substring(1));
                } else {  //tag
                    tar = par.getElementsByTagName(subStr);
                }
            } catch (e) {
                console.log('%cBASE.js->getEle->Error:%c getTargetElement error - %c' + e, 'color: #ac2925', 'color: auto', 'color: red');
            }
            return tar;
        }
    }
    function creEle(tag, parEle, id, cls) {
        /**
         * create DOM Element
         * @tag String, default is 'div'
         * @parEle Element, parent node
         * @id,@cls String
         * all parameter allow empty
         * return Element
         */
        !tag && (tag = "div");
        if (typeof tag !== "string") {
            console.log('%cBASE.js->creEle->Error:%c @tag must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        var ele = DOC.createElement(tag);
        id && (typeof id === "string") && (ele.id = id);
        cls && (typeof cls === "string") && (ele.className = cls);
        parEle && parEle.appendChild && parEle.appendChild(ele);
        return ele;
    }
    function txtEle(ele, str) {
        /**
         * text str to Element
         * @ele Element
         * @str String or Number, empty mean clear
         * return undefined
         */
        if (!ele) {
            console.log('%cBASE.js->txtEle->Error:%c @ele can not be empty', 'color: #ac2925', 'color: auto');
            return;
        }
        if (typeof str !== "string" && typeof str !== "number") {
            console.log('%cBASE.js->txtEle->Error:%c @str must be a String or Number', 'color: #ac2925', 'color: auto');
            return;
        }
        str += '';
        if (ele.innerText !== undefined) {
            ele.innerText = str;
        } else if (ele.textContent !== undefined) {
            ele.textContent = str;
        } else {
            console.log('%cBASE.js->txtEle->Error:%c @ele must be an HTMLElement', 'color: #ac2925', 'color: auto');
        }
    }
    function disEle(ele, opt) {
        /**
         * haddle DOM Element hide and show
         * @ele Element
         * @opt Boolean or String
         */
        if (!ele || !ele.style) {
            console.log('%cBASE.js->disEle->Error:%c @ele must be an HTMLElement', 'color: #ac2925', 'color: auto');
            return;
        }
        if (opt === 'display') {
            return ele.style.display;
        }
        if (opt) {
            ele.style.display = (typeof opt === 'string') ? opt : 'block';
        } else {
            ele.style.display = 'none';
        }
    }
    function rmvEle(ele, isSelf) {
        /**
         * remove DOM Element
         * @ele Element
         * @isSelf Boolean, true remove ele self, false remove ele children
         * return undefined
         */
        if (!ele) {
            console.log('%cBASE.js->rmvEle->Error:%c @ele can not be empty', 'color: #ac2925', 'color: auto');
            return;
        }
        if (isSelf) {
            var parentNode = ele.parentNode;
            if (parentNode && parentNode.removeChild) {
                parentNode.removeChild(ele);
            } else {
                console.log('%cBASE.js->rmvEle->Warn:%c @ele must be an HTMLElement', 'color: #d58512', 'color: auto');
            }
        } else {
            if (ele.removeChild) {
                while (ele.firstChild) {
                    ele.removeChild(ele.firstChild);
                }
            } else {
                console.log('%cBASE.js->rmvEle->Warn:%c @ele must be an HTMLElement', 'color: #d58512', 'color: auto');
            }
        }
    }
    function parEle(tarElement, parElement) {
        /**
         * determine whether @parElement is @tarElement's parent element
         * @tarElement,@parElement Element
         * return Boolean
         */
        if (!tarElement || !parElement) {
            console.log('%cBASE.js->parEle->Error:%c @tarElement & @parElement can not be empty', 'color: #ac2925', 'color: auto');
            return;
        }
        if (!tarElement.parentElement)
            return false;
        if (tarElement.parentElement === parElement)
            return true;
        if (tarElement.parentElement === DOC.body)
            return false;
        parEle(tarElement.parentElement, parElement);
    }
    function dealCls(ele, cls, opt) {
        /**
         * add cls or delete cls for ele
         * @ele Element
         * @cls String
         * @opt String, add|del|has(default)
         * return Boolean or undefined
         */
        if (!ele) {
            console.log('%cBASE.js->dealCls->Error:%c @ele can not be empty', 'color: #ac2925', 'color: auto');
            return;
        }
        if (typeof cls !== "string") {
            console.log('%cBASE.js->dealCls->Error:%c @str must be a String', 'color: #ac2925', 'color: auto');
            return;
        }

        var eleClassName = ele[className];
        if (!eleClassName) {
            if (!/^add|del$/.test(opt))
                return;
            (opt === 'add') && (ele[className] = cls);
        } else {
            var ary = eleClassName.split(' ');
            var str = '';
            var flag;
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === cls) {
                    flag = 1;
                    if (opt === 'del')
                        continue;
                }
                str += ary[i] + ' ';
            }
            if (!/^add|del$/.test(opt))
                return flag;
            (opt === 'add') && !flag && (str += cls);
            (str[str.length - 1] === ' ') && (str = str.slice(0, str.length - 1));
            ele[className] = str;

        }

        console.log('%cBASE.js->dealCls->Info: %c' + ele[className], 'color: #269abc', 'color: auto');
    }

    function execFun(callback, arg1, arg2) {
        /**
         * if callback is function then execute it
         * @callback Function
         * return callback(arg1, arg2)
         */
        if (typeof callback === 'function') {
            callback(arg1, arg2);
        } else {
            console.log('%cBASE.js->execFun->Warn:%c @callback is not a function', 'color: #d58512', 'color: auto');
        }
    }
    function newXhr() {
        //return XMLHttpRequest
        var xhr;
        if (WIN.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        console.log('%cBASE.js->newXhr->Info:%c new XMLHttpRequest', 'color: #269abc', 'color: auto');
        return xhr;
    }

    /*===== dependence =====*/
    function getPrefix(str) {
        /**
         * get css3 prefix str
         * @str String, e.g. 'transition', 'transform'
         * return String, e.g. 'webkitTransition'
         */
        if (typeof str !== "string") {
            console.log('%cBASE.js->getPrefix->Error:%c @str must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        var alph = str.slice(0, 1);
        var con = str.slice(1);
        var upStr = alph.toUpperCase() + con;
        var lowStr = alph.toLowerCase() + con;
        var mod = creEle('modernizr')[style];
        var ary = ['webkit' + upStr, lowStr, 'Moz' + upStr, 'O' + upStr, 'ms' + upStr];
        var ret;
        for (var i = 0; i < ary.length; i++) {
            if (mod[ary[i]] !== undefined) {
                ret = ary[i];
                break;
            }
        }
        console.log('%cBASE.js->getPrefix->Info:%c ret = ' + ret, 'color: #269abc', 'color: auto');
        return ret;
    }

    function xhrRes(xhr, callback, errback) {
        /**
         * handle XMLHttpRequest
         * @xhr XMLHttpRequest
         * @callback,@errback Function
         * return undefined
         */
        console.log('%cBASE.js->xhrRes->Info:', 'color: #269abc');
        console.log('%cXMLHttpRequest.status=%c ' + xhr.status, 'color: #269abc', 'color: auto');
        console.log('%cXMLHttpRequest.responseText=%c ' + xhr.responseText, 'color: #269abc', 'color: auto');
        if (xhr.status >= 200 && xhr.status < 300) {
            execFun(callback, xhr.responseText);
        } else {
            execFun(errback, xhr.status);
        }
    }
    function styleReady(id, cssnum, callback) {
        /**
         * check style load ready
         * @id String
         * @cssnum Number
         * @callback Function
         * return undefined
         */
        cssnum -= 0;
        if (isNaN(cssnum)) {
            console.log('%cBASE.js->styleReady->Error:%c @cssnum must be a Number', 'color: #ac2925', 'color: auto');
            return;
        }

        var startTime = new Date();
        var timeout = 3000;
        var ti = setInterval(function () {
            if (DOC.styleSheets.length > cssnum) {
                if (id) {
                    if (DOC.getElementById(id)) {
                        clearTi();
                    } else {
                        (new Date() - startTime > timeout) && clearTi(1);
                    }
                } else {
                    clearTi();
                }
            } else {
                console.log('%cBASE.js->styleReady->Info:%c loading style...', 'color: #269abc', 'color: auto');
                (new Date() - startTime > timeout) && clearTi(1);
            }
        }, 10);

        function clearTi(bool) {
            clearInterval(ti);
            execFun(callback);
            if (!bool) {
                var str = id ? id : '';
                console.log('%cBASE.js->styleReady->Info:%c style onload!%c ' + str, 'color: #269abc', 'color: auto', 'color: red');
            } else {
                console.log('%cBASE.js->styleReady->Warn:%c load style timeout', 'color: #d58512', 'color: auto');
            }
        }
    }
    function getStorage(item, attr) {
        /**
         * get data from localStorage
         * @item String, record key
         * @attr String, the data obj attribute value
         * return String or Others
         */
        if (!WIN.localStorage) {
            console.log('%cBASE.js->getStorage->Error:%c the browser not support localStorage', 'color: #ac2925', 'color: auto');
            return;
        }
        if (typeof item !== "string") {
            console.log('%cBASE.js->getStorage->Error:%c @item must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        var obj = localStorage.getItem(item);
        if (!obj) {
            console.log('%cBASE.js->getStorage->Warn:%c no record under the item -%c ' + item, 'color: #d58512', 'color: auto', 'color: red');
            return;
        }
        attr && dealItemAttr();
        console.log('%cBASE.js->getStorage->Info:%c ' + item + '=' + obj, 'color: #269abc', 'color: auto');
        return obj;

        function dealItemAttr() {
            obj = jsonParse(obj);
            obj = obj[attr];
        }
    }
    function setStorage(item, strobj) {
        /**
         * set data to localStorage
         * @item String, record key
         * @strobj String,Object or Number
         * return undefined
         */
        if (!WIN.localStorage) {
            console.log('%cBASE.js->setStorage->Error:%c the browser not support localStorage', 'color: #ac2925', 'color: auto');
            return;
        }
        if (typeof item !== "string") {
            console.log('%cBASE.js->setStorage->Error:%c @item must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        if (strobj === undefined || strobj === null || isNaN(strobj)) {
            console.log('%cBASE.js->setStorage->Error:%c @strobj can not be%c ' + strobj, 'color: #ac2925', 'color: auto', 'color:red');
            return;
        }
        if (typeof strobj === "object") {
            strobj = jsonStringify(strobj);
        } else {
            strobj += '';
        }
        if (strobj) {
            localStorage.setItem(item, strobj);
            console.log('%cBASE.js->setStorage->Info:%c ' + item + '=' + strobj, 'color: #269abc', 'color: auto');
        } else {
            console.log('%cBASE.js->setStorage->Warn:%c !!strobj === false', 'color: #d58512', 'color: auto');
        }
    }
    function ajax(options) {
        /**
         * achieve 'ajax' communications
         * @options Object
         * return undefined
         */
        if (!options || typeof options !== "object") {
            console.log('%cBASE.js->ajax->Error:%c @options must be a Object', 'color: #ac2925', 'color: auto');
            return;
        }
        var defaults = {
            url: '', //ajax request url
            data: null, //url parameter, Object
            method: 'GET', //request type
            async: true, //asynchronous request
            send: null, //send data
            timeout: null, //unit ms，synchronous mode is the delay time
            error: null, //communication error callback function
            success: null  //communication success callback function, with callback parameter
        };
        for (var va in options) {
            defaults[va] = options[va];
        }

        var reqUrl = concatUrl(defaults.url, defaults.data);
        var async = defaults.async;
        var method = defaults.method;
        var timeout = defaults.timeout;
        var send = defaults.send;
        var errorFun = defaults.error;
        var successFun = defaults.success;

        var xhr = newXhr();
        var readystatechange = false;
        var timeoutTimer;

        timeout ? dealTimeout() : openAndSend();
        async ? dealAsyncRes() : dealSyncRes();

        return xhr;

        function dealTimeout() {
            async ? dealAsync() : dealSync();

            function dealAsync() {
                timeoutTimer = setTimeout(function () {
                    if (!readystatechange) {
                        console.log('%cBASE.js->ajax->Info:%c fun dealAsync timeout ' + timeout + 'ms', 'color: #269abc', 'color: auto');
                        xhr.onreadystatechange = null;
                        execFun(errorFun, "timeout");
                    }
                    clearTimeout(timeoutTimer);
                }, timeout);
                openAndSend();
            }
            function dealSync() {
                timeoutTimer = setTimeout(function () {
                    console.log('%cBASE.js->ajax->Info:%c fun dealSync delay ' + timeout + 'ms', 'color: #269abc', 'color: auto');
                    openAndSend();
                    xhrRes(xhr, successFun, errorFun);
                    clearTimeout(timeoutTimer);
                }, timeout);
            }
        }
        function openAndSend() {
            console.log('%cBASE.js->ajax->Info:%c openAndSend start open and send', 'color: #269abc', 'color: auto');
            xhr.open(method, reqUrl, async);
            xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            xhr.send(send);
        }
        function dealAsyncRes() {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    readystatechange = true;
                    clearTimeout(timeoutTimer);
                    xhrRes(xhr, successFun, errorFun);
                }
            };
        }
        function dealSyncRes() {
            if (timeout)
                return;
            xhrRes(xhr, successFun, errorFun);
        }
    }
    function txtReader(url, callback, sync) {
        /**
         * reader file as txt
         * @url String
         * @callback Function
         * @sync Boolean
         * return undefined
         */
        if (!url || typeof url !== "string") {
            execFun(callback);
            console.log('%cBASE.js->txtReader->Error:%c @url must be a String', 'color: #ac2925', 'color: auto');
            return;
        }

        var async = sync ? false : true;  //default async

        var xhr = newXhr();
        xhr.open('GET', url, async);
        xhr.send();

        if (async) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    dealRes();
                }
            };
        } else {
            dealRes();
        }

        function dealRes() {
            xhrRes(xhr, callback, function (status) {
                execFun(callback);
                console.log('%cBASE.js->txtReader->Error:%c read file error ' + status, 'color: #ac2925', 'color: auto');
            });
        }
    }
    function jsReader(url, id, callback) {
        /**
         * reader js >ie8
         * @url String
         * @id String, tag id
         * @callback Function, load js finish to call
         * return undefined
         */
        if (!url || typeof url !== "string") {
            execFun(callback);
            console.log('%cBASE.js->jsReader->Error:%c @url must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        if (id && DOC.getElementById(id)) {
            execFun(callback);
            console.log('%cBASE.js->jsReader->Warn:%c @id script tag already exit -%c ' + id, 'color: #d58512', 'color: auto', 'color: red');
            return;
        }

        createScript();

        function createScript() {
            var body = DOC.body;
            var script = DOC.createElement('script');
            id && (script.id = id);
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.src = url;
            body.appendChild(script);

            script.onload = function () {
                execFun(callback);
                var str = id ? id : '';
                console.log('%cBASE.js->jsReader->Info:%c js onload!%c ' + str, 'color: #269abc', 'color: auto', 'color: red');
            };
        }
    }
    function cssReader(url, id, callback) {
        /**
         * reader css
         * @url String
         * @id String, tag id
         * @callback Function, load css finish to call
         * return undefined
         */
        if (!url || typeof url !== "string") {
            execFun(callback);
            console.log('%cBASE.js->cssReader->Error:%c @url must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        if (id && DOC.getElementById(id)) {
            execFun(callback);
            console.log('%cBASE.js->cssReader->Warn:%c @id link tag already exit -%c ' + id, 'color: #d58512', 'color: auto', 'color: red');
            return;
        }

        linkCss();

        function linkCss() {
            var head = DOC.getElementsByTagName('head')[0];
            var cssnum = DOC.styleSheets.length;

            var link = DOC.createElement('link');
            id && (link.id = id);
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            head.appendChild(link);

            styleReady(id, cssnum, callback);
        }
    }
    function createStyle(styleStr, id, callback) {
        /**
         * create css style tag
         * @styleStr String, css style
         * @id String, style tag id
         * @callback Function, style ready to call
         * return undefined
         */
        if (!styleStr || typeof styleStr !== "string") {
            execFun(callback);
            console.log('%cBASE.js->createStyle->Error:%c @styleStr must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        if (id && DOC.getElementById(id)) {
            execFun(callback);
            console.log('%cBASE.js->createStyle->Warn:%c @id style tag already exit -%c ' + id, 'color: #d58512', 'color: auto', 'color: red');
            return;
        }
        var head = DOC.getElementsByTagName('head')[0];
        var cssnum = DOC.styleSheets.length;
        var tag = DOC.createElement("style");
        tag.type = 'text/css';
        id && (tag.id = id);
        try {
            tag.appendChild(DOC.createTextNode(styleStr));
        } catch (e) {
            tag.styleSheet.cssText = styleStr;
        }
        head.appendChild(tag);

        styleReady(id, cssnum, callback);
    }
    function adpAllStyle(styleStr, id, callback, adp, isHeight) {
        /**
         * create css style and change px to px*scale
         * @styleStr String, css style
         * @id String, style tag id
         * @callback Function, style ready to call
         * @adp Number, standard adp scale, default is 480(w) or 700(h)
         * @isHeight Boolean, adp according to innerHeight
         * return undefined
         */
        if (!styleStr || typeof styleStr !== "string") {
            execFun(callback);
            console.log('%cBASE.js->adpAllStyle->Error:%c @styleStr must be a String', 'color: #ac2925', 'color: auto');
            return;
        }
        isNaN(adp - 0) && (isHeight ? adp = 700 : adp = 480);
        var adpAry = [320, 360, 480, 540, 640, 720, 768, 800, 1080];
        isHeight && (adpAry = [300, 400, 450, 500, 600, 650, 700, 750, 800, 900]);
        globalAdp(dealNewSize);

        function globalAdp(callback) {
            var newStyleStr = '';
            for (var i = 0; i < adpAry.length; i++)
                deal(i);
            createStyle(newStyleStr, id, callback);

            function deal(i) {
                var str = getStyleStr(styleStr, adpAry[i], adp);
                newStyleStr += (isHeight ? '@media(min-height:' : '@media(min-width:') + (adpAry[i] - 1) + 'px){' + str + '}';
            }
        }
        function isNewSize() {
            var size = isHeight ? WIN.innerHeight : WIN.innerWidth;
            for (var i = 0; i < adpAry.length; i++) {
                if (size === adpAry[i])
                    return;
            }
            return size;
        }
        function dealNewSize() {
            var size = isNewSize();
            if (!size) {
                execFun(callback);
                return listenResize();
            }
            todo(size, function () {
                execFun(callback);
                listenResize();
            });

            function listenResize() {
                WIN[addEventListener]('resize', function () {
                    var size = isNewSize();
                    size && todo(size);
                });
            }
        }
        function todo(size, callback) {
            var newId = (id ? id : 'css') + '-' + size;
            if (DOC.getElementById(newId))
                return execFun(callback);
            var str = getStyleStr(styleStr, size, adp);
            var newStyleStr = (isHeight ? '@media(height:' : '@media(width:') + size + 'px){' + str + '}';
            createStyle(newStyleStr, newId, callback);
        }
        function getStyleStr(styleStr, nowSize, adpSize) {
            var str = styleStr.replace(/-?\d+\.?\d*px/g, function (e) {
                var num = parseFloat(e);
                if (num === 1 || num === -1 || num === 0)
                    return num + 'px';
                var a = num * nowSize / adpSize;
                if (a > 0 && a < 1) {
                    a = 1;
                } else if (a > -1 && a < 0) {
                    a = -1;
                }
                return a + "px";
            });
            return str;
        }
    }

    /*========== Private API ==========*/

    WIN && typeof WIN === 'object' && (WIN.BASE = P);
    return P;
}));