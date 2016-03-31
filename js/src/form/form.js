/*
* the initail mod form
* @Author:      dingyantao
* @CreateDate:  2014-09-22
*/
(function ($) {
	var FromControl = function(pObj,pOpts) {
		$.extend(this,{
			paramList:null,
			params:null
		},pOpts);
		this.target = $(pObj);
		this.init();
	}
	FromControl.prototype = {
		init:function () {
			this.setOptions();
			this.bindEvent();
		},setOptions:function(){
			this.formatParams();
		},bindEvent:function(){

		},getData:function(){
			var _obj = {};
			for(var key in this.params){
				_obj[key] = this.params[key].getVal();
			}
			return _obj;
		},setData:function(pJson){
			for(var key in this.params){
				this.params[key].setVal(pJson[key]);
			}
		},formatParams:function(){
			if(this.paramList === null){
				var _domList = this.target.find("[data-from]"),
					_keyList = [];
				_domList.each(function(index,dom){
					
				});
			}
		}
	}
	$.fn.extend({
        From: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            FromControl["instance"] = new FromControl(this, _defaults);
            return FromControl["instance"];
        }
    });
})(jQuery);