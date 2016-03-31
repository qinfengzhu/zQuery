/*
 * the initail mod calendar
 * @Author:      dingyantao
 * @CreateDate:  2013-5-7
 */
;(function ($, undefined) {
    var STYLE_CALENDAR = null;
    /**
    * dateFormat internal
    * @param {string} date 需要格式化的日期字符串
    * @param {string} mask 格式类型 默认[default:ddd mmm dd yyyy HH:MM:ss] 可选yyyy-mm-dd等
    * @param {bool} utc 协调世界时 mask存在UTC:或者为true时按utc取
    * @return {string} 格式化后的日期字符串 
    */
    var dateFormat = function(){
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };
        return function (date, mask, utc) {
			var dF = dateFormat;
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}
			date = date ? new Date(date) : new Date;
			mask = String(dF.masks[mask] || mask || dF.masks["default"]);
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}
			var _ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d: d,
					dd: pad(d),
					ddd: dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m: m + 1,
					mm: pad(m + 1),
					mmm: dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy: String(y).slice(2),
					yyyy: y,
					h: H % 12 || 12,
					hh: pad(H % 12 || 12),
					H: H,
					HH: pad(H),
					M: M,
					MM: pad(M),
					s: s,
					ss: pad(s),
					l: pad(L, 3),
					L: pad(L > 99 ? Math.round(L / 10) : L),
					t: H < 12 ? "a" : "p",
					tt: H < 12 ? "am" : "pm",
					T: H < 12 ? "A" : "P",
					TT: H < 12 ? "AM" : "PM",
					Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};
			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
    }();
    dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };
    Date.prototype.format=function(mask,utc){
        return dateFormat(this,mask, utc);
    };
    String.prototype.toInt = function(){
        return ~ ~this;
    };
    String.prototype.isMonth = function(){
        var a = this.match(/^(\d{4})-(\d{1,2})$/);
        if(a){
            var y=a[1].toInt(),m=a[2].toInt()-1,d=1,
                _date = new Date(y,m,d);
            if(_date.getFullYear() == y && _data.getMonth() == m) return true
        }
        return false
    };
    String.prototype.isDate = function (){
        var a=this.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if(a){var b=a[1].toInt(),c=a[2].toInt()-1,a=a[3].toInt(),d=new Date(b,c,a);
        if(d.getFullYear()==b&&d.getMonth()==c&&d.getDate()==a)return true}return false
    };
    String.prototype.toDate = function (){
        var a=this.match(/^(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2}:\d{1,2}(\.\d+)?)?$/);
        if(a){var b=a[1].toInt(),c=a[2].toInt()-1,a=a[3].toInt(),d=new Date(b,c,a);
        if(d.getFullYear()==b&&d.getMonth()==c&&d.getDate()==a)return d}return null
    }
    String.prototype.replaceWith = function (d) {
		return this.replace(/\{\$(\w+)\}/g, function (a, c) {
			if (c in d) {
				return d[c];
			} else {
				return a;
			}
		});
	};
    String.prototype.pad = function () {
        var year = 0,month = 0,day = 0,today = "",
            times = this.split("-");
        var myyear = parseInt(times[0], 10),
            mymonth = parseInt(times[1], 10),
            myday = parseInt(times[2], 10);
        year = (myyear > 200) ? myyear : 1900 + myyear;
        month = (mymonth >= 10) ? mymonth : "0" + mymonth;
        day = (myday >= 10) ? myday : "0" + myday;
        today = year + '-' + month + '-' + day;
        return today;
    };
    if(!Array.prototype.forEach){
        Array.prototype.forEach = function(fun, thisp){
            var len = this.length;
            if (typeof fun != "function") throw new TypeError();
            var thisp = arguments[1];
            for (var i = 0; i < len; i++){
                if (i in this) fun.call(thisp, this[i], i, this);
            }
        };
    }
    if (!Function.prototype.bind) {
      Function.prototype.bind = function (pThis) {
        if (typeof this !== "function") {
          $.error("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, 
            fNOP = function () {},
            fBound = function () {
              return fToBind.apply(this instanceof fNOP && pThis
                     ? this
                     : pThis || window,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
      };
    }
    var OtherCalendar = function(pObj,pOpts) {
        this.opts = {
            date: new Date(),
            type:"week",        //week周 month月 year年 day日
            minDate:null,
            maxDate:null,
            startDate:null,
            endDate:null,
            template: {
                head: '<div class="calendar_title"><button class="{$type}"></button>{$data}</div>',
                shead: '<div class="calendar_title"><button class="{$typel}"></button>{$data}<button class="{$typer}"></button></div>',
                bodyDay: '<dl class="calendar_day"><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt class="weekend">六</dt><dt class="weekend">日</dt><dd>{$dates}</dd></dl>',
                bodyWeek:  '<dl class="calendar_day"><dt class="week">周</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt class="weekend">六</dt><dt class="weekend">日</dt><dd>{$dates}</dd></dl>',
                bodyMonth:'<dl class="calendar_month"><dd>{$dates}</dd></dl>',
                foot: '',
                week:'<a href="javascript:" {$id} {$Class} {$Style}>{$week}</a>',
                day: '<a href="javascript:" {$id} {$Class} {$Style}>{$day}</a>',
                month:'<a href="javascript:" {$id} {$Class} {$Style}>{$month}</a>',
                festival: '<span class="c_day_festival">{$day}</span>'
            },
            classNames: {
                select: "select",
                nothismonth: "day_over",
                blankdate: 'day_no',
                today: "today",
                tomorrow: "",
                aftertomorrow: "",
                none: "none",
                type: "left"
            },
            tagName:{
                prevOrNextBtn:"button",
                month:"a",
                day:"a",
                week:"a"
            },
            typeList: { "calendar_prev": -1, "calendar_next": 1 },
            listeners:{
                onBeforeShow:null,
                onShow:null,
                onChange:null
            },
            container:null
        }
        $.extend(true, this.opts, pOpts);
        $.extend(this,this.opts);
        this.target = $(pObj);
        this.init();
        this.initialize();
    }
    OtherCalendar.prototype = {
        init: function () {
            this.createEl();
        },initialize: function () {
            this.setOptions();
            this.bindEvent();
        },setOptions: function () {
            
        },bindEvent: function(){
            var _this = this;
            this.target.bind("click",function(){
                _this.render(_this.formatDate());
                _this.setPosition();
            });
            this.target.bind("blur",function(){
                _this.hide();
            });
            this.panel.bind("mousedown",function(e){
                var tag = e.target,
                    _tag = $(tag);
                if(tag.tagName == _this.tagName.prevOrNextBtn.toUpperCase()){
                    var hasClass = false;
                    for (var b in _this.typeList) {
                        if (_tag.hasClass(b)) {
                            hasClass = true;
                            break;
                        }
                    }
                    if(hasClass){
                        _this.change(_this.typeList[tag.className]);
                        return false;
                    }
                }
                tag = (tag.tagName == _this.tagName.day.toUpperCase() ?
                    tag :
                    _tag.parents(_this.tagName.day)[0]);
                if(tag){
                    _this.clickEvent(tag);
                    return false;
                }
                return false;
            });
        },change:function(pNum){
            var _date = null;
            switch(this.type){
                case "day":
                case "week":
                    this.changeMonth += pNum;
                    _date = new Date(this.changeYear, this.changeMonth, 1);
                break;
                case "month":
                    this.changeYear += pNum;
                    _date = new Date(this.changeYear, this.changeMonth, 1);
                break;
                case "year":
                break;
            }            
            this.render(_date);
        },clickEvent:function(pDom){
            if (!$(pDom).hasClass(this.classNames.nothismonth)) {
                var _val = $(pDom).data("val"),
                    _date = $(pDom).data("date");
                switch(this.type){
                    case "day":
                    case "week":
                    case "month":
                    this.target.data(this.type,_date).val(_val);
                    this.target.blur();
                    break;
                    case "year":
                    break;
                }
                if($.type(this.listeners.onChange) === "function"){
                    this.listeners.onChange.call(null,_date,_val,pDom);
                }
            }
        },formatDate:function(){
            var _date = this.target.data(this.type),
                _returnDate = null;
            if(_date){
                if(this.type == "day"){
                    this.currentDate = _date;
                    _returnDate = this.currentDate.toDate();
                    this.changeYear = this.yearDate = _returnDate.getFullYear();
                    this.changeMonth = this.monthDate = _returnDate.getMonth();
                }else{
                    var _dates = _date.split(",");
                    this.startDate = _dates[0];
                    this.endDate = _dates[1];
                    _returnDate = this.startDate.toDate();
                    this.changeYear = this.yearDate = _returnDate.getFullYear();
                    this.changeMonth = this.monthDate = _returnDate.getMonth();
                    this.weekDate = this.getWeek(_returnDate);
                }                
            }else{
                this.changeYear = this.yearDate = this.date.getFullYear();
                this.changeMonth = this.monthDate = this.date.getMonth();
            }
            return _returnDate || this.date;
        },createEl:function(){
            this.panel = $("<div class=\"otherCalendar\"></div>");
            this.panel.appendTo(this.container || $$.container);
        },render:function(pData){
            this.panel.html("");
            this.panel.append(this.createHead(pData));
            this.panel.append(this.createBody(pData));
            this.panel.show();
        },setPosition: function () {
            var offset = this.target.offset();
                offset.top += this.target[0].offsetHeight;
            this.panel.offset(offset);
            this.panel.cover();
            $.type(this.listeners.onShow) === "function" && this.listeners.onShow.call(this);
        },createHead:function(pData){
            switch(this.type){
                case "day":
                case "week":
                return this.template.shead.replaceWith({
                    typel:"calendar_prev",
                    typer:"calendar_next",
                    data: pData.getFullYear() + "年" + (pData.getMonth() + 1) + "月"
                });
                break;
                case "month":
                return this.template.shead.replaceWith({
                    typel:"calendar_prev",
                    typer:"calendar_next",
                    data: pData.getFullYear() + "年"
                });
                break;
                case "year":
                break;
            }
        },createBody:function(pData){
            var _year = pData.getFullYear(),
                _month = pData.getMonth(),
                _week = null,
                _maxWeek = null,
                weekClass = "",
                tempWeek = null,
                tempData = null;
            switch(this.type){
                case "day":
                var _beginDay = new Date(_year, _month, 1).getDay() - 1,
                    _nDays = new Date(_year,_month + 1, 0).getDate() + 1, 
                    _dates = [];
                for (var i = 1; i < 43; i++) {
                    var tempDate = new Date(_year,_month,(i - _beginDay)),
                        tempClass = this.getClass(tempDate);
                        tempData = ["data-date=\"",tempDate.format("yyyy-mm-dd"),"\" data-val=\"",tempDate.format("yyyy-mm-dd"),"\""].join('');
                    if (i > _beginDay && i < _nDays + _beginDay) {//当前月
                        tempClass = this.currentDate == tempDate.format("yyyy-mm-dd") ? tempClass + " " + this.classNames.select : tempClass;
                        tempClass = this.date.format("yyyy-mm-dd") == tempDate.format("yyyy-mm-dd") ? tempClass + " " + this.classNames.today : tempClass;
                        _dates.push(this.template.day.replaceWith({
                            id:tempData,
                            Class: ["class=\"", tempClass, "\""].join(''),
                            Style:"",
                            day:i - _beginDay
                        }));
                    }else if(i > _nDays){//下月
                        _dates.push(this.template.day.replaceWith({
                            id:"",
                            Class:["class=\"",this.classNames.nothismonth,"\""].join(''),
                            Style:"",
                            day:""
                        }));
                    }else{//上月
                        _dates.push(this.template.day.replaceWith({
                            id:"",
                            Class:["class=\"",this.classNames.nothismonth,"\""].join(''),
                            Style:"",
                            day:""
                        }));
                    }
                };
                return this.template.bodyDay.replaceWith({dates:_dates.join('')});
                break;
                case "week":
                var _beginDay = new Date(_year, _month, 1).getDay() - 1,
                    _nDays = new Date(_year,_month + 1, 0).getDate() + 1, 
                    _dates = [];
                for (var i = 1; i < 43; i++) {
                    var tempDate = new Date(_year,_month,
                        (i - _beginDay)
                    ),
                    tempClass = this.getClass(tempDate);
                    if(i % 7 == 1){
                        tempWeek = this.getWeek(tempDate);
                        weekClass = this.weekDate != null ? (this.weekDate.week == tempWeek.week ? this.classNames.select : "" ) : "";
                        tempData = ["data-date=\"",tempWeek.date.join(','),"\" data-val=\"",tempWeek.year,"年第",tempWeek.week,"周\""].join('');
                        _dates.push(this.template.week.replaceWith({
                            id:tempData,
                            Class: ["class=\"week ", weekClass, " ", tempClass, "\""].join(''),
                            Style:"",
                            week:tempWeek.week
                        }));
                    }
                    if (i > _beginDay && i < _nDays + _beginDay) {//当前月
                        _dates.push(this.template.day.replaceWith({
                            id:tempData,
                            Class: ["class=\"", weekClass, " ", tempClass, "\""].join(''),
                            Style:"",
                            day:i - _beginDay
                        }));
                    }else if(i > _nDays){//下月
                        _dates.push(this.template.day.replaceWith({
                            id:"",
                            Class:["class=\"",this.classNames.nothismonth,"\""].join(''),
                            Style:"",
                            day:""
                        }));
                    }else{//上月
                        _dates.push(this.template.day.replaceWith({
                            id:"",
                            Class:["class=\"",this.classNames.nothismonth,"\""].join(''),
                            Style:"",
                            day:""
                        }));
                    }
                };
                return this.template.bodyWeek.replaceWith({dates:_dates.join('')});
                break;
                case "month":
                var _dates = [];
                for (var i = 0; i < 12; i++) {
                    var tempClass = this.getClass(new Date(_year, i, 1));
                    var _class = (this.yearDate == _year && this.monthDate == i) ? this.classNames.select : "";
                    var _date = this.template.month.replaceWith({
                        id:["data-date=\"",new Date(_year,i,1).format("yyyy-mm-dd"),"\"","data-val=\"",_year,"年",i + 1,"月\""].join(''),
                        Class: ["class=\"", _class, " ", tempClass, "\""].join(''),
                        Style:"",
                        month:(i + 1) + "月"
                    });
                    _dates.push(_date);
                }
                return this.template.bodyMonth.replaceWith({dates:_dates.join('')});
                break;
                case "year":
                break;
            }
        },getWeek:function(pData){
            if (pData) {
                var _d = pData.format("yyyy-mm-dd").toDate();
                var _date = [],
                    _week = 0,
                    _year = _d.getFullYear(),
                    _oneDay = new Date(_year,0,1),
                    _day = _oneDay.getDay(),
                    _dayNumber = (_d.getTime() - _oneDay.getTime()) / 1000 / 60 / 60 / 24,
                    _weekNumber = ~~((_dayNumber  + _day - 1) / 7) + 1;
                _week = _weekNumber > 52 ? 1 : _weekNumber;
                _year = _weekNumber > 52 ? _year + 1 : _year;
                _date.push(_d.format("yyyy-mm-dd"));
                _d.setDate(_d.getDate() + 6);
                var _mDate = _d,
                    _maxDate = this.maxDate != null ? this.strToDate(this.maxDate.pad()) : null;
                if(_maxDate && _mDate.getTime() > _maxDate.getTime()){                    
                    _date.push(this.maxDate);
                }else{
                    _date.push(_mDate.format("yyyy-mm-dd"));
                }
                return {
                    week:_week,
                    year:_year,
                    date:_date
                }
            }
        },getClass:function(pData){
            var returnValue = "",
                minDate = this.minDate,
                maxDate = this.maxDate;
            if(minDate) minDate = minDate.pad();
            if(maxDate) maxDate = maxDate.pad();
            if (minDate && this.strToDate(pData.format("yyyy-mm-dd")) < this.strToDate(minDate)) {
                returnValue = this.classNames.nothismonth;
            }
            if (maxDate && this.strToDate(pData.format("yyyy-mm-dd")) > this.strToDate(maxDate)) {
                returnValue = this.classNames.nothismonth;
            }
            return returnValue;
        },strToDate: function (str) {
            if (str) {
                return str.toDate();
            }
        },hide:function(){
            this.panel.uncover();
            this.panel.hide();
        }
    }
    $.fn.extend({
        OtherCalendar: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            OtherCalendar["instance"] = new OtherCalendar(this, _defaults);
            return OtherCalendar["instance"];
        }
    });
})(jQuery, undefined);