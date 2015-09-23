# base v2.5.1
reengineering wheel

something like jQuery

**small**

# Getting Started
1. include `base.js`

    ```javascript
    <script src="base.js" type="text/javascript" charset="utf-8"></script>
    ```
2. the global variables `BASE` can be use

# API
### BASE.getUrl(url, _ignore_)
* get the value of attr from URL search, e.g. `?a=1&b=123`
* `url` String
* `ignore` Boolean, ignore case
* return String, e.g. `BASE.getUrl('b') === '123'`

### BASE.concatUrl(url, obj)
* concat url
* `url` String
* `obj` Object
* return String, e.g. `url?a=1&b=123`

### BASE.extendObj(srcObj, tarObj, _bool_, _subExtend_)
* extend the source obj according to the target obj
* `srcObj`,`tarObj` Object
* `bool` Boolean, true tar is srcObj else is tarObj
* `subExtend` Boolean, extend sub obj
* return undefined

### BASE.jsonParse(txt)
* try to catch JOSN parse error
* `txt` String
* return Object

### BASE.jsonStringify(obj)
* try to catch JOSN stringify error
* `obj` Object
* return String

### BASE.strCompare(aStr, bStr, _splitDot_)
* string compare
* `aStr`,`bStr` String
* `splitDot` String, default is **'.'**
* `aStr > bStr` return 1
* `aStr < bStr` return -1
* `aStr == bStr` return 0
* 2.0.123 > 2.0.1221.5

### BASE.dataRound(val, _bit_)
* numerical precision control
* `val` Number or String, e.g. 123 or '123'
* `bit` Number, precision, default is **0**
* return Number, e.g. `BASE.dataRound('123.25', 1) === 123.3`

### BASE.getCoord(e, _c_)
* get event targe coord
* `e` Event
* `c` String, **'Y'** or **'X'**(default)
* return Number

### BASE.getEle(str)
* get DOM Element
* `str` String, '#id', '.class', 'tag'
* return Element(#id) or Array Elements(.class tag)

### BASE.creEle(_tag_, _parEle_, _id_, _cls_)
* create DOM Element
* `tag` String, default is **'div'**
* `parEle` Element, parent node
* `id`,`cls` String
* return Element

### BASE.txtEle(ele, _str_)
* text str to Element
* `ele` Element
* `str` String or Number, empty mean clear
* return undefined

### BASE.disEle(ele, _opt_)
* haddle DOM Element hide and show
* `ele` Element
* `opt` Boolean or String

    ```javascript
    if (opt === 'display') {
        return ele.style.display;
    }
    if (opt) {
        ele.style.display = (typeof opt === 'string') ? opt : 'block';
    } else {
        ele.style.display = 'none';
    }
    ```

### BASE.rmvEle(ele, _isSelf_)
* remove DOM Element
* `ele` Element
* `isSelf` Boolean, true remove ele self, false remove ele children
* return undefined

### BASE.parEle(tarElement, parElement)
* determine whether `parElement` is `tarElement`'s parent element
* `tarElement`,`parElement` Element
* return Boolean

### BASE.dealCls(ele, cls, _opt_)
* add cls or delete cls for ele
* `ele` Element
* `cls` String
* `opt` String, **'add'**|**'del'**|**'has'**(default)
* return Boolean or undefined

### BASE.execFun(callback, _arg1_, _arg2_)
* if callback is function then execute it
* `callback` Function
* return callback(arg1, arg2)

### BASE.getPrefix(str)
* get css3 prefix str
* `str` String, e.g. `transition`, `transform`
* return String, e.g. `webkitTransition`

### BASE.getStorage(item, _attr_)
* get data from localStorage
* `item` String, record key
* `attr` String, the data obj attribute value
* return String or Others

### BASE.setStorage(item, strobj)
* set data to localStorage
* `item` String, record key
* `strobj` String, Object or Number
* return undefined

### BASE.newXhr()
* return XMLHttpRequest

### BASE.xhrRes(xhr, callback, errback)
* handle XMLHttpRequest
* `xhr` XMLHttpRequest
* `callback`,`errback` Function
* return undefined

### BASE.ajax(options)
* achieve 'ajax' communications
* `options` Object
* return undefined

    ```javascript
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
    ```

### BASE.styleReady(id, cssnum, callback)
* check style load ready
* `id` String
* `cssnum` Number
* `callback` Function
* return undefined

### BASE.txtReader(url, callback, _sync_)
* reader file as txt
* `url` String
* `callback` Function
* `sync` Boolean
* return undefined

### BASE.jsReader(url, _id_, _callback_)
* reader js >ie8
* `url` String
* `id` String, tag id
* `callback` Function, load js finish to call
* return undefined

### BASE.cssReader(url, _id_, _callback_)
* reader css
* `url` String
* `id` String, tag id
* `callback` Function, load js finish to call
* return undefined

### BASE.createStyle(styleStr, _id_, _callback_)
* create css style tag
* `styleStr` String, css style
* `id` String, style tag id
* `callback` Function, style ready to call
* return undefined

### BASE.adpAllStyle(styleStr, _id_, _callback_, _adp_, _isHeight_)
* create css style and change px to px*scale
* `styleStr` String, css style
* `id` String, style tag id
* `callback` Function, style ready to call
* `adp` Number, standard adp scale, default is **480**(w) or **700**(h)
* `isHeight` Boolean, adp according to innerHeight
* return undefined

# License
[MIT](https://github.com/tangzhengwen/base/blob/master/LICENSE)
