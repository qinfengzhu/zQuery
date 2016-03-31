/*
* the initail mod lazyLoad
* @Author:      dingyantao
* @CreateDate:  2013-10-12
*/

/*
瀑布分屏加载
*/
(function ($) {
    var lazyLoad = {
        Task: function (pTask) {
            var _task = pTask || [],
                _isLock = false,
            /*
            * 整页绑定事件
            */
                bind = function () {
                    var me = this;
                    $(window).bind('scroll', function (event) {
                        fire.call(me);
                        if (_task.length === 0) {
                            $(window).unbind('scroll', arguments.callee);
                        }
                    });
                    $(window).bind('resize', function (event) {
                        fire.call(me);
                        if (_task.length === 0) {
                            $(window).unbind('resize', arguments.callee);
                        }
                    });
                },
                fire = function () {
                    var me = this;
                    if (!_isLock && _task.length > 0 && _task[0].when()) {
                        _isLock = true;
                        if (_task[0].isAsync) {
                            _task.shift().func(function () {
                                _isLock = false;
                                fire.call(me);
                            });
                        } else {
                            _task.shift().func();
                            _isLock = false;
                            fire.call(me);
                        }
                    }
                };
            this.push = function (pItem) {
                _task.push(pItem);
            };
            this.unshift = function (pItem) {
                _task.unshift(pItem);
            };
            this.init = function () {
                setTimeout(function () {
                    fire();
                    bind();
                }, 100);
            };
        },
        img: function (pNeedUnBind) {

        }
    };
    lazyLoad.Task.prototype = {
        ByDomTop: function (pDom, pFunc, pPlus, pIsAsync) {
            this.when = function () {
                return $(document).scrollTop() + $(window).height() + (pPlus || 0) > pDom.position().top;
            };
            this.isAsync = pIsAsync;
            this.func = pFunc;
        },
        ByPos: function (pPos, pFunc) {
            this.when = function () {
                return $(document).scrollTop() + $(window).height() > pPos;
            };
            this.func = pFunc;
        },
        ByScroll: function (pFunc, pPlus) {
            this.when = function () {
                return $(document).scrollTop() + $(window).height() > $(document).height() - (pPlus || 0);
            };
            this.func = pFunc;
        }
    }
    window.lazyLoad = lazyLoad;
})(jQuery);