/*
* the initail mod welter
* @Author:      dingyantao
* @CreateDate:  2013-11-22
*/
(function ($, undefined) {
    var WelterControl = function (pObj, pOpts) {
        pOpts = $.extend({
        	tagName:{
        		panel:"ul",
        		items:"ul>li",
        		btnPre:".pre",
        		btnNext:".next"
        	},
        	panel:null,
        	items: null,
        	btnPre: null,
        	btnNext: null,
		   	itemOtherWidth:0,
		   	length:0,
		   	moveLength:1,
		   	minLength:5,
		   	index: 0,
            locationIndex:0,
		   	type:false,
		   	arrows:true,
		   	speed:400,
		   	enabledClassName:["enable","enable"]
        }, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    }
    WelterControl.prototype = {
        init: function (pOpts) {
            this.setOptions(pOpts);
            this.SetStyle();
            this.bindEvent();
        },
        setOptions:function(pOpts){
            $.extend(this,pOpts);
            for (var _key in this.tagName){
            	this[_key] = this.target.find(this.tagName[_key]);
            }
            this.length = this.items.length;
            if (this.type && this.length > 0) {
                this.panel.width(this.length * (this.items[0].clientWidth + this.itemOtherWidth) + "px");
            }
            if(this.IsOverBorder(this.locationIndex * this.moveLength)){
                this.index = this.locationIndex * this.moveLength;
                if (this.type){
                    var _ml = (-1 * this.getScrollWidth());
                    this.panel.css({ marginLeft:_ml + "px" });
                }
                else {
                    var _mt = (-1 * this.getScrollHeight());
                    this.panel.css({ marginTop:_mt + "px" });
                }
                this.SetStyle();
            }
        },
        bindEvent: function () {
        	var _this = this;
        	this.btnPre.bind("click", function () {
            	if($(this).hasClass(_this.enabledClassName[0])) return;
                _this.Switch(-1);
            });
            this.btnNext.bind("click", function () {
            	if($(this).hasClass(_this.enabledClassName[1])) return;
                _this.Switch(1);
            });
        },
        SetStyle : function () {
        	if(!this.arrows){
        		if (this.index + this.minLength >= this.length) this.btnNext.hide();
                else this.btnNext.show();
                if (this.index == 0) this.btnPre.hide();
                else this.btnPre.show();
        	}else{
        		if (this.index + this.minLength >= this.length) this.btnNext.addClass(this.enabledClassName[1]);
                else this.btnNext.removeClass(this.enabledClassName[1]);
                if (this.index == 0) this.btnPre.addClass(this.enabledClassName[0]);
                else this.btnPre.removeClass(this.enabledClassName[0]);
        	}		                
        },
        Switch : function (arrow) {
            var newIndex = this.index + (arrow > 0 ? this.moveLength : -1 * this.moveLength);
            if (this.IsOverBorder(newIndex)) {
                this.index = newIndex;
                if (this.type){
                	var _ml = (-1 * this.getScrollWidth()),
                		_m =  _ml + (20 * arrow);
                	this.panel.animate({ marginLeft:_m + "px"},this.speed).animate({ marginLeft:_ml + "px" },this.speed);
                }
                else {
                	var _mt = (-1 * this.getScrollHeight()),
                		_m =  _mt + (20 * arrow);
                	this.panel.animate({ marginTop:_mt + "px" },this.speed);
                }
                this.SetStyle();
            }
        },
        IsOverBorder : function (currentIndex) {
            return (currentIndex >= 0 && currentIndex < this.length);
        },
        getScrollWidth : function () {
            var w = 0;
            for (var i = 0, l = this.index; i < l; i++) {
                w += this.items[i].clientWidth + this.itemOtherWidth;
            }
            return w;
        },
        getScrollHeight : function(){
        	var w = 0;
            for (var i = 0, l = this.index; i < l; i++) {
                w += this.items[i].clientHeight + this.itemOtherWidth;
            }
            return w;
        }
    }
    $.fn.extend({
        Welter: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            WelterControl["instance"] = new WelterControl(this, _defaults);
            return WelterControl["instance"];
        }
    });
})(jQuery);