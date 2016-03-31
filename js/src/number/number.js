/*
* the initail mod number
* @Author:      dingyantao
* @CreateDate:  2014-01-02
*/
(function ($, undefined) {
    var NumberControl = function (pObj, pOpts) {
        pOpts = $.extend({
            tagName: {
                text: ">input",
                btnPre: ".mod_number_pre",
                btnNext: ".mod_number_next"
            },
            text: null,
            btnPre: null,
            btnNext: null,
            min: 0,
            max: 10,
            value: null,
            type: true,  //方向 增加或减少
            timer: null, //计时器
            speed: 100,  //频率
            enabledClassName: ["enable", "enable"],
            hasClassName: "havecs",
            onChange:null
        }, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    }
    NumberControl.prototype = {
        init: function (pOpts) {
            this.setOptions(pOpts);
            this.bindEvent();
        },
        setOptions: function (pOpts) {
            $.extend(this, pOpts);
            this.max = this.target.data("max") || this.max;
            for (var key in this.tagName) {
                this[key] = this.target.find(this.tagName[key]);
            }
            if (this.text.val() != "") {
                this.value = ~ ~this.text.val();
            } else {
                this.value = this.min;
            }
            this.setValue();
        },
        bindEvent: function () {
            var _this = this;
            this.btnPre.bind("mousedown", function () {
                if (_this.value <= _this.min) return;
                _this.value--;
                _this.type = false;
                _this.setValue();
            });
            this.btnNext.bind("mousedown", function () {
                if (_this.value >= _this.max) return;
                _this.value++;
                _this.type = true;
                _this.setValue();
            });
            this.btnPre.bind("mouseup", function () {
                _this.stop();
            });
            this.btnNext.bind("mouseup", function () {
                _this.stop();
            });
            this.text.bind("blur",function(){
                var _val = _this.text.val();
                if(/\D/g.test(_val)) {
                    _this.value = _this.min; 
                }else{
                    if(~~_val > _this.max){
                        _this.value = _this.max;
                    }else if(~~_val < _this.min){
                        _this.value = _this.min;
                    }else{
                        _this.value = ~ ~_val;
                    }
                }
                _this.setValue();
            });
        },
        setMin: function (pNum) {
            this.min = pNum;
            this.value = pNum;
            this.setValue();
        },
        setMax: function (pNum) {
            this.max = pNum;
            this.value = Math.min(this.value, this.max);
            this.setValue();
        },
        setValue: function () {
            this.text.val(this.value);
            this.setStyle();
            if($.type(this.onChange) === "function"){
                this.onChange.call(null,this.value);
            }
        },
        setStyle: function () {
            if (this.value >= this.max) this.btnNext.addClass(this.enabledClassName[1]);
            else this.btnNext.removeClass(this.enabledClassName[1]);
            if (this.value <= this.min) this.btnPre.addClass(this.enabledClassName[0]);
            else this.btnPre.removeClass(this.enabledClassName[0]);
            if(this.value > 0) this.text.addClass(this.hasClassName);
            else this.text.removeClass(this.hasClassName);
        },
        timeMeter: function () {
            var _this = this;
            if (!this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(function () {
                var _val = _this.value + (_this.type ? 1 : -1);
                if (_val < _this.min || _val > _this.max) {
                    _this.stop();
                    return;
                }
                _this.value = _val;
                _this.setValue();
            }, this.speed);
        },
        stop: function () {
            clearInterval(this.timer);
        }
    }
    $.fn.extend({
        Number: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            NumberControl["instance"] = new NumberControl(this, _defaults);
            return NumberControl["instance"];
        }
    });
})(jQuery);