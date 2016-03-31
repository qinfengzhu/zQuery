/*
* the initail mod tips
* @Author:      dingyantao
* @CreateDate:  2013-11-15
*/
(function ($, undefined) {
    var TipsControl = function (pObj, pOpts) {
        pOpts = $.extend({
            json: "",
            template: "",
            url: null,
            datatype: null,
            view: null,
            type: "bottom"   //top bottom left-bottom right-bottom
        }, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    }
    TipsControl.prototype = {
        init: function (pOpts) {
            this.target.data("__loaded__", true);
            this.setOptions(pOpts);
            this.bindEvent();
        },
        setOptions: function (pOpts) {
            $.extend(this, pOpts);
            this.isCreate = true;
            this.json = this.json || this.target.data("json");
            this.template = this.template || $("#" + this.target.data("template")).val();
            this.url = this.url || this.target.data("url");
            this.datatype = this.datatype || this.target.data("datatype");
            this.type = this.target.data("type") || this.type;
        },
        bindEvent: function () {
            var _this = this;
            this.target.on("mousemove", function () {
                if (_this.isCreate) {
                    if (_this.url && !_this.json) {
                        _this.isCreate = false;
                        $.ajax({
                            url: _this.url,
                            type: "get",
                            dataType: _this.datatype,
                            success: function (data) {
                                if ($.type(data) === "object") {
                                    _this.json = data;
                                } else {
                                    _this.json = $.parseJSON(data);
                                }
                                _this.createHtml();
                            }
                        });
                    } else {
                        _this.isCreate = false;
                        _this.createHtml();
                    }
                }
            });
            $(document).on("mousemove", function (event) {
                if (_this.view) {
                    if (!_this.hasParent(_this.getToElement(event), [_this.view[0], _this.target[0]]))
                        _this.clearHtml();
                }
            });
        },
        bindViewEvent: function () {
            var _this = this;
            this.view.on("mouseout", function (event) {
                if (!_this.hasParent(_this.getToElement(event), [_this.view[0], _this.target[0]]))
                    _this.clearHtml();
            });
        },
        getToElement: function (event) {
            var node;
            if (event.type == "mouseout") node = event.relatedTarget || event.toElement;
            else if (event.type == "mouseover") node = event.target;
            else node = event.target;
            if (!node) return;
            while (node.nodeType != 1)
                node = node.parentNode;
            return node;
        },
        hasParent: function (pSon, pDoms) {
            var _node = pSon,
                _val = false;
            if (_node != null) {
                for (var i = 0, l = pDoms.length; i < l; i++) {
                    if (pDoms[i] == _node) return true;
                }
                while (_node.parentNode != null) {
                    _node = _node.parentNode;
                    for (var wi = 0, l = pDoms.length; wi < l; wi++) {
                        if (pDoms[wi] == _node) return true;
                    }
                }
            }
            return _val;
        },
        createHtml: function () {
            this.view = $($.template.replace(this.template, this.json));
            $$.container.append(this.view);
            this.view.cover();
            this.view.css("position", "absolute").css(this.getPostion());
        },
        clearHtml: function () {
            this.view.uncover();
            this.view.remove();
            this.isCreate = true;
        },
        getPostion: function () {
            var _pos = this.target.offset(),
        		_npos = _pos,
        		_xOffset = (this.view.width() / 2) - (Math.max(this.target.width(), this.target[0].offsetWidth) / 2),
        		_yOffset = this.view[0].offsetHeight,
                _height = this.target[0].offsetHeight;            
            switch (this.type) {
                case "top":
                    _npos.left = _pos.left - _xOffset;
                    _npos.top = _pos.top - _yOffset;
                    break;
                case "bottom":
                    _npos.left = _pos.left - _xOffset;
                    _npos.top = _pos.top + _height;
                    break;
                case "left-bottom":
                    _npos.left = _pos.left - (this.view.width() - Math.max(this.target.width(), this.target[0].offsetWidth))
                    _npos.top = _pos.top + _height;
                    break;
                case "right-bottom":
                    _npos.left = _pos.left;
                    _npos.top = _pos.top + _height;
                    break;
            }
            return _npos;
        }
    }
    $.fn.extend({
        Tips: function (pOpts) {
            if ($(this).data("__loaded__") == undefined) {
                var _defaults = {};
                if (typeof pOpts !== "undefined") {
                    $.extend(true, _defaults, pOpts);
                }
                TipsControl["instance"] = new TipsControl(this, _defaults);
                return TipsControl["instance"];
            }
        }
    });
    $.extend({
        TipsAll: function () {
            $("[data-role='page']").on("mousemove", "[data-role='tips']", function () {
                $(this).Tips();
            });
        }
    })
})(jQuery);