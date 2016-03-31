/*
* the initail mod dropBox
* @Author:      dingyantao
* @CreateDate:  2013-10-08
*/
(function ($) {
    var isPlaceholderSupport = 'placeholder' in document.createElement('input');
    function checkVal(pObj) {
        return pObj.val() == pObj.data("__notice__");
    }
    $.fn.extend({
        value: function (pVal) {
            var _val = "";
            this.each(function () {
                var _this = $(this);
                if (pVal == undefined) {
                    if (this.nodeName === "INPUT" || this.nodeName === "TEXTAREA") {
                        if (checkVal(_this)) {
                            _val = ""; return;
                        }
                    }
                    _val = _this.val(); return;
                }
                if (this.nodeName === "INPUT" || this.nodeName === "TEXTAREA") {
                    _this.val(pVal);
                    _this.trigger("setValue");
                    _this.trigger("blur");
                } else {
                    _this.val(pVal);
                }
            });
            return _val;
        },
        Notice: function (pOpts) {
            var _defaults = { attrName: 'notice', size: 0, bold: false, italic: false, color: '#999', tips: null, type: "val" };
            var _options = $.extend(_defaults, pOpts);
            if (isPlaceholderSupport) {
                this.each(function () {
                    var _this = $(this),
                        _text = _options.tips || _this.data(_options.attrName);
                    if (!_text) return;
                    _this.data("__notice__", _text);
                    _this.attr("placeholder", _text);
                });
                return;
            }
            if (_options.type === "val") {
                this.each(function () {
                    var _this = $(this),
                        _text = _options.tips || _this.data(_options.attrName);
                    _text = isNaN(_text) ? _text : _text + " ";
                    if (!_text) return;
                    _this.data("__notice__", _text);
                    if (_this.val().length > 0) { return; }
                    _this.css("color", _options.color);
                    _this.val(_text);
                }).focus(function () {
                    var _this = $(this);
                    if (checkVal(_this)) {
                        _this.val("");
                        _this.css("color", "");
                    }
                }).blur(function () {
                    var _this = $(this);
                    if (!_this.val()) {
                        _this.css("color", _options.color);
                        _this.val(_this.data("__notice__"));
                    }
                }).bind("setValue", function () {
                    var _this = $(this);
                    _this.css("color", "");
                });
            } else if (_options.type === "label") {
                this.each(function () {
                    var _this = $(this),
                        _text = _options.tips || _this.data(_options.attrName);
                    if (!_text) return;
                    var offset = _this.position(),
                        outerWidth = _this.outerWidth(),
                        outerHeight = _this.outerHeight(),
                        innerWidth = _this.innerWidth(),
                        innerHeight = _this.innerHeight(),
                        plusLeft = (outerWidth - innerWidth) / 2,
                        plusTop = (outerHeight - innerHeight) / 2,
                        paddingTop = parseInt(_this.css('paddingTop')),
                        paddingRight = parseInt(_this.css('paddingRight')),
                        paddingBottom = parseInt(_this.css('paddingBottom')),
                        paddingLeft = parseInt(_this.css('paddingLeft')),
                        width = 0, height = 0;
                    if (!$$.browser.isChrome) {
                        width = innerWidth - (paddingLeft + paddingRight);
                        height = innerHeight - (paddingTop + paddingBottom);
                    } else {
                        width = innerWidth - paddingRight;
                        height = innerHeight - paddingBottom;
                    }
                    var top = offset.top + plusTop,
                        left = offset.left + plusLeft,
                        lineHeight = _this.css('lineHeight'),
                        display = _this.val() ? 'none' : 'block',
                        fontSize = _options.size ? _options.size : _this.css('fontSize'),
                        fontStyle = _options.italic ? 'italic' : '',
                        fontWeight = _options.bold ? '700' : _this.css('fontWeight'),
                        css = {
                            position: 'absolute', fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle, lineHeight: lineHeight,
                            display: display, cursor: 'text', width: width, height: height,
                            paddingTop: paddingTop, paddingRight: paddingRight, paddingBottom: paddingBottom, paddingLeft: paddingLeft,
                            top: top, left: left, color: _options.color, overflow: 'hidden'
                        },
                        lable = $("<label></label>").text(_text).css(css).click(function () {
                            var _this = $(this);
                            _this.fadeOut(100, function () {
                                _this.prev().focus();
                            });
                        });
                    _this.after(lable);
                }).focus(function () {
                    var _this = $(this),
                        _label = _this.next('label');
                    _label.hide();
                }).blur(function () {
                    var _this = $(this),
                        _label = _this.next('label');
                    if (!_this.val()) _label.show();
                }).bind("setValue", function () {
                    var _this = $(this),
                        _label = _this.next('label');
                    _label.hide();
                });
            }
        }
    });
})(jQuery);