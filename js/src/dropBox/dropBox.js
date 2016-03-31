/*
* the initail mod dropBox
* @Author:      dingyantao
* @CreateDate:  2013-8-22
*/
; (function ($, undefined) {
    var DropBox = function (pObj, pOpts) {
        this.opts = {
            options: {
                /**
                * @default auto
                * @cfg {string} type 可选:auto、select、drop
                */
                type: 'auto',
                /**
                * @default null
                * @cfg {Dom} type为 auto的时候 请指定节点
                */
                dropDom: null,
                /**
                * @default []
                * @cfg {Array} data 若为select请放入数据如：['1|7位','2|8位']
                */
                data: [],
                /**
                * @default 'mousedown'
                * @cfg {string} trigger 触发事件
                */
                trigger: 'mousedown',
                /**
                * @default ''
                * @cfg {string} ajax 请求地址
                */
                ajax: '',
                /**
                * @default 'post'
                * @cfg {string} ajax 请求类型
                */
                ajaxType: 'post',
                /**
                * @default 'a'
                * @cfg {string} stag 选择TagName
                */
                stag: 'a',
                icon: null,
                iconClass: ""
            },
            classNames: {
                /**
                * @default dropBox_box
                * @cfg {string} box 样式
                */
                box: 'dropBox_box',
                /**
                * @default dropBox_list
                * @cfg {string} list 样式
                */
                list: 'dropBox_list',
                /**
                * @default dropBox_hover
                * @cfg {string} hover 样式
                */
                hover: 'dropBox_hover',
                /**
                * @default ''
                * @cfg {string} checked 样式
                */
                checked: '',
                /**
                * @default ''
                * @cfg {string} blur 样式
                */
                blur: ''
            },
            template: {
                showBox: '<ul ${classname} style="display:none;">${inner}</ul>',
                showInner: '<li ${flag}>${txt}</li>'
            },
            listeners: {
                /**
                * @default ''
                * @cfg {function} returnVal 点击后的返回值
                */
                returnVal: function (pVal, pEl) {
                    return pVal;
                }
            }
        };
        this.target = $(pObj);
        this.init();
        this.initialize(pOpts);
    }
    DropBox.prototype = {
        init: function () {
            var c = document.createElement('div');
            c.id = '_dropBoxTemp_';
            c.style.display = 'none';
            $$.container.append(c);
            this.tempBox = $("#_dropBoxTemp_");
        },
        initialize: function (pOpts) {
            this.setOptions(pOpts);
            this.bindEvent();
        },
        setOptions: function (pOpts) {
            $.extend(true, this.opts, pOpts);
            this.sView = null;
            this.saveData = {};
            this._privateNowHover = null;
            this._xy = null;
            var _this = this;
            ({
                "auto": function () {
                    _this.creatHtml(_this.opts.options.data);
                },
                "select": function () {
                    _this.creatHtml(_this.opts.options.data.length > 0
                        ? _this.opts.options.data
                        : _this.target.data("select-data").split(","));
                    _this.target[0].setAttribute('readOnly', 'readonly');
                },
                "drop": function () {
                    _this.sView = _this.opts.options.dropDom || $("#" + _this.target.data("drop-dom"));
                }
            }[_this.opts.options.type]());
        },
        iconShow: function () {
            if (this.opts.options.icon) {
                for (var key in this.opts.options.icon) {
                    this.opts.options.icon[key].addClass(this.opts.options.iconClass);
                }
            }
        },
        iconHide: function () {
            if (this.opts.options.icon) {
                for (var key in this.opts.options.icon) {
                    this.opts.options.icon[key].removeClass(this.opts.options.iconClass);
                }
            }
        },
        /**
        * 绑定事件
        */
        bindEvent: function () {
            var _sbox = this.sView,
                _this = this,
                _flag = false, _showFlag = false, _prevVal, _timer, _oldVal;
            this.target.bind(_this.opts.options.trigger, function (e) {
                var tv;
                if (_this.opts.options.type == 'auto') {
                    tv = _this.target[0].value.replace(/\s*/g, '');
                }
                if (_this.opts.options.type != 'drop') {
                    _this.resizeXy();
                };
                if (_this.opts.options.type != 'auto') {
                    _sbox.show();
                    _flag = true;
                    _this.iconShow();
                }
                _this.target.addClass(_this.opts.classNames.checked);
                if (!_this.sView.html()) {
                    _sbox.hide();
                } else if (_prevVal == tv && tv) {
                    _sbox.show();
                };
            });
            this.target.bind('blur', function () {
                clearTimeout(_timer);
                if (_this._privateNowHover) _this._privateNowHover.removeClass(_this.opts.classNames.hover);
                _sbox.hide();
                _this.target.removeClass(_this.opts.classNames.checked);
                _this.target.addClass(_this.opts.classNames.blur);
                _this.iconHide();
            });
            _sbox.bind('mousedown', function (e) {
                e = e || window.event;
                var _target = e.target || e.srcElement;
                _showFlag = true;
                setTimeout(function () { _showFlag = false }, 1);
                if (_target.getAttribute('data-tag') || (_target.tagName == _this.opts.options.stag.toLocaleUpperCase())) {
                    _this.target.val(_target.innerHTML);
                    _oldVal = _target.innerHTML;
                    _this.opts.listeners.returnVal(_target.innerHTML, _target);
                    _this.target.trigger('blur');
                } else {
                    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    return false;
                }
            });
            if ($$.browser.isIE) {
                //阻止ie 浏览器blur
                this.target[0].onbeforedeactivate = function () {
                    if (_showFlag)
                        return _showFlag = false;
                    return true;
                }
            }
            if (_this.opts.options.type != 'drop') {
                this.target.bind('keyup', function (e) {
                    e = e || window.event;
                    var key = e.keyCode,
                        tv = _this.target[0].value.replace(/\s*/g, '');
                    if (_oldVal == tv || !tv) {
                        _sbox.css('display', 'none');
                        return;
                    }
                    switch (key) {
                        //向下翻动 
                        case $.KEY_DOWN:
                            _this.hoverList(1);
                            break;
                        //向上翻动 
                        case $.KEY_UP:
                            _this.hoverList(0);
                            break;
                        //回车填值 
                        case $.KEY_ENTER:
                            clearTimeout(timer);
                            _this.fillInput();
                            _prevVal = _this.target[0].value.replace(/\s*/g, '');
                            break;
                        default:
                            if (_this.opts.options.type == 'auto') {
                                timer = setTimeout(function () {
                                    _this.sendAjax(tv, _this.opts.options.ajax || _this.target.data("ajax-url"));
                                }, 100);
                            };
                            break;
                    }
                });
            } else {
                $(document).bind('click', function (e) {
                    if (_flag) {
                        var _target = e.target || e.srcElement;
                        if (!$.contains(_sbox[0], _target) && !$.contains(_this.target[0], _target)
                    		&& (_target != _sbox[0] && _target != _this.target[0])) {
                            _this.target.removeClass(_this.opts.classNames.checked);
                            _this.target.addClass(_this.opts.classNames.blur);
                            _sbox.hide();
                            _this.iconHide();
                            _flag = false;
                        }
                    }
                });
            }
        },
        /**
        * 创建HTML文档
        * @param {Array} 数据
        **/
        creatHtml: function (pData) {
            var _html = $.template.render(this.opts.template.showBox, {
                classname: 'class = ' + this.opts.classNames.box,
                inner: this.opts.options.type == 'auto' ? '' : this.creatList(pData)
            });
            this.tempBox.html(_html);
            var s = this.tempBox.children().first();
            s[0].id = this.target[0].id + '_s';
            s[0].style.position = 'absolute';
            this.sView = $('#' + s[0].id);
            $$.container.append(s);
        },
        /**
        * 创建下拉列表
        * @param {Array} 数据
        **/
        creatList: function (pData) {
            var cList = '';
            for (var i = 0, l = pData.length; i < l; i++) {
                var spt = pData[i].split('|');
                cList += $.template.render(this.opts.template.showInner, {
                    flag: 'data-tag=' + spt[0],
                    txt: spt[1]
                });
            };
            return cList;
        },
        /**
        * 重写HTML
        * @param {Array} 数据
        **/
        replaceHtml: function (pData) {
            var _len = pData.length;
            if (_len < 1 || (_len == 1 && !pData[0])) {
                this.sView.css('display', 'none');
            } else {
                var _h = this.sView;
                _h.html('');
                _h.html(this.creatList(pData));
                _h.show();
            }
        },
        /**
        * 重新设置下拉框
        **/
        resizeXy: function () {
            this._xy = this.target.offset();
            this.sView.css('left', parseInt(this._xy.left) + 'px');
            this.sView.css('top', parseInt(this._xy.top + this.target[0].offsetHeight) + 'px');
        },
        /**
        * 回车填值
        **/
        fillInput: function () {
            if (this._privateNowHover != null) {
                if (!this._privateNowHover[0].getAttribute('data-tag')) {
                    this.target.value(this._privateNowHover.find(this.opts.options.stag)[0].innerHTML);
                } else {
                    this.target.value(this._privateNowHover[0].innerHTML);
                }
                this._privateNowHover.removeClass(this.opts.classNames.hover);
            };
            this.sView.hide();
        },
        /**
        * 键盘出发hover函数
        * @param {Number} 0 向上 1 向下
        **/
        hoverList: function (pDirection) {
            var _this = this,
                _hoverEl = null;
            if (pDirection == 0) { //向上翻 
                if (_this._privateNowHover == null) {
                    _hoverEl = _this.sView.find("li").filter(":last");
                } else {
                    var pdom = _this._privateNowHover.previousSibling();
                    _hoverEl = pdom.length > 0 ? pdom : _this.sView.find("li").filter(":last");
                    _this._privateNowHover.removeClass(_this.opts.classNames.hover);
                }
            } else if (pDirection == 1) { //向下翻
                if (_this._privateNowHover == null) {
                    _hoverEl = _this.sView.find("li").filter(":first");
                } else {
                    var ndom = _this._privateNowHover.nextSibling();
                    _hoverEl = ndom.length > 0 ? ndom : _this.sView.find("li").filter(":first");
                    _this._privateNowHover.removeClass(_this.opts.classNames.hover);
                }
            }
            _hoverEl.addClass(_this.opts.classNames.hover);
            _this._privateNowHover = _hoverEl;
        },
        /**
        * 发送ajax
        * @param {String} element的value
        * @param {String} 请求地址
        **/
        sendAjax: function (pVal, pUrl) {
            if (!pVal) return;
            var _this = this,
                _ajaxOpt = {
                    method: this.opts.options.ajaxType,
                    context: {
                        key: pVal
                    },
                    cache: true,
                    success: function (xhr, txt) {
                        var data = txt.split('@');
                        _this.replaceHtml(data);
                    }
                };
            $.ajax(pUrl, _ajaxOpt);
        }
    }
    $.fn.extend({
        DropBox: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            DropBox["instance"] = new DropBox(this, _defaults);
            return DropBox["instance"];
        }
    })
})(jQuery, undefined);