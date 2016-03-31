/*
* the initail mod reset
* @Author:      dingyantao
* @CreateDate:  2014-12-4
*/
(function ($) {
    var ResetControl = function (pTask) {
		var _task = pTask || [],
            _isLock = false,            
            bindEvent = function(){
            	var me = this;
                $(window).bind('resize.reset', function (event) {
                    fire.call(me);
                    if (_task.length === 0) {
                        $(window).unbind('resize.reset', arguments.callee);
                    }
                });
            }, fire = function () {
                    //当前页面可见高度
                var _iHeight = Math.min(window.innerHeight, document.documentElement.clientHeight),
                    //页面整体高度
                    _wHeight = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight),
                    //页面整体实际高度
                    _bHeight = document.body.offsetHeight,
                    _resetHeight = 0;
                if (_iHeight > _bHeight) {
                    //当前页面可见高度 - 页面整体实际高度
                    _resetHeight = _iHeight - _bHeight;
                } else {
                    //当前页面可见高度 - 页面整体高度
                    _resetHeight = _iHeight - _wHeight;
                }
                _resetHeight = _resetHeight - 1;
            	for(var i = 0,l = _task.length;i < l;i++){
            	    var _h = _task[i][0].offsetHeight;
            	    _h = (_h + _resetHeight) < 200 ? 200 : (_h + _resetHeight);
            	    _task[i].css("height", _h + "px");
            	}
            }
		this.push = function(pItem){
			_task.push(pItem);
		}
		this.init = function(){
			setTimeout(function () {
                fire();
                bindEvent();
            }, 100);
		}
	}
	$$.Reset = ResetControl;
})(jQuery);