/*
* the initail mod countDown
* @Author:      dingyantao
* @CreateDate:  2014-11-11
*/
(function ($, undefined) {
    var CountDownControl = function (pOpts) {
        this.opts = {
            nowDate: null,       //当前系统时间
            startDate: null,     //开始时间
            endDate: null,       //关闭时间
            onStart: null,       //开始倒计时回调
            onStartTime: null,   //每秒回调function(time),格式[1(天数),0,1(小时),3,1(分钟),4,1(秒)]
            onFirstEnd: null,    //第一次进入关闭倒计时回调
            onEnd: null,         //结束倒计时回调
            onEndTime: null,     //同onStartTime
            urlNowDate: null     //请求当前系统时间
        };
        $.extend(true, this.opts, pOpts);
        this.init();
    }
    CountDownControl.prototype = {
        init: function () {
            this.marginDate = (new Date()).getTime() - this.getDate(this.opts.nowDate).getTime();
            this.initFormatTime();
            this.timeGo();
        }, initFormatTime: function () {
            var _nowDate = this.getDate(this.opts.nowDate).getTime();
            this.sDate = this.getDate(this.opts.startDate).getTime();
            this.eDate = this.getDate(this.opts.endDate).getTime();
            this.countDonwtime = {};
            this.countDonwtime.start = this.sDate - _nowDate;
            this.countDonwtime.end = this.eDate - _nowDate;
            this.isFirstEnd = true;
        }, initMarginDate: function () {
            var _n = new Date().getTime();
            this.countDonwtime.start = this.sDate - (_n - this.marginDate);
            this.countDonwtime.end = this.eDate - (_n - this.marginDate);
        }, getDate: function (pDate) {
            var _d = pDate.split(" ");
            _d2 = _d[0],
                _time = _d[1].split(":"),
                _h = _time[0],
                _m = _time[1],
                _s = _time[2],
                _ms = _time[3];
            var _returnDate = new Date(_d2);
            _returnDate.setHours(_h);
            _returnDate.setMinutes(_m);
            _returnDate.setSeconds(_s);
            _returnDate.setMilliseconds(_ms);
            return _returnDate;
        }, timeGo: function () {
            if (this.countDonwtime.start > 0) {
                $.type(this.opts.onStart) === "function" && this.opts.onStart.call(null, this.countDonwtime.start);
            }
            var _this = this;
            this.timer = setInterval(function () {
                _this.initMarginDate();
                //_this.timer = setTimeout(arguments.callee, 1000);
                _this.play();
            }, 1000);
            this.play();
        }, setTime: function (pTime, pCallBack) {
            var _d = Math.floor(pTime / (1000 * 60 * 60 * 24)),
                _h = Math.floor(pTime / (1000 * 60 * 60) % 24),
                _m = Math.floor(pTime / (1000 * 60) % 60),
                _s = Math.floor(pTime / 1000 % 60),
                //_ms = Math.floor(pTime % 1000 / 100),
                _list = [],
                _timeList = [_h, _m, _s];
            if (parseInt(_d) < 10) {
                _list.push(0);
                _list.push(_d);
            } else {
                _list.push(_d);
            }
            for (var key in _timeList) {
                var item = _timeList[key];
                if (parseInt(item) < 10) {
                    _list.push(0);
                    _list.push(item);
                } else {
                    var t = (item + "").split("");
                    _list.push(t[0]);
                    _list.push(t[1]);
                }
            }
            //pTime -= 1000;
            $.type(pCallBack) === "function" && pCallBack.call(null, _list, pTime);
            return pTime;
        }, play: function () {
            if (this.countDonwtime.start > 0 && this.countDonwtime.start < (1000 * 60 * 60 * 24 * 10)) {
                this.countDonwtime.start = this.setTime(this.countDonwtime.start, this.opts.onStartTime);
                //this.countDonwtime.end -= 1000;
            } else {//剩余时间
                if (this.countDonwtime.end < 0 || this.countDonwtime.end > (1000 * 60 * 60 * 24 * 10)) {
                    clearInterval(this.timer);
                    $.type(this.opts.onEnd) === "function" && this.opts.onEnd.call(null);
                    return;
                }
                if (this.isFirstEnd) {
                    this.isFirstEnd = false;
                    $.type(this.opts.onFirstEnd) === "function" && this.opts.onFirstEnd.call(null);
                }
                this.countDonwtime.end = this.setTime(this.countDonwtime.end, this.opts.onEndTime);
            }
        }, stop: function () {
            clearInterval(this.timer);
        }
    };
    $.extend({
        CountDown: function (pOpts) {
            var _defult = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defult, pOpts);
            }
            return new CountDownControl(_defult);
        }
    });
})(jQuery);