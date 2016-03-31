/*
* the initail mod alert
* @Author:      dingyantao
* @CreateDate:  2014-10-28
*/
(function ($, undefined) {
	var TypeClass = { defaultType:"",ok:"",waring:"icon-exclamation-sign",error:"icon-remove-sign" };
	var AlertControl = function(pOpts){
		this.opts = {
			title:"",
            content:"",
            type:"default",	//默认default常规 ok成功 waring警告 error错误
            btnModule:[],
            /*
            {
                title:"修改",           //按钮文本
                className:"orangebtn",  //按钮样式 蓝色 bluebtn 灰色 graybtn 橘色 orangebtn
                isClose:true 			//是否关闭窗口 默认true
                isDisable:false,        //默认false 不禁用
                iClass:"icon-pencil",   //图标样式
                onChange:null           //回调按钮事件
            }
            */
            template:'\
        	<section class="mask small">\
			    <div class="close"><a href="javascript:"><i class="icon-remove"></i></a></div>\
			    <div class="txts"><i class="<$= GlobalData.typeClass $>"></i><$= GlobalData.content $></div>\
			    <div class="btn">\
			    	<$ for(var i = 0,l = GlobalData.btnModule.length;i < l;i++){\
			    		var item = GlobalData.btnModule[i]; $>\
			    	<a href="javascript:" class="<$= item.className $>"><$= item.title $></a>\
			    	<$ } $>\
			    </div>\
			</section>',
            onClose:null
		}
		$.extend(true, this.opts, pOpts);
		this.init();
	}
	AlertControl.prototype = {
		init:function(){
			this.formatBtnModule();
			this.createHtml();
			this.bindEvent();
		},bindEvent:function(){
			var _this = this;
			this.alertPanel.find(".close>a").on("click",function(){
				_this.alertPanel.unmask();
				_this.alertPanel.remove();
				if (_this.opts.onClose && $.type(_this.opts.onClose) === "function") {
				    _this.opts.onClose.call(null);
				}
			});
			this.alertPanel.find(".btn>a").on("click",function(){
				var $this = $(this),
					_i = $this.index(),
					_btn = _this.opts.btnModule[_i];
				if(_btn.isDisable) return;
				if(_btn.isClose){
					_this.alertPanel.unmask();
					_this.alertPanel.remove();
				}
				if(_btn.onChange && $.type(_btn.onChange) === "function"){
					_btn.onChange.call(null);
				}
			});
		},formatBtnModule:function(){
			var _mods = [];
            for(var i = 0,l = this.opts.btnModule.length;i < l;i++){
                var _mod = $.extend({
                    className:"orangebtn",
                    isClose:true,
                    isDisable:false
                },this.opts.btnModule[i],true);
                _mods.push(_mod);
            }
            this.opts.btnModule = _mods;
            this.opts.typeClass = TypeClass[this.opts.type];
		},createHtml:function(){
			this.alertPanel = $($.template.replace(this.opts.template,this.opts));
			$$.container.append(this.alertPanel);
			this.alertPanel.mask();
		}
	}
    $.extend({
        Alert: function (pOpts) {
            var _defult={};
            if (typeof pOpts !== "undefined") {
               $.extend(true, _defult, pOpts);
            }
            new AlertControl(_defult);
        }
    });
    //信息提示框，可以回调 例子：$.Alert("添加成功",function(){…});
    $$.Alert = function(pContent,pCallback){
    	var opt = { 
    		content:pContent,
    		btnModule:[{
    			title:"确定",onChange:pCallback
    		}]
    	};
    	$.Alert(opt);
    }
    //确认对话框，可以回调 例子：$$.Confirm("你是否确认删除？",function(){…},function(){…});
    $$.Confirm = function(pContent,pOkCallback,pCancelCallback){
    	var opt = { 
    		content:pContent,
    		type:"waring",
    		btnModule:[
    			{
    				title:"确定",onChange:pOkCallback
    			},{
    				title:"取消",className:"graybtn",onChange:pCancelCallback
    			}
    		]
    	};
    	$.Alert(opt);
    }
})(jQuery);