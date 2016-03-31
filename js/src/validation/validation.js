/*
* the initail mod validation
* @Author:      dingyantao
* @CreateDate:  2013-11-15
*/
(function ($, undefined) {
    var _validationList = {},
        _guid = 1;
    $(document).ready(function(){
        var hasParent = function(pSon, pDoms){
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
        }
        $(document).bind("mousedown",function(e){
            var _target = e.target || window.target;
            for (var key in _validationList) {
                var _item = _validationList[key];
                if(!hasParent(_target, [_item.view[0]])){
                    _item.hide();
                }
            };
        });
    });
    var ValidationControl = function (pObj, pOpts) {
        pOpts = $.extend({
            type: "", //展现方式：一直显示，焦点隐藏，独立显示
            text: "", //提示文本
            setStyleCss: '',
            isPos: false,
            isTimeHide: false,
            hideTime: 2000
        }, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    }
    ValidationControl.prototype = {
        init: function (pOpts) {
            this.setOptions(pOpts);
            this.bindEvent();
        },
        setOptions: function (pOpts) {
            $.extend(this, pOpts);
            this.show();
        },
        bindEvent: function () {
            var _this = this;
            /*this.target.bind("focus", function () {
                _this.hide();
            });*/
            if (this.isTimeHide) {
                setTimeout(function () { _this.hide() }, _this.hideTime);
            }
        },
        show: function () {
            if (this.isPos) {
                $(document).scrollTop(this.target.offset().top);
            }
            this.target.css("border", "1px solid rgb(240, 78, 47)");
            this.view = $($.template.render("<div class=\"zq_validation\"><i class=\"icon-exclamation-sign\"></i><span>${text}</span></div>", { text: this.text }));
            $$.container.append(this.view);
            this.pos = this.getPosition();
            this.view.css(this.pos);
        },
        hide: function () {
            this.target.css("border", "");
            this.view.remove();
        },
        getPosition: function () {
            var _pos = this.target.offset(),
        		_npos = _pos,
        		_xOffset = this.target[0].offsetWidth,
        		_yOffset = (this.view.height() / 2) - (this.target[0].offsetHeight / 2);
            _npos.left = _pos.left + _xOffset;
            _npos.top = _pos.top - _yOffset;
            return _npos;
        }
    }
    $.fn.extend({
        Validation: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            if($(this).data("__validationLoaded__") === undefined){
                ValidationControl["instance"] = new ValidationControl(this, _defaults);
                _validationList[_guid] = ValidationControl["instance"];
                $(this).data("__validationLoaded__", true);
                $(this).data("__validationGuid__",_guid);
                _guid++;
                return ValidationControl["instance"];
            }else{
                _validationList[$(this).data("__validationGuid__")] = new ValidationControl(this, _defaults);
                return _validationList[$(this).data("__validationGuid__")];
            }
        }
    });
})(jQuery);