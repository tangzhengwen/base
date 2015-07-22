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
### BASE.getUrl(url, ignore)
* get the value of attr from URL search, e.g. `?a=1&b=123`
* `url` String
* `ignore` Boolean, ignore case
* return String, e.g. `BASE.getUrl('b') === '123'`

### BASE.concatUrl(url, obj)
* concat url
* `url` String
* `obj` Object
* return String, e.g. `?a=1&b=123`

### BASE.extendObj(srcObj, tarObj, bool, subExtend)
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

### BASE.strCompare(aStr, bStr, splitDot)
* string compare
* `bStr`,`aStr`,`splitDot` String
* `aStr > bStr` return 1
* `aStr < bStr` return -1
* `aStr == bStr` return 0
* 2.0.123 > 2.0.1221.5

### BASE.dataRound(val, bit)
* numerical precision control
* `val` Number or String, e.g. 123 or '123'
* `bit` Number, precision, default is 0
* return Number, e.g. `BASE.dataRound('123.25', 1) === '123.3'`

### BASE.getCoord(e, c)
* get event targe coord
* `e` Event
* `c` String, 'Y' or 'X'(default)
* return Number




# License
[MIT](https://github.com/tangzhengwen/base/blob/master/LICENSE)
