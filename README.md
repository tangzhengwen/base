# base
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
* return String, e.g. `?a=1&b=123`

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
* `bStr`,`aStr` String
* `splitDot` String, default is **'.'**
* `aStr > bStr` return 1
* `aStr < bStr` return -1
* `aStr == bStr` return 0
* 2.0.123 > 2.0.1221.5

### BASE.dataRound(val, _bit_)
* numerical precision control
* `val` Number or String, e.g. 123 or '123'
* `bit` Number, precision, default is **0**
* return Number, e.g. `BASE.dataRound('123.25', 1) === '123.3'`

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

### BASE.parEle(tarEle, parEle)
* determine whether `parEle` is `tarEle`'s parent element
* `tarEle`,`parEle` Element
* return Boolean

### BASE.dealCls(ele, cls, _opt_)
* add cls or delete cls for ele
* `ele` Element
* `cls` String
* `opt` String, **add**|**del**|**has**(default)
* return Boolean or undefined







# License
[MIT](https://github.com/tangzhengwen/base/blob/master/LICENSE)
