/*
* the initail const
* @Author:      dingyantao
* @CreateDate:  2013-8-22
*/
; (function ($, undefined) {
    $.extend({
        /**
        * @cfg {string} keyboard
        */
        KEY_ESC: 27,
        KEY_F1: 112,
        KEY_F2: 113,
        KEY_F3: 114,
        KEY_F4: 115,
        KEY_F5: 116,
        KEY_F6: 117,
        KEY_F7: 118,
        KEY_F8: 119,
        KEY_F9: 120,
        KEY_F10: 121,
        KEY_F11: 122,
        KEY_F12: 123,
        KEY_UP: 38,
        KEY_DOWN: 40,
        KEY_LEFT: 37,
        KEY_RIGHT: 39,
        KEY_ENTER: 13,
        KEY_SPACE: 32,
        KEY_TAB: 9,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_BACKSPACE: 8,
        template: {
            /**
             * [replace 模板引擎]
             * @param  {[String]} pTemplate
             * @param  {[Object]} pData
             * @return {[String]}
             */
            replace: function (pTemplate, pData) {
                var cache = {};
                var t = parse(pTemplate);
                if (t) {
                    //try {
                    return t(pData);
                    /*} catch (e) {
                    $.error("TRplace Error:data error");
                    return "";
                    }*/
                } else {
                    return "";
                }
                function parse(pTemplate) {
                    if (!cache[pTemplate]) {
                        var __list__ = [];
                        //try {
                        cache[pTemplate] = eval("(function(){return function(GlobalData){var __result__ = [];" + ("$>" + pTemplate + "<$").replace(/<\$= ([\s\S]*?) \$>/g, function (a, b) {
                            return "<$ __result__.push(" + b + "); $>";
                        }).replace(/\$>([\s\S]*?)<\$/g, function (a, b) {
                            if (/^\s*$/.test(b))
                                return "";
                            else
                                return "__result__.push(__list__[" + (__list__.push(b) - 1) + "]);";
                        }) + "return __result__.join('');}})()");
                        //} catch (e) {
                        //    $.error("TRplace Error:template error");
                        //}
                    }
                    return cache[pTemplate];
                }
            },
            /**
             * [render 简单模板]
             * @param  {[String]} pTemplate
             * @param  {[Object]} pData
             * @return {[String]}
             */
            render: function (pTemplate, pData) {
                var _html = pTemplate;
                return _html.replace(/\$\{.*?\}/g, function (a, b) {
                    var _key = a.replace(/\$|\{|\}/g, "");
                    return pData.hasOwnProperty(_key) ? pData[_key] : a;
                });
            }
        },Storage: new function () {
            var _canuse = !!window.sessionStorage,
                hasData = function (pData) {
                    return pData && pData !== "" && pData !== "null" && pData !== "undefined";
                },
            /*
            * get data from ajax
            */           
                ajaxData = function (pKey, pUrl, pArg, pCallBack, pIsLoacl, pCharset) {
                    var me = this;
                    $.post(pUrl, pArg, function (data) {
                        dealData.call(me, data, pKey, pCallBack, pIsLoacl);
                    });
                },
            /*
            * get .js document which isnot UTF-8 encoding,the return data should be place into
            */
                jsonPData = function (pKey, pUrl, pArg, pCallBack, pIsLoacl, pCharset) {
                    var me = this,
                        _url = (pArg != null && pArg != "") ? pUrl + "?" + pArg : pUrl;
                    $.Load.addJs(_url, function () {

                        dealData.call(me, data, pKey, pCallBack, pIsLoacl);
                    }, true, pCharset);
                },
                sessionData = function (pKey, pUrl, pArg, pCallBack, pFunc, pCharset) {
                    var data = sessionStorage.getItem(pKey);
                    if (hasData(data)) {
                        dealData(data, pKey, pCallBack, false);
                    } else {
                        pFunc(pKey, pUrl, pArg, pCallBack, false, pCharset);
                    }
                },
                localData = function (pKey, pUrl, pArg, pCallBack, pFunc, pCharset) {
                    var data = localStorage.getItem(pKey);
                    if (hasData(data)) {
                        dealData(data, pKey, pCallBack, true);
                    } else {
                        pFunc(pKey, pUrl, pArg, pCallBack, true, pCharset);
                    }
                },
                dealData = function (data, pKey, pCallBack, pIsLoacl) {
                    _canuse && pIsLoacl && localStorage.setItem(pKey, data);
                    _canuse && !pIsLoacl && sessionStorage.setItem(pKey, data);
                    pCallBack(data);
                };
            /*
            *  get session storge,if not exist ,get data from the server
            *  @param  {string}            the hash key name of the data
            *  @param  {string}            the url where to get data from
            *  @param  {string}            the arguments used in the request
            *  @param  {function|null}     the callback function
            *  @param  {boolen|null}       if use jsonp
            */
            this.getSession = function (pKey, pUrl, pArg, pCallBack, pIsJsonP, pCharset) {
                var _funcPoint = pIsJsonP ? jsonPData : ajaxData;
                if (_canuse) {
                    sessionData(pKey, pUrl, pArg, pCallBack, _funcPoint, pCharset);
                } else {
                    _funcPoint(pKey, pUrl, pArg, pCallBack, false, pCharset);
                }
            };
            /*
            *  get local storge,if not exist ,get data from the server
            *  @param  {string}            the hash key name of the data
            *  @param  {string}            the url where to get data from
            *  @param  {string}            the arguments used in the request
            *  @param  {function|null}     the callback function
            *  @param  {boolen|null}       if use jsonp
            */
            this.getLocal = function (pKey, pUrl, pArg, pCallBack, pIsJsonP, pCharset) {
                var _funcPoint = pIsJsonP ? jsonPData : ajaxData;
                if (_canuse) {
                    localData(pKey, pUrl, pArg, pCallBack, _funcPoint, pCharset);
                } else {
                    _funcPoint(pKey, pUrl, pArg, pCallBack, true, pCharset);
                }
            };
        },jsonToString:function(object) {//json转换string
            if(!$$.browser.IsIE) return JSON.stringify(object);
            var type = $.type(object);
            if ('object' == type) {
                if (Array == object.constructor) type = 'array';
                else if (RegExp == object.constructor) type = 'regexp';
                else type = 'object';
            }
            switch (type) {
                case 'undefined':
                case 'unknown':
                    return;
                    break;
                case 'function':
                case 'boolean':
                case 'regexp':
                    return object.toString();
                    break;
                case 'number':
                    return isFinite(object) ? object.toString() : 'null';
                    break;
                case 'string':
                    return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function() {
                        var a = arguments[0];
                        return (a == '\n') ? '\\n': (a == '\r') ? '\\r': (a == '\t') ? '\\t': ""
                    }) + '"';
                    break;
                case 'object':
                    if (object === null) return 'null';
                    var results = [];
                    for (var property in object) {
                        var value = jQuery.jsonToString(object[property]);
                        if (value !== undefined) results.push(jQuery.jsonToString(property) + ':' + value);
                    }
                    return '{' + results.join(',') + '}';
                    break;
                case 'array':
                    var results = [];
                    for (var i = 0; i < object.length; i++) {
                        var value = jQuery.jsonToString(object[i]);
                        if (value !== undefined) results.push(value);
                    }
                    return '[' + results.join(',') + ']';
                    break;
            }
        }
    });    
    $.fn.extend({        
        /**
        * ie6浮出层遮罩
        */
        cover: function () {
            if ($$.browser.IsIE6) {
                var _obj = this[0];
                if (!_obj) return jQuery.error("cover", "the dom is empty");
                var _data = {},
                    _offset = this.offset(),
                    _pOffset = this.offsetParent().offset(),
                    _zIndex = this.css("zIndex"),
                    _iframe = document.createElement("iframe");
                _iframe.frameBorder = 0;
                _iframe.style.cssText = "background:#FFF;position:absolute;left:" + (_offset.left - _pOffset.left) + "px;"
                    + "top:" + (_offset.top - _pOffset.top) + "px;"
                    + "width:" + _obj.offsetWidth + "px;"
                    + "height:" + _obj.offsetHeight + "px;"
                    + "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);"
                    + "opacity:0;" +
                    (
                        (isNaN(_zIndex) ? "" : "z-index:" + (parseInt(_zIndex, 10) - 1))
                    );
                jQuery(_iframe).insertBefore(_obj);
                _data.cover = _iframe;
                this.data("__cover__", _data);
                return this;
            }
        },
        /**
        * remove cover
        */
        uncover: function () {
            if (!this[0]) return;
            var _data = this.data("__cover__");
            _data && (jQuery(_data.cover).remove(), this.removeData("__cover__"));
        },
        /*
        * dom mask     $(dom).mask()
        * @param  {bool}   pFlag  不传或者false定位在浏览器中间，true不改变自身原来位置
        */
        mask: function (pFlag) {
            var _target = this[0], _left, _top;
            if (!_target) return $.error("mask", "the Dom object is empty"), this;
            this.unmask();
            var _maskObject = {};
            _maskObject.cssText = _target.style.cssText;
            _maskObject.nextSibling = _target.nextSibling;
            _maskObject.parentNode = _target.parentNode;
            _target.style.display = "block";
            if (pFlag) {
                _left = $(_target).offset().left, _top = $(_target).offset().top;
                $$.container.append(_target);
                _target.style.left = _left + "px";
                _target.style.top = _top + "px";
            } else {
                _target.style.left = document.documentElement.scrollLeft + document.body.scrollLeft + Math.max(0, (document.documentElement.clientWidth - _target.offsetWidth) / 2) + "px";
                _target.style.top = Math.max(document.documentElement.scrollTop,document.body.scrollTop) + Math.max(0, (document.documentElement.clientHeight - _target.offsetHeight) / 2) + "px";
                $$.container.append(_target);
            }
            _target.style.position = "absolute";
            var c = "background:#000;position:absolute;left:0;top:0;width:" + Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth, document.body.clientWidth, document.body.scrollWidth) + "px;height:" + Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight) + "px;";
            _maskObject.maskDiv = document.createElement("div");
            _maskObject.maskDiv.style.cssText = c + "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);opacity:0.5;";
            $(_maskObject.maskDiv).insertBefore(_target);
            $$.browser.IsIE && (_maskObject.maskIframe = document.createElement("iframe"),
                _maskObject.maskIframe.style.cssText = c + "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);opacity:0;",
                $(_maskObject.maskIframe).insertBefore(_maskObject.maskDiv));
            this.data("__mask__", _maskObject); return this;
        },
        unmask: function () {
            if (!this[0]) return $.error("unmask", "the Dom object is empty"), this;
            var _maskObject = this.data("__mask__");
            if (_maskObject) {
                this[0].style.cssText = _maskObject.cssText;
                (_maskObject.nextSibling ? this.first().insertBefore(_maskObject.nextSibling) : this.first().appendTo(_maskObject.parentNode));
                $(_maskObject.maskDiv).remove();
                if (_maskObject.maskIframe) {
                    $(_maskObject.maskIframe).remove();
                    this.removeData("__mask__")
                };
            };
        }
    });
    var $$ = {};
    /**
    * browser internal
    * @cfg {Array} [IsChrome,IsFirefox,IsOpera,IsSafari,IsIE,IsIE6,IsIpad]  返回浏览器bool
    */
    $$.browser = new function () {
        var _regConfig = {
            Chrome: {
                Reg: /.*(chrome)\/([\w.]+).*/,
                Core: "Webkit"
            },
            Firefox: {
                Reg: /.*(firefox)\/([\w.]+).*/,
                Core: "Moz"
            },
            Opera: {
                Reg: /(opera).+version\/([\w.]+)/,
                Core: "O"
            },
            Safari: {
                Reg: /.*version\/([\w.]+).*(safari).*/,
                Core: "Webkit"
            },
            Ie: {
                Reg: /.*(msie) ([\w.]+).*/,
                Core: "Ms"
            }
        },
        _userAgent = navigator.userAgent.toLowerCase();
        this.getDetail = function () {
            for (var _o in _regConfig) {
                var _result = _regConfig[_o].Reg.exec(_userAgent);
                if (_result != null) {
                    return { Browser: _result[1] || "", Version: _result[2] || "0", Core: _regConfig[_o].Core };
                }
            }
            return { Browser: "UNKNOWN", Version: "UNKNOWN", Core: "UNKNOWN" };
        };
        this.Detail = this.getDetail();
        this.IsChrome = _regConfig.Chrome.Reg.test(_userAgent);
        this.IsFirefox = _regConfig.Firefox.Reg.test(_userAgent);
        this.IsOpera = _regConfig.Opera.Reg.test(_userAgent);
        this.IsSafari = _regConfig.Safari.Reg.test(_userAgent);
        this.IsIE = !!window.ActiveXObject || "ActiveXObject" in window;
        this.IsIE6 = /msie 6.0/.test(_userAgent);
        this.IsIE10 = /msie 10.0/.test(_userAgent);
        this.IsIpad = (/ipad/).test(_userAgent);
    };
    (function () {
        var _container = document.createElement('container');
        _container.style.cssText = "position:absolute;top:0px;left:0px;width:0px;height:0px;z-index:99999;";
        var _body = document.body;
        _body || document.write('<span id="__body__" style="display:none;">dyTao</span>');
        ((_body = document.body.firstChild) ? document.body.insertBefore(_container, _body) : document.body.appendChild(_container));
        (_body = document.getElementById("__body__")) && _body.parentNode.removeChild(_body);
        /**
        * container initail
        * 浏览器通用容器 适用场景为需要浮出层的dom
        */
        $$.container = $(_container);
    })();
    $$.cookie = function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
    var _load = new function () {
        //variable
        var _jCookie = $$.cookie("privateJs") || "",
        //cookieValue
            _jCookieArray = _jCookie.split(","),
        //is debug
            _isDebug = _jCookieArray.length > 1,
        //addList use
            _toDo = 0;
        this.ReleaseNo = undefined;
        this.MergeUrl = undefined;
        //write
        this.IsCreateMerge = false;
        //read
        this.IsLoadMerge = false;
        //method
        var addItem = function (pObj, pIndex) {
            var me = this,
                    _self = arguments.callee;
            if (pIndex < pObj.length) {
                var _obj = pObj[pIndex];
                if (Object.prototype.toString.call(_obj) === '[object Array]') {
                    var l = _toDo = _obj.length;
                    for (var i = 0; i < l; i++) {
                        me.addJs.call(me, _obj[i], function (pObj, pIndex) {
                            _toDo--;
                            if (_toDo === 0) {
                                _self.call(me, pObj, pIndex + 1);
                            }
                        }, pObj, pIndex);
                    }
                } else if (typeof _obj === "string") {
                    me.addJs.call(me, _obj, function () {
                        _self.call(me, pObj, pIndex + 1);
                    });
                } else {
                    _self.call(me, pObj, pIndex + 1);
                }
            }
        },
            createMerge = function (pSrcList) {
                var _arr = [];
                for (var i = 0; i < pSrcList.length; i++) {
                    _arr = _arr.concat(pSrcList[i]);
                }
                var _source = _arr.join(","),
                    _ajaxUrl = "http://localhost/webresource/MergeHandler.ashx",
                    _ajaxParam = ["newFile=", this.MergeUrl, "&source=", _source].join("");
                $.ajax(_ajaxUrl, _ajaxParam, function (data) {

                });
            },
            config = function () {
                var _temp = $$.cookie("MergeUrl");
                if (_temp) {
                    this.MergeUrl = _temp;
                    this.IsLoadMerge = true;
                }
            };
        //$.load.addList(["/r1.js","/r2.js","/ir3.js"],"/ir3.js","/ir3.js");
        this.addList = function () {
            var me = this;
            if (this.IsLoadMerge && this.MergeUrl !== undefined) {
                this.addJs.call(me, this.MergeUrl);
            } else {
                var _srcs = Array.prototype.slice.call(arguments);
                addItem.call(this, _srcs, 0);
                if (this.MergeUrl !== undefined && this.IsCreateMerge) {
                    createMerge.call(me, _srcs);
                }
            }
        };

        /*
        * get javascripts from a merge page     $.load.mergeJs("/r1.js,/r2.js,r3.js","merge.js?src=");
        * @param  {string}         srcs
        * @param  {string}         mergePage
        * @param  {function|null}  callback function,arguments followed
        */
        this.mergeJs = function (pSrcs, pMergeUrl, callBack) {
            var _arguments = Array.prototype.slice.call(arguments, 3),
                me = this;
            this.addJs.call(me, pMergeUrl + pSrcs, callBack, _arguments)
        };

        /*
        * add one javascript
        * @param    {string}      src
        * @param    {object|null} callback function,arguments followed
        * @param    {boolen}      not use releaseNo
        */
        this.addJs = function (osrc, callBack, isJsonP, pCharset) {
            var js = document.createElement("script"),
            _arguments = Array.prototype.slice.call(arguments, 2);
            if (_isDebug) {
                osrc = osrc.replace(_jCookieArray[0], _jCookieArray[1]);
            }
            js.charset = pCharset || "UTF-8";
            js.src = (this.ReleaseNo === undefined || isJsonP) ? osrc : osrc + "?releaseno=" + this.ReleaseNo;
            js.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(js);
            js.onload = js.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    if (callBack != null) {
                        callBack.apply(this, _arguments)
                    }
                    js.onload = js.onreadystatechange = null;
                }
            };
        };
        config();
    }
    var Base = (function () {
        var b = {};
        //回调
        b.Callbacks = (function () {
            var flagsCache = {},
                createFlags = function (flags) {
                    var object = flagsCache[flags] = {},
                        i, length;
                    flags = flags.split(/\s+/);
                    for (i = 0, length = flags.length; i < length; i++) {
                        object[flags[i]] = true;
                    }
                    return object;
                },
                handle = 1,
                Callbacks = function (flags) {
                    $.extend(true,this, {
                        flags: flags ? (flagsCache[flags] || createFlags(flags)) : {},
                        list: [],
                        stack: [],
                        /*memory: undefinde,
                        firing: undefinde,
                        firingStart: undefinde,
                        firingLength: undefinde,
                        firingIndex: undefinde,*/
                        needSort: false
                    });
                };
            Callbacks.prototype = {
                //排序
                sort: function () {
                    this.list.sort(function (a, b) {
                        return b[1] - a[1];
                    });
                },
                //添加
                add: function (fn, level) {
                    level = level || 0;
                    var list = this.list,
                        flags = this.flags,
                        target;
                    if (list && (!flags.unique || !(target = this.has(fn)))) {
                        handle++;
                        if (this.firing) {
                            var i = this.firingIndex + 1;
                            for (; i < this.firingLength; i++) {
                                if (level > list[i][1]) {
                                    break;
                                }
                            }
                            list.splice(i, 0, [fn, level, handle]);
                            this.firingLength++;
                            if (level > list[this.firingIndex][1])
                                this.needSort = true;
                        } else {
                            var length = list.length;
                            list.push([fn, level, handle]);
                            if (this.memory && this.memory !== true) {
                                if (length > 0 && level > list[length - 1][1])
                                    this.needSort = true;
                                this.firingStart = length;
                                this._fire(this.memory[0], this.memory[1]);
                            } else {
                                this.sort();
                            }
                        }
                        return handle;
                    } else if (target) {
                        return target[2];
                    }
                    return -1;
                },
                _remove: function (index) {
                    if (this.firing) {
                        if (index <= this.firingLength) {
                            this.firingLength--;
                            if (index <= this.firingIndex) {
                                this.firingIndex--;
                            }
                        }
                    }
                    this.list.splice(index, 1);
                },
                remove: function (target) {
                    var list = this.list,
                        flags = this.flags;
                    if (list) {
                        var type = typeof target,
                            i = 0,
                            l = list.length;
                        if (type === "function") {
                            for (; i < l; i++) {
                                if (list[i][0] === target) {
                                    this._remove(i);
                                    i--;
                                    l--;
                                    if (flags.unique) {
                                        break;
                                    }
                                }
                            }
                        } else if (type === "number") {
                            for (; i < l; i++) {
                                if (list[i][2] === target) {
                                    this._remove(i);
                                    i--;
                                    l--;
                                    if (flags.unique) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    return this;
                },
                has: function (target) {
                    var list = this.list;
                    if (list) {
                        var i = 0,
                            length = list.length,
                            type = typeof target;
                        if (type === "function") {
                            for (; i < length; i++) {
                                if (target === list[i][0]) {
                                    return list[i];
                                }
                            }
                        } else if (type === "number") {
                            for (; i < length; i++) {
                                if (target === list[i][2]) {
                                    return list[i];
                                }
                            }
                        }
                    }
                    return false;
                },
                _fire: function (context, args) {
                    args = args || [];
                    var flags = this.flags,
                        list = this.list;
                    this.memory = !flags.memory || [context, args];
                    this.firing = true;
                    this.firingIndex = this.firingStart || 0;
                    this.firingStart = 0;
                    this.firingLength = list.length;
                    for (; list && this.firingIndex < this.firingLength; this.firingIndex++) {
                        if (list[this.firingIndex][0].apply(context, args) === false && flags.stopOnFalse) {
                            this.memory = true;
                            break;
                        }
                    }
                    this.firing = false;
                    if (list) {
                        if (!flags.once) {
                            if (this.needSort) {
                                this.sort();
                                this.needSort = false;
                            }
                            if (this.stack && this.stack.length) {
                                this.memory = this.stack.shift();
                                this.fire(memory[0], memory[1]);
                            }
                        } else if (this.memory === true) {
                            this.disable();
                        } else {
                            this.empty();
                        }
                    }
                },
                fire: function (context, args) {
                    if (this.stack) {
                        if (this.firing) {
                            if (!this.flags.once) {
                                this.stack.push([context, args]);
                            }
                        } else if (!(this.flags.once && this.memory)) {
                            this._fire(context, args);
                        }
                    }
                },
                empty: function () {
                    this.list = [];
                },
                disable: function () {
                    this.list = this.stack = this.memory = undefined;
                },
                disabled: function () {
                    return !this.list;
                }
            };
            return Callbacks;
        })();
        /**
        * 简单基类
        */
        b.Core = (function () {
            var initializing = false,
                fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

            var Class = function () { };
            //类扩展
            Class.extend = function (prop) {
                var _super = this.prototype;

                initializing = true;
                var prototype = new this();
                initializing = false;

                for (var name in prop) {
                    prototype[name] = typeof prop[name] === "function" &&
                    typeof _super[name] === "function" && fnTest.test(prop[name]) ?
                    (function (name, fn) {
                        return function () {
                            var tmp = this._super;
                            this._super = _super[name];
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) : prop[name];
                }

                function Class() {
                    if (!initializing && this.init) {
                        var result = this.init.apply(this, arguments);
                        if (typeof result !== "undefined")
                            return result;
                    }
                }

                Class.prototype = prototype;
                Class.constructor = Class;
                Class.extend = arguments.callee;

                return Class;
            };

            return Class;
        })();
        /**
        * 自定义事件类
        */
        b.Event = (function (Callbacks) {
            return b.Core.extend({
                newEvent: function (eventName, config) {
                    if (!this.eventHandle)
                        this.eventHandle = {};
                    if (!this.events)
                        this.events = {};
                    //if(!this.events[eventName])
                    this.events[eventName] = new Callbacks(config);
                },
                addEvent: function (eventName, fn, level) {
                    if (this.events && this.events[eventName]) {
                        var handle = this.events[eventName].add(fn, level);
                        this.eventHandle[handle] = eventName;
                        return handle;
                    }
                    return -1;
                },
                removeEvent: function () {
                    if (!this.events)
                        return false;
                    var eventName, handle, fn;
                    if (typeof arguments[0] === "number") {
                        handle = arguments[0];
                        eventName = this.eventHandle[handle];
                        if (this.events[eventName])
                            this.events[eventName].remove(handle);
                    }
                    else if (typeof arguments[0] === "string" && typeof arguments[1] === "function") {
                        eventName = arguments[0];
                        fn = arguments[1];
                        if (this.events[eventName])
                            this.events[eventName].remove(fn);
                    }
                    else if (typeof arguments[0] === "string" && typeof arguments[1] === "number") {
                        eventName = arguments[0];
                        handle = arguments[1];
                        if (this.events[eventName])
                            this.events[eventName].remove(handle);
                    }
                    else if (typeof arguments[0] === "string" && typeof arguments[1] === "undefined") {
                        eventName = arguments[0];
                        if (this.events[eventName])
                            this.events[eventName].empty();
                    }
                    else if (typeof arguments[0] === "undefined") {
                        this.events = {};
                    }
                    return false;
                },
                unEvent: function (eventName) {
                    if (typeof eventName === "string") {
                        if (this.events[eventName])
                            this.events[eventName].disable();
                    } else {
                        for (eventName in this.events)
                            this.events[eventName].disable();
                    }
                },
                triggerEvent: function (eventName) {
                    if (this.events && this.events[eventName]) {
                        this.events[eventName].fire(this, Array.prototype.slice.call(arguments, 1));
                    }
                }
            });
        })(b.Callbacks);
        b.TemplateBox = (function (TReplace) {
            return b.Core.extend({
                init: function (opts) {
                    opts = $.extend(true,{
                        template: null,
                        box: null,
                        data: null
                    }, opts);
                    $.extend(true,this, opts);
                    this.load();
                },
                load: function () {
                    var html = $.template.replace(this.template, this.data);
                    this.box.innerHTML = html;
                },
                request: function (data) {
                    this.data = data;
                    this.load();
                }
            });
        })(b.TReplace);
        return b;
    })();
    $.extend({ 
        load: _load,
        Base:Base 
    });
    window.$$ = $$;
    /*
    var Mining = function () {//数据挖掘
        if($("#header_box").length > 0){
            var _userAgent = window.navigator.userAgent.toLowerCase();
            var mousePosition = function (event) {
                    if (event.pageX) {
                        return {
                            x: event.pageX,
                            y: event.pageY
                        }
                    } else {
                        return {
                            x: event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
                            y: event.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
                        }
                    }
                }, getPos = function (pEvent) {
                    var _pos = mousePosition(pEvent);                
                    var _x = $("#header_box").offset().left;
                    return "x=" + (_pos.x - _x) + "&" +
                           "y=" + _pos.y + "&";
                }, getParentId = function (pSon) {
                    var _node = pSon;
                    if (_node.id) return _node.id;
                    while (_node.parentNode != null) {
                        _node = _node.parentNode;
                        if (_node.id) {
                            return _node.id;
                        }
                    }
                }, getHref = function (pSon) {
                    var _node = pSon;
                    if (_node.tagName == "A") {
                        return "h=" + encodeURIComponent(_node.href) + "&";
                    }
                    while (_node.parentNode != null) {
                        _node = _node.parentNode;
                        if (_node.tagName == "A") {
                            return "h=" + encodeURIComponent(_node.href) + "&";
                        }
                    }
                }, getScreen = function () {//分辨率
                    return "s=" + window.screen.width + "*" + window.screen.height + "&";
                }, getParam = function (pEvent) {
                    return [
                        getHref(pEvent.target),
                        getPos(pEvent),
                        "n=" , _userAgent ,"&",
                        "dt=", pEvent.target.tagName, "&",
                        "t=", pEvent.button, "&",
                        "i=", getParentId(pEvent.target), "&",
                        getScreen()
                    ].join('');
                }, init = function () {
                    if($("#header_box").length > 0){
                        $(document).bind("mousedown", function (event) {
                            $.get($("#header_box").data("url") + "/Home/SaveMining?" + getParam(event));
                        });
                    }
                }, getData = function(){
                    return {
                        userAgent: _userAgent,
                        screenWidth: window.screen.width,
                        screenHeight: window.screen.height
                    }
                }, saveMining = function(){
                    if($("#header_box").length > 0){
                        $.post($("#header_box").data("url") + "/Home/SaveMining",{ UILogObject:$.jsonToString(getData()) });
                    }
                }, pageLode = function(){
                    if($$.cookie("MINING_PAGELODE") == null){
                        $$.cookie("MINING_PAGELODE",true,{ expires: 30, path:"/", domain: ".springtour.com" });
                        saveMining();
                    }
                }
            //init();
            pageLode();
        }
    }
    new Mining();*/
})(jQuery, undefined);
(function (g) {//解决console调用出错问题
    'use strict';
    var _console = g.console || {};
    var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'exception', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    var console = { version: '0.1.0' };
    var key;
    for (var i = 0, len = methods.length; i < len; i++) {
        key = methods[i];
        console[key] = function (key) {
            return function () {
                if (typeof _console[key] === 'undefined') {
                    return 0;
                }
                Function.prototype.apply.call(_console[key], _console, arguments);
            };
        }(key);
    }

    g.console = console;
}(window));