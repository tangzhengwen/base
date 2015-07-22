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
    get the value of attr from URL search, e.g. **?a="1"&b="123"**
    `@url` String
    
    `@ignore` Boolean, ignore case
    
    return String, e.g. `BASE.getUrl('b') === '123'`

# License
[MIT](https://github.com/tangzhengwen/base/blob/master/LICENSE)
