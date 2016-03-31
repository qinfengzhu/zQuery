/*
* the initail mod imgTips
* @Author:      dingyantao
* @CreateDate:  2014-05-19
*/
(function ($) {
	var ImgHtml = '<div class="intro_img"><img src="${src}"/></div>',
		ImgTipsControl = function(pObj){
			$.extend(this, {
				imgSrc:null,
				view:null,
				timer:null
			});
			this.target = pObj;
			this.init();
		}
	ImgTipsControl.prototype = {
		init:function(){
			this.setOption();
			this.bindEvent();
		},setOption:function(){			
            this.isCreate = true;
		},bindEvent:function(){
			var _this = this;
			this.target.bind("mousemove",function(e){
				if(_this.isCreate){
					_this.isCreate = false;
	            	_this.createHtml();
	            	_this.setPostion(e);
	            }else{
	            	_this.setPostion(e);
	            }
	            clearTimeout(_this.timer);
            });
            this.target.bind("mouseout",function(e){
            	_this.timer = setTimeout(function() {
            		_this.clearHtml();
            	},50);
            });
		},createHtml:function(){
			this.imgSrc = this.target.attr("src");
			this.view = $($.template.render(ImgHtml,{ src:this.imgSrc }));
    		$$.container.append(this.view);
    		this.view.cover();    		
		},clearHtml:function(){
			this.view.uncover();
			this.view.remove();
			this.isCreate = true;
		},setPostion:function(pEvent){
			var _scrollTop,_scrollLeft;
			if (document.documentElement && document.documentElement.scrollTop) {
				_scrollLeft = document.documentElement.scrollLeft;
                _scrollTop = document.documentElement.scrollTop;                
            } else if (document.body) {
            	_scrollLeft = document.body.scrollLeft;
                _scrollTop = document.body.scrollTop;
            }
			var _offset = {
				left:pEvent.clientX + _scrollLeft,
				top:pEvent.clientY + _scrollTop
			}
    		var _winW = $(window).width(),
    			_left = 0;
    		if(this.view.find("img").width() + _offset.left > _winW){
    			_left = _offset.left - this.view.find("img").width() - 10;
    		}else{
    			_left = _offset.left + 10;
    		}
    		this.view.css("position", "absolute").css({ left:_left,top:_offset.top + 10 });
    	}
	}
    $.fn.extend({
        ImgTips: function () {
            this.each(function () {
                new ImgTipsControl($(this));
            });
        }
    });
})(jQuery);