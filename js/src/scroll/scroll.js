/*
* the initail mod scroll
* @Author:      dingyantao
* @CreateDate:  2013-11-26
*/
(function ($, undefined) {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (pThis) {
            if (typeof this !== "function") {
              $.error("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1), 
                fToBind = this, 
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && pThis
                         ? this
                         : pThis || window,
                       aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
    var ScrollControl = function (pObj, pOpts) {
        pOpts = $.extend({
            showTop:null,
            panel:null,
            className:null,//["",""]
            //回调函数
            callback:{
                //还原
                lower:null,
                //变化
                change:null,
                //底部
                bottom:null
            },
            //距离底部
            distanceBottom:0,
            size:{
                top:0,
                bottom:0,
                left:0,
                width:0,
                height:0
            },
            initTop:null,
            initMaxTop:0,
            anchor:{
                //锚点触发列表对象
                list:null,
                //锚点点击后的样式
                className: "on",
                //锚点位置偏移
                isOffset:false
            }
        }, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    }
    ScrollControl.prototype = {
        init: function (pOpts) {
            this.setOptions(pOpts);
            this.bindEvent();
        },
        setOptions:function(pOpts){
            $.extend(this,pOpts);
            this.size.height = this.target.height();
            this.size.width = this.target.width();
            this.size.left = this.target.offset().left;
            this.initTop = this.initTop === 0 ? 0 : this.target.offset().top;
            this.isAnchor = this.anchor.list != null;
            if(this.isAnchor){
                this.initSetOptions();
                this.triggerAnchor(0);
            }
        },
        bindEvent:function(){
            var _this = this;
            $(document).ready(function(){ _this.fire(); });
            $(window).unbind("scroll",this.fire);
            $(window).unbind("resize",this.fire);
            $(window).bind("scroll",this.fire.bind(_this));
            $(window).bind("resize",this.fire.bind(_this));
        },
        initSetOptions:function(){
            var _this = this;
            this.changeAList = new Array();
            this.anchorList = new Array();
            //自动计算列表的高度
            for (var i = 0, l = this.anchor.list.length; i < l; i++) {
                var _hrefvalue = $(this.anchor.list[i]).attr("href");
                var _findvar = $(_hrefvalue);
                if (_findvar) {
                    var _tmpList = this.getTop(_findvar[0]);
                    this.anchorList.push(_tmpList);
                    this.changeAList.push($(this.anchor.list[i]));
                } else {
                    //找不到锚点，此锚点就没有必要显示出来
                    this.anchor.list[i].style.display = "none";
                }
            }
            //冒泡排序
            var totalCount = this.changeAList.length;
            //对锚点重新排序，并更改相应的列表值
            for (var m = 0, mt = totalCount - 1; m <= mt; m++) {
                for (var n = m + 1, nt = totalCount - 1; n <= nt; n++) {
                    if (this.anchorList[m] > this.anchorList[n]) {
                        var _tmp = this.anchorList[n];
                        this.anchorList[n] = this.anchorList[m];
                        this.anchorList[m] = _tmp;
                        _tmp = this.changeAList[n];
                        this.changeAList[n] = this.changeAList[m];
                        this.changeAList[m] = _tmp;
                    }
                }
            }
            //重新绑定锚点事件
            for (var wt = 0, qt = totalCount; wt < qt; wt++) {
                //绑定事件
                (function(num){
                    _this.changeAList[wt].bind("click", function (e) {
                        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        window.scroll(0,_this.anchorList[num]);
                        //自动计算下高度
                        _this.autoCalcTopList();
                        //取出onscroll事件
                        _this.triggerAnchor(num);
                    });
                })(wt);
            }
        },
        autoCalcTopList : function () {
            //自动计算高度
            this.anchorList = [];
            for (var i = 0, l = this.changeAList.length; i < l; i++) {
                var _hrefvalue = $(this.changeAList[i]).attr("href");
                var _tmpList = this.getTop($(_hrefvalue)[0]) - (this.anchor.isOffset ? this.size.height : 0);
                this.anchorList.push(_tmpList);
            }
        },
        triggerAnchor:function(pIndex){
            for (var i = 0, l = this.changeAList.length; i < l; i++) {
                if (i == pIndex) {
                    this.changeAList[i].addClass(this.anchor.className);
                } else {
                    this.changeAList[i].removeClass(this.anchor.className);
                }
            }            
        },
        fire:function(){
            var _this = this,
                _timer;
            if(this.showTop){
                var _top = $(document).scrollTop();
                if(_top < this.showTop){
                    _this.target.trigger("hide");
                }else{
                    _this.target.trigger("show");
                }
            }
            if (_timer) clearTimeout(_timer);
            _timer = setTimeout(function () {
                _this.getWindowMoveScroll();
            }, 1);
        },
        getWindowMoveScroll : function () {
            var _nowScrollTop = this.getScrollTop();
            if (_nowScrollTop <= this.initTop) {
                //维持原样式不变
                this.setOldStyle();
                if(this.className){
                    this.target.removeClass(this.className[1]);
                    this.panel.addClass(this.className[0]);
                }                       
                if($.type(this.callback.lower) == "function")  this.callback.lower();
            } else {
                if(this.className){
                    this.panel.removeClass(this.className[0]);
                    this.target.addClass(this.className[1]);
                }
                if (this.isMaxScrollBottom(_nowScrollTop)) {
                    this.setFixedBottomStyle();
                    if($.type(this.callback.bottom) == "function") this.callback.bottom();
                } else {
                    //新增新的样式
                    this.setNewStyle();
                    if($.type(this.callback.change) == "function") this.callback.change();
                }
            }
            if (!this.isReachBrowserBottom() && this.isAnchor) {
                    var _outInt = 0;
                    if (this.anchorList.length > 0) {
                        this.autoCalcTopList();
                        if (_nowScrollTop <= this.anchorList[0]) {
                            _outInt = 0;
                        }
                        else if (_nowScrollTop >= this.anchorList[this.anchorList.length - 1]) {
                            _outInt = this.anchorList.length - 1;
                        }
                        else {
                            if (this.anchorList.length > 1) {
                                if (_nowScrollTop < this.anchorList[this.anchorList.length - 1] &&
                                    _nowScrollTop >= this.anchorList[this.anchorList.length - 2]) {
                                    _outInt = this.anchorList.length - 2;
                                }
                                else {
                                    for (var k = 0, l = this.anchorList.length - 2; k < l; k++) {
                                        if (_nowScrollTop >= this.anchorList[k]
                                            && _nowScrollTop < this.anchorList[k + 1]) {
                                            _outInt = k;
                                        }
                                    }
                                }
                            }
                        }
                        this.triggerAnchor(_outInt);
                    }
                }
        },
        isReachBrowserBottom:function(){
            var _scrollTop = 0, _clientHeight = 0, _scrollHeight = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                _scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                _scrollTop = document.body.scrollTop;
            }
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                _clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            } else {
                _clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
            _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            if (_scrollTop + _clientHeight == _scrollHeight) {
                return true;
            } else {
                return false;
            }
        },
        getTop : function (pDom) {
            var offset = pDom.offsetTop;
            if (pDom.offsetParent != null) offset += arguments.callee(pDom.offsetParent);
            return offset;
        },
        isMaxScrollBottom : function (pScrollTop) {
            if (pScrollTop > this.getMaxScrolHeight(false)) {
                return true;
            }
            return false;
        },
        getMaxScrolHeight : function (pFLag) {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            } else {
                clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
            var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            return scrollHeight - (pFLag ? clientHeight : 0) - this.distanceBottom - this.size.height;
        },
        getScrollTop : function () {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        setFixedBottomStyle : function () {
            if (this.target[0].style.position == "fixed") {
                this.target[0].style.top = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - this.distanceBottom - this.target.height() - 20 + "px";
                this.target[0].style.position = "absolute";
                this.target[0].style.bottom = this.size.bottom + "px";
                this.target[0].style.left = "";
                this.target[0].style.zIndex = 10000;
                this.target[0].style.height = this.size.height + 20 + "px";
                if ($$.browser.IsIE) {
                    this.target[0].style.width = (this.size.width + 1) + "px";
                }
            }
        },
        setNewStyle : function () {
            this.target[0].style.top = (this.size.top + this.initMaxTop) + "px";
            //this.target[0].style.bottom = this.size.bottom + "px";
            //this.target[0].style.left = this.size.left + "px";
            this.target[0].style.zIndex = 10000;
            this.target[0].style.position = "fixed";
            //this.target[0].style.height =  this.target.height() + "px";
            if ($$.browser.IsIE) {
                //this.target[0].style.width = (this.width + 1) + "px";
                //验证如果是Ie6
                if ($$.browser.IsIE6) {
                    this.target[0].style.position = "absolute";
                    this.target[0].style.top = (this.size.top + this.getScrollTop() + this.initMaxTop) + "px";
                    this.target[0].style.left = this.size.left + "px";
                    this.target[0].style.bottom = this.size.bottom + "px";
                }
            }
        },
        setOldStyle : function () {
            this.target[0].style.top = "";
            this.target[0].style.left = "";
            this.target[0].style.bottom = "";
            this.target[0].style.zIndex = "";
            this.target[0].style.position = "";
            this.target[0].style.width = "";
            this.target[0].style.display = "block";
        }
    }
    $.fn.extend({
        Scroll: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            ScrollControl["instance"] = new ScrollControl(this, _defaults);
            return ScrollControl["instance"];
        }
    });
})(jQuery);