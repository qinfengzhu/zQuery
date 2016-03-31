/*
* the initail mod tab
* @Author:      dingyantao
* @CreateDate:  2013-10-12
* 目前还差一些部分需要完善，异步请求可以没有initView，自动执行第一次异步请求
*/
(function ($) {
    var TabControl = function (pObj, pOpts) {
        pOpts = $.extend({
            btns: null,                 //tab按钮集合
            views: null,                //view集合
            initView: null,             //第一屏的viewDom（）
            tabClass: ["", "on"],       //tab按钮的样式数组 tabClass[0]=未选中  tabClass[1]=已选中
            index: 0,                   //当前tab索引
            url: null,                  //需要异步ajax时使用的url地址
            tempalte: null,             //替换模板 $.template.replace的使用规范            
            eventType: "click",         //事件类型
            querySelecterKey: "key",     //tab按钮上querySelecter，用于缓存key的存放与ajax时传递的值【必须要有】
            ajaxId: "locationId",        //用于ajax时使用的参数名
            ajaxFun: null,              //ajax执行横切 不使用组件自带ajax 该参数必须类型为function
            //@Param:参数说明（该ajaxFun的this作用域是当前tab组件）
            //@_key  json        tab按钮上通过data(querySelecterKey)取到的值
            //@_div  jqueryDom   组件创建出来用于展现的对应dom
            //@_dom  jqueryDom   tab按钮Dom
            onLoad: null,               //每次tab切换完的回调函数
            onFisrtLoad: null           //每个tab页第一次请求加载后的回调函数
        }, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    };
    TabControl.prototype = {
        init: function (pOpts) {
            this.lastKey = null;
            this.currentKey = null;
            //tab页缓存
            this.cache = {};
            //btn指针
            this.btnPoint = {},
            this.setOptions(pOpts);
            this.bindEvent();
        },
        setOptions: function (pOpts) {
            $.extend(this, pOpts);
            if (this.initView !== null) {
                var _btn = $(this.btns[this.index]),
                    _key = _btn.data(this.querySelecterKey);
                this.cache[_key] = this.initView;
                this.currentKey = _key;
                this.btnPoint[_key] = _btn;
                _btn.addClass(this.tabClass[1]);
            }
        },
        Switch: function (pKey) {
            if (this.currentKey !== null) {
                this.hide();
                this.show(pKey);
            }
        },
        hide: function () {
            this.btnPoint[this.currentKey].removeClass(this.tabClass[1]);
            this.cache[this.currentKey].hide();
        },
        show: function (pKey) {
            this.currentKey = pKey;
            this.btnPoint[pKey].addClass(this.tabClass[1]);
            this.cache[pKey].show();
            if ($.type(this.onLoad) === "function") this.onLoad.call(this,this.cache[pKey], this.btnPoint[pKey]);
        },
        bindEvent: function () {
            var _this = this;
            if (this.url) {
                this.btns.bind(_this.eventType, function () {
                    if ($(this).hasClass(_this.tabClass[1])) return;
                    var _dom = $(this),
                    _key = _dom.data(_this.querySelecterKey);
                    if (_this.cache[_key] == null) {
                        var _div = $("<div></div>");
                        _this.target.append(_div);
                        _this.cache[_key] = _div;
                        _this.btnPoint[_key] = _dom;
                        if (_this.ajaxFun == null) {
                            var _obj = {};
                            _obj[_this.ajaxId] = _key;
                            $.post(_this.url, _obj, function (data) {
                                _div.html($.template.replace(_this.tempalte, $.parseJSON(data)));
                                _this.Switch(_key);
                                if ($.type(_this.onFisrtLoad) === "function") _this.onFisrtLoad.call(_this,_div,_dom);
                            });
                        } else {
                            if ($.type(_this.ajaxFun) === "function") {
                                _this.Switch(_key);
                                _this.ajaxFun.call(_this, _key, _div, _dom);
                            }
                        }
                    } else {
                        _this.Switch(_key);
                    }
                });
                if (this.initView === null) {
                    var _btn = $(this.btns[this.index]);
                    this.currentKey = _btn.data(_this.querySelecterKey);
                    _btn.trigger(_this.eventType);
                }
            } else {
                for (var i = this.btns.length - 1; i >= 0; i--) {
                    this.btnPoint[i] = $(this.btns[i]);
                    this.cache[i] = $(this.views[i]);
                    (function (index) {
                        _this.btnPoint[index].bind(_this.eventType, function () {
                            if (_this.btnPoint[index].hasClass(_this.tabClass[1])) return;
                            _this.Switch(index);
                        });
                    })(i);
                };
                this.show(this.index);
            }
        }
    };
    $.fn.extend({
        Tab: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            TabControl["instance"] = new TabControl(this, _defaults);
            return TabControl["instance"];
        }
    });
})(jQuery);