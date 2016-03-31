/*
 * the initail mod calendar
 * @Author:      dingyantao
 * @CreateDate:  2013-5-7
 */
;(function ($, undefined) {
    var _configUrl = "http://media.china-sss.com/chunqiu/online/images/calendar/";
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
    var Calendar = function (opts) {
        var _defaults = {
			date: new Date(),
            isOpenNowDate:true,
            dayTagName: "a",
			monthTagName: "a",
			defaultClass: "calendar",
			tipText: "yyyy-mm-dd",
            todayInfos:["","",""],
            rangeColor: "#F0F5FB",
            hoverColor: "#d9e5f4",
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
            type:"",
			typeList: { "month_prev": "-1", "month_next": "+1" },
			template: {
				head: '<div class="calendar_title"><a class="{$type}"></a>{$data}</div>',
				shead: '<div class="calendar_title"><a class="{$typel}"></a>{$data}<a class="{$typer}"></a></div>',
				body:  '<dl class="calendar_day"><dt class="weekend">日</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt class="weekend">六</dt><dd>{$dates}</dd></dl>',
                foot: '',
				day: '<a href="javascript:void(0);" {$id} {$Class} {$Style}>{$day}</a>',
				festival: '<span class="c_day_festival">{$day}</span>'
			},
		    showPrev: false,
			showNext: false,
            festival:{
                '2013-02-09': ['c_chuxi', '除夕'],
                '2013-02-10': ['c_chunjie', '春节']
            }
        };
        $.extend(true,_defaults, opts);
		this.initialize(_defaults);
    };
    Calendar.prototype={
        initialize:function(opts){
            this.setOptions(opts);
            this.bindEvent();
            if (this.autoRender) {
                this.render(this.date);
            }
        },
        setOptions: function (opts) {
			$.extend(true,this, opts);
            this.target = $("#"+opts.target);
		},
        bindEvent:function(){
            this.bindMousedownEvent();
            this.bindMoveEvent();
        },
        hide: function () {
            this.target.css('display', 'none');
        },
        show: function (date) {
            this.target.css('display', '');
        },
        bindMousedownEvent:function(){
            var _this = this;
            this.target.bind("mousedown", function (e) {
                var tag = e.target;
                var hasClass = false;
                for (var b in _this.typeList) {
                    if ($(tag).hasClass(b)) {
                        hasClass = true;
                        break;
                    }
                };
                if (tag.tagName == _this.monthTagName.toUpperCase() && hasClass) {
                    _this.changeMonth(_this, _this.typeList[tag.className]);
                    return false;
                };
                tag = (tag.tagName == _this.dayTagName.toUpperCase() ?
                    tag :
                    $(tag).parents(_this.dayTagName)[0]);
                if (tag) {
                    if (tag.tagName == _this.dayTagName.toUpperCase()) {
                        _this.clickEvent(_this, tag);
                        return false;
                    }
                }
                return false;
            });
        },
        bindMoveEvent:function(){
            var startDate = null,
                endDate = null,
                datStartDate = null,
                dateEndDate = null,
                _this = this;
            this.target.bind("mouseover", function (e) {
                if (_this.input) {
                    startDate = $(_this.input).data('startdate') || _this.startDate;
                    endDate = $(_this.input).data('enddate') || _this.endDate;
                }
                _this.chkHoverColor(startDate, endDate, e.target);
            } .bind(this));
            this.target.bind("mouseout", function (e) {
                var toElement = e.relatedTarget || e.toElement;
                if (toElement && _this.input && !$.contains(_this.target[0].parentNode, toElement) && startDate && endDate) {
                    datStartDate = this.strToDate(startDate);
                    dateEndDate = this.strToDate(endDate);
                    _this.clearHoverColor(datStartDate, dateEndDate);
                }
            } .bind(this));
        },
        chkHoverColor: function (startDate, endDate, tag) {
            var datStartDate = null;
            var dateEndDate = null;
            if (startDate && (tag.tagName == 'A' || tag.parentNode.tagName == 'A') && !$(tag).hasClass('day_over') && !$(tag).hasClass('day_no')) {
                datStartDate = this.strToDate(startDate);
                dateEndDate = this.strToDate(endDate);
                this.setHoverColor(datStartDate, dateEndDate, tag);
                return;
            }
        },
        setHoverColor: function (startDate, endDate, tag) {
            tag = tag.tagName == "A" ? tag : tag.parentNode;
            var date = this.getDateById(tag.id);
            endDate = endDate ? endDate : date;
            var tags = this.target[0].parentNode.getElementsByTagName(tag.tagName);
            for (var i = 0; i < tags.length; i++) {
                var strClass = !$(tags[i]).hasClass('day_over') && !$(tags[i]).hasClass('day_no');
                if (tags[i].id && strClass) {
                    var tempDate = this.getDateById(tags[i].id);
                    if (tempDate < date && tempDate > startDate) {
                        tags[i].style.backgroundColor = this.hoverColor;
                    } else if (tempDate < startDate || tempDate > endDate) {
                        tags[i].style.backgroundColor = "";
                    } else {
                        tags[i].style.backgroundColor = this.rangeColor;
                    }
                }
            }
        },
        clearHoverColor: function (startDate, endDate) {
            var tags = this.target[0].parentNode.getElementsByTagName('a');

            for (var i = 0; i < tags.length; i++) {
                var strClass = !$(tags[i]).hasClass('day_over') && !$(tags[i]).hasClass('day_no')
                if (tags[i].id) {
                    var tempDate = this.getDateById(tags[i].id);
                    if (tempDate < startDate || tempDate > endDate) {
                        tags[i].style.backgroundColor = "";
                    }
                }
            }
        },
        /**
        *点击事件响应函数
        @param {Object} calobj 日历对象
        @param {HTMLElement} tag 拖动的HTMLElement
        */
        clickEvent: function (obj, tag) {
            if (!tag.id) {
                return;
            };
        },
        createTempEl: function (str) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = str;
            return tempDiv.firstChild;
        },
        /**
        *绘制日历
        @param {Date} date 日期
        */
        render:function(date){
            this.target.html("");
            this.target.append(this.createTempEl(this.createHead(date)));
            this.target.append(this.createTempEl(this.createBody(date)));
            this.target.show();
        },
        /**
        *创建日历头
        @param {Date} date 日期
        */
        createHead:function(date){
            var headHtml = "";
            date = new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth() + 1;
            var pdata = "";
            if(this.template.formatHead){
                pdata = this.template.formatHead(year,month);
            }else{
                pdata = year+"年"+month+"月";
            }
            if(this.type){
                headHtml = this.template.head.replaceWith({
                    type: this.type == "left" ? 'month_prev' : 'month_next',
                    data:pdata
                });
            }else{
                headHtml = this.template.shead.replaceWith({
                    typel: "month_prev",
                    typer: "month_next",
                    data:pdata
                });
            }
            return headHtml;
        },
        /**
        *生成日历的日期部分
        @param {Date} date 日期
        @returns {String} 日历的主体HTML
        */
        createBody:function(date){
            date = new Date(date);
            var bodyHtml = "";
            bodyHtml = this.template.body.replaceWith({
                dates:this.getDatesHtml(date)
            });
            return bodyHtml;
        },
        /**
        *生成日历的每一天逻辑函数
        @param {Date} date 日期
        @returns {String} 日历的每一天HTML
        */
        getDatesHtml:function(date){
            var returnValue = [],
                day = date.getDate(),
                beginDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay(), 
                nDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), //总天数
                startDate = null, endDate = null, minDate = null, maxDate = null,
                input = null;
            if (this.input) {
                input = $(this.input);
                startDate = input.data('startdate');
                endDate = input.data('enddate');
                minDate = input.data('mindate');
                maxDate = input.data('maxdate');
            }
            for (var i = 1; i < 43; i++) {
                var tempDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    (i - beginDay)
                );
                var tempDateStr = tempDate.format("yyyy-mm-dd");
                var tempId = tempDateStr + "_" + this.target[0].id;
                var tempClass = this.getClass(tempDate, tempDateStr, input);
                var tempFestival = tempDate <= new Date() ? "" : (this.festival[tempDateStr] || "");
                tempFestival = tempFestival ? tempFestival[0] : "";
                var strDay = this.setToday(tempDate);
                if (i > beginDay && i <= nDays + beginDay) {//当前月
                    var strCls = ([tempClass['class'], tempFestival].join(' ') ? "class='" + [tempClass['class'], tempFestival].join(' ') + "'" : "");
                    returnValue.push(this.template.day.replaceWith({
                        id: "id=" + tempId,
                        day: tempFestival ? this.template.festival.replaceWith({
                            day: strDay + (i - beginDay),
                            festival: tempFestival
                        }) : strDay + (i - beginDay),
                        Style: this.chkRange(startDate, endDate, tempDate, tempId),
                        Class: strCls
                    }));
                } else if (i > nDays) {//下月
                    returnValue.push(this.template.day.replaceWith({
                        id: this.showNext ? "id=" + tempId : "",
                        day: this.showNext ? strDay + tempDate.getDate() : "",
                        festival: this.showNext ? tempFestival : "",
                        Style: this.chkRange(startDate, endDate, tempDate, ""),
                        Class: this.showNext ? "class=" + [(tempClass['class'] || this.classNames.nothismonth), tempFestival].join(' ') : "class=" + [this.classNames.blankdate, tempFestival].join(' ')
                    }));
                } else {//上月
                    returnValue.push(this.template.day.replaceWith({
                        id: this.showPrev ? "id=" + tempId : "",
                        day: this.showPrev ? strDay + tempDate.getDate() : "",
                        festival: this.showPrev ? tempFestival : "",
                        Style: this.chkRange(startDate, endDate, tempDate, ""),
                        Class: this.showPrev ? "class=" + [(tempClass['class'] || this.classNames.nothismonth), tempFestival].join(' ') : "class=" + [this.classNames.blankdate, tempFestival].join(' ')
                    }));
                }
            }
            return returnValue.join("");
        },
        chkRange: function (startDate, endDate, date, tempId) {
            if (startDate && endDate && date && tempId) {
                startDate = startDate.toDate();
                endDate = endDate.toDate();
                if (date > startDate && date < endDate) {
                    return "style='background-color: " + $(this.input).data('rangeColor') + ";'";
                }
            }
            return '';
        },
        /**
        *计算日期的样式
        @param {Date} date 日期
        @returns {String} 计算得到的Class
        */
        getClass:function(date,tempDateStr,input){
            var classList = [
                this.classNames.today,
                this.classNames.tomorrow,
                this.classNames.aftertomorrow
            ];
            var nowDate = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            );
            var tempDay = (date - nowDate) / (24 * 60 * 60 * 1000);
            var returnValue = classList[tempDay] || "";
            if ((date - this.beginDate) / (24 * 60 * 60 * 1000) === 0) {
                returnValue += " " + this.classNames.select;
            }
            if (this.beginDate && this.endDate) {
                if (date > this.beginDate && date <= this.endDate) {
                    returnValue += " " + this.classNames.select;
                }
            }
            //禁用日期  小于当前日期或者是关闭日期的  哥加一个控制是否开启禁用小于当前日期的参数
            if ((tempDay < 0 || this.closeDate[tempDateStr]) && this.isOpenNowDate) {
                returnValue += " " + this.classNames.nothismonth;
            }
            var startDate = this.input ? input.data('startdate') ? input.data('startdate') : this.input.value : this.startDate;
            var endDate = this.input ? input.data('enddate') ? input.data('enddate') : "" : this.endDate;
            var minDate = this.input ? input.data('mindate') ? input.data('mindate') : "" : this.minDate;
            var maxDate = this.input ? input.data('maxdate') ? input.data('maxdate') : "" : this.maxDate;
            if (startDate) startDate = startDate.pad();
            if (endDate) endDate = endDate.pad();
            if (minDate) minDate = minDate.pad();
            if (maxDate) maxDate = maxDate.pad();
            var temp1 = tempDateStr;
            var checkStart = ((startDate) == temp1) ? 1 : 0;
            if (checkStart) {
                returnValue += " " + "day_selected";
            }
            var checkEnd = (endDate == temp1) ? 1 : 0;
            if (checkEnd) {
                returnValue += " " + "day_selected";
            };
            if (minDate && this.strToDate(temp1) < this.strToDate(minDate)) {
                returnValue = this.classNames.nothismonth;
            }
            if (maxDate && this.strToDate(temp1) > this.strToDate(maxDate)) {
                returnValue = this.classNames.nothismonth;
            }
            if(input.data('prohibit')&&((input.data('prohibit').join("|") + "|").indexOf(temp1+"|") !== -1)){
                returnValue = this.classNames.nothismonth;
            }
            returnValue = returnValue.split(' ').join(' ');
            var tempFestival = this.festival[temp1] || "";
            tempFestival = tempFestival ? tempFestival[0] : "";
            var temptoday = $(this.input).data("today");
            if (tempFestival || temp1 == temptoday) {
                returnValue = returnValue.replace('day_selected', 'c_festival_select');
            }
            return {
                'class': returnValue,
                'start': checkStart,
                'end': checkEnd
            };
        },
        strToDate: function (str) {
            if (str) {
                return str.toDate();
            }
        },
        /**
        *计算今明后
        @param {Date} date 日期
        @returns {String} 今明后HTML
        */
        setToday: function (date) {
            var classList = [
                this.classNames.today,
                this.classNames.tomorrow,
                this.classNames.aftertomorrow
            ];
            var nowDate = new Date();
            return this.todayInfos[(date - nowDate) / (24 * 60 * 60 * 1000)] || "";
        },
        /**
        *日期Id转为日期对象
        @param {String} id 日期字符串
        @returns {Date}  
        */
        getDateById: function (id) {
            var temp = id.replace(/_.*/, '').split('-');
            var newDate = new Date(temp[0], (temp[1] - 1), (temp[2] * 1));
            return newDate;
        }
    };
    var CalendarManage = function (opts) {
        var _defaults = {
            options: {
                container:null,
                step: 2,
                date: new Date(),
                today: null,
                todayClass: "",
                rangeColor: "#F0F5FB",
                hoverColor: "#d9e5f4",
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
                template: {
                    wrap: '<div class="calendar_wrap" id="calendars" style="position:absolute;display:none;" >{$calendars}</div>',
                    calendar: '<div id="{$calendarid}" hidefocus="true" class="calendar_month"></div>'
                },
                styles: '.calendar_wrap{ width:363px;background: #fff;padding:0px 5px 0;\
                    overflow: hidden;font-size:12px;font-family:tahoma,Arial,Helvetica,simsun,sans-serif;\
                    border:#f3f3f3;border-top:5px solid #333;box-shadow:0 3px 5px rgba(0, 0, 0, 0.1);}\
                    .calendar_wrap a{ color: #0053aa; text-decoration: none !important; }\
                    .calendar_wrap a:hover{text-decoration: underline;}\
                    #calendar0{width: 180px;}\
                    #calendar1{width: 180px;}\
                    .calendar_month{float: left;padding-bottom:5px;text-align: center;}\
                    .calendar_title{ height: 23px; line-height: 23px; font-weight: bold;text-align: center; }\
                    .month_prev,.month_next{ width: 23px; height: 23px; color: #fff;cursor: pointer; }\
                    .month_prev{float:left;background-position:0 0;}\
                    .month_next{float:right;background-position:100% 0;}\
                    .month_prev:hover{background-color:#62adf1;background-position:0 -26px;}\
                    .month_next:hover{background-color:#62adf1;background-position:100% -26px;}\
                    .calendar_day{overflow:hidden;margin:0;padding-top:5px;}\
                    .calendar_day dd {margin:0;padding:0;}\
                    #calendar1 dl{border:0;}\
                    .calendar_month dt{ float: left; width: 25px; height: 22px; line-height: 20px; color: #666; background-color: #ececec; margin-bottom: 2px; }\
                    .calendar_month .weekend{font-weight: bold;color: #f90;}\
                    .calendar_day a{ float: left; width: 24px; height: 24px; line-height: 24px; margin-bottom: 1px; padding-right: 1px; font-size: 11px; font-weight: bold; color: #005ead; background-color: #fff; cursor: pointer; }\
                    .calendar_day a:hover,.calendar_day .today,.calendar_day .day_selected,.calendar_day .c_festival_select,.calendar_day .c_festival_select:hover{\
                        background: #e6f4ff url(' + _configUrl + 'un_calender_index.png) no-repeat;}\
                    .calendar_day a:hover{background-color: #e6f4ff;background-position: -26px -53px;text-decoration: none;}\
                    .calendar_day .today{background-color: #fff5d1;background-position: 0 -82px;}\
                    .calendar_day .day_over,.calendar_day .day_no{font-weight: normal;color: #dbdbdb;outline: none;cursor: default;}\
                    .calendar_day .day_over:hover,.calendar_day .day_no:hover{background: #fff;}\
                    .calendar_day .day_selected,.calendar_day .day_selected:hover{background-color: #629be0;background-position: 0 -53px;color: #fff;}\
                    .calendar_day .c_festival_select,.calendar_day .c_festival_select:hover{ background-color: #ffe6a6;\
                        background-image: url(' + _configUrl + 'un_calender_index.png); background-position: 0 -111px; }\
                    .c_calender_date{ display: inline-block; color: #666; text-align: right; position: absolute; z-index: 1; }',
                weekText: ["pic_sun", "pic_mon", "pic_tue", "pic_wed", "pic_thu", "pic_fir", "pic_sat"],
                todayText: ["pic_today", "pic_tomorrow", "pic_aftertomorrow"],
                closeDate: {},
                festival: {
                    '2013-09-09': ['c_chuxi', '除夕'],
                    '2013-09-19': ['c_zhongqiu', '中秋节']
                }
            }
        }
        _defaults = $.extend(true,_defaults.options,opts);
        this.initialize(_defaults);
        return this;
    };
    CalendarManage.prototype = {
        initialize:function(opts){
            this.setOptions(opts);
            this.createStyle();
        },
        setOptions: function (opts) {
			$.extend(true,this, opts);
		},
        createStyle: function () {
            if(STYLE_CALENDAR)return;
            STYLE_CALENDAR = true;
            var sty;
            if ($$.browser.IsIE) {
                sty = window.document.createStyleSheet();
                sty.cssText = this.styles;
            } else {
                sty = window.document.createElement('style');
                sty.type = "text/css";
                sty.textContent = this.styles;
                window.document.getElementsByTagName('head')[0].appendChild(sty);
            }
        },
        clearWeek: function (input) {
            if (input) {
                $(input).css({"background-image": ""});
            }
        },
        setWeek: function (input) {
            var tips = $(input);
            if (tips && tips.val().isDate()){
                var txt = this.getDay(this.stringToDate(tips.val(), "-"), null);
                if (txt && tips.width() >= 105){
                    $(input).css({
                        "background-image": "url("+ _configUrl + txt + ".png)",
                        "background-position": "right center",
                        "background-repeat": "no-repeat"
                    })
                }
            }
        },
        stringToDate:function(str,split){
            var temp = str.split(split || "_");
            var newDate = new Date(temp[0], (temp[1] - 1), (temp[2] * 1));
            return newDate;
        },
        /**
        *获取提示信息
        @param {String} val 日历值 
        @param {Calendar} obj 日历对象
        */
        getDay: function (val, obj) {
            obj = obj || this;
            var nowDate = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            );

            var festival = obj.festival[val.format("yyyy-mm-dd")] || "";
            if (festival) {
                return festival[0].replace('c_', "pic_");
            }
            var retVal = Math.abs((parseInt((new Date(val) - nowDate) / (24 * 60 * 60 * 1000))));
            if (parseInt((new Date(val) - nowDate))<0||retVal > 2) {
                //debugger;
                return obj.weekText[new Date(val).getDay()];
            } else {
                return obj.todayText[retVal];
            }
        },        
        /**
        *初始化创建日历
        *@param {HTMLElement} el 日历HTML对象
        */
        createEl: function (el) {
            var tmpEl = window.document.getElementById('calendars');
            if (tmpEl) {
                return $(tmpEl);
            }

            if (el && $(el).length) {
                return $(el)
            } else {
                var tempDiv = window.document.createElement('div');
                tempDiv.innerHTML = this.template.wrap.replaceWith({
                    calendars: this.createCalendar()
                });
                return $(tempDiv.firstChild).appendTo(this.container || $$.container);
            }
        },
        /**
        *初始化创建日历的HTML
        */
        createCalendar: function () {
            var self = this;
            var retVal = [];
            this.items.forEach(function (item, i) {
                retVal.push(self.template.calendar.replaceWith({
                    calendarid: "calendar" + i
                }));
            });
            return retVal.join('');
        },
        change: function (input) {
            $input = $(this.input);
            if ($input.data('startdate')) {
                $input.data('enddate', this.input.value);
            }
            var nextEl = $($input.data('nextEl'));
            
            if (nextEl.length) {
                nextEl.data("startdate", this.input.value);
                nextEl[0].focus();
            }
            if (typeof this.input.onChange !== undefined) {
                this.input.onChange.call(this, input, input.value);
            }
            if ($(this.input).data('showWeek')) {
                this.setWeek(input);
            }
        },
        hide:function(){
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].input && !this.items[i].input.value.isDate()) {
                    this.clearWeek(this.items[i].input);
                }
                this.items[i].hide();
            };
            this.el.hide();
            this.el.uncover();
            if (this.calendarIframe) {
                this.calendarIframe.style.display = "none";
            }
        },
        show:function(input){
            if(!this.el){
                this.el = this.createEl(this.el);
				this.el[0].style.zIndex = this.zIndex;
                this.override();
            }
            if(this.calendarIframe){
                this.calendarIframe.style.display = "";
				this.calendarIframe.style.zIndex = this.zIndex;
            }
            var date= new Date(),ddate;
            if (!input.value.isDate()) {
                date = new Date();
                $(input).data('endDate', "");
                this.enddate = "";
            } else {
                date = input.value;
            }
            this.input = input;
            var _input = $(this.input);
            this.input.onBeforeShow.call(this);
            _input.data('startdate', _input.data('startdate') || this.startDate);
            _input.data('enddate', _input.data('enddate') || this.endDate);
            _input.data('mindate', _input.data('mindate') || this.minDate);
            _input.data('maxdate', _input.data('maxdate') || this.maxDate);
            _input.data('showWeek', _input.data('showWeek') || this.showWeek);
            _input.data('rangeColor', _input.data('rangeColor') || this.rangeColor);
            _input.data('reference', _input.data('reference') || this.reference);
            _input.data('nextEl', _input.data('nextEl'));
            _input.data('prevEl', _input.data('prevEl'));
            _input.data('todayClass', _input.data('todayClass'));
            for (var i = 0; i < this.items.length; i++) {
                var now = new Date();
                if (date.length) {
                    var _date = date.toDate();
                    var Year = _date.getFullYear();
                    var Month = _date.getMonth() + i;
                    ddate = new Date(Year, Month, 1);
                } else {
                    var _minDate = _input.data('mindate') || this.minDate;
                    if(_minDate){
                        var _date = _minDate.toDate(),
                            Year = _date.getFullYear(),
                            Month = _date.getMonth() + i;
                        ddate = new Date(Year, Month, 1);
                    }else{
                        ddate =  new Date(now.getFullYear(),now.getMonth() + i, 1);
                    }
                }
                this.items[i].input = this.input;
                var $input = $(this.input);
                if (!input.value.isDate() && $input.data('reference')) {
                    var reference = $($input.data('reference')).value();
                    if (reference.isDate()) {
                        var _date = reference.toDate();
                        $input.data('startdate',reference);
                        $input.data('mindate', reference);
                        var Year = _date.getFullYear();
                        var Month = _date.getMonth() + i;
                        ddate = new Date(Year, Month, 1);
                    }
                };
                this.items[i].date = ddate;
                this.items[i].render(this.items[i].date);
            };
            this.el.show();
            this.setPosition(this.input, this.el);
        },
        override:function(){
            for (var i = 0; i < this.items.length; i++) {
                var opt = this.items[i];
                opt.template = this.template;
                this.items[i] = new Calendar(opt);
                this.items[i].changeMonth = this.changeMonth.bind(this);
                this.items[i].clickEvent = this.clickEvent.bind(this);
                this.items[i].classNames = this.classNames;
                this.items[i].closeDate = this.closeDate;
            }
        },
        /**
        *换月
        @param {Calendar} calobj 日历类
        */
        changeMonth:function(calobj){
            var _this = this;
                opt = { "left": "-" + this.step, "right": "+" + this.step };
            this.items.forEach(function (item, i) {
                _this.items[i].date =
                    new Date(
                        _this.items[i].date.getFullYear(),
                        _this.items[i].date.getMonth() + eval("(" + opt[calobj.type] + ")"),
                        1
                    );
                _this.items[i].render(_this.items[i].date);
            }.bind(this));
            this.input.onShow.call(this);
        },
        /**
        *日历管理类点击事件
        @param {Calendar} calobj 日历类
        @param {HTMLElement} tag 点击的HTML元素
        */
        clickEvent: function (obj, tag) {
            var _this = this;
            if (this.input && !$(tag).hasClass(obj.classNames.nothismonth) && tag.id) {
                var val = dateFormat(obj.getDateById(tag.id), "yyyy-mm-dd");
                this.input.value = val;
                this.items.forEach(function (item, i) {
                    this.items[i].startDate = _this.input.startDate;
                    this.items[i].endDate = _this.input.endDate;
                }.bind(this));
                this.hide();
                this.input.blur();
                $(this.input).trigger('change');
            }
        },
        /**
        *日历定位
        @param {HTMLElement} input 文本框
        @param {HTMLElement} calendar 日历浮出层
        */
        setPosition: function (input, calendar) {
            var offset = $(input).offset();
                offset.top += input.offsetHeight;
            if (this.calendarIframe) {
                $(this.calendarIframe).offset(offset);
            } else {
                $(calendar).offset(offset);
                $(calendar).cover();
            }
            this.input.onShow.call(this);
            this.setToday();
        },
        setToday:function() {
            var _this = this;
            var todayClass = (function(){
                return _this.input?$(_this.input).data('todayClass'):"";
            })();
            if(todayClass){
                $(this.el).find("."+this.classNames.today).removeClass(this.classNames.today);
                for(var i=0;i<this.items.length;i++){
                    var todayEl = this.items[i].target.find('#'+this.today.pad(2)+"_"+this.items[i].target[0].id);
                    if(todayEl.length){
                        $(todayEl).addClass(todayClass).html('<span class="c_day_festival">'+(todayEl.text())+'</span>');
                        break;
                    }
                }
            }           
        }
    };
    $.fn.extend({
        Calendar:function(opts){
            var _defaults = {
                zIndex:999,
                date: new Date(),
                inputs:this,
                showWeek:true,
                minDate:null,
                maxDate:null,
                startDate:null,
                endDate:null,
                items: [{
                        target: "calendar0",
                        type: 'left',
                        autoRender: false,
                        showPrev: false,
                        showNext: false
                    },
			        {
			            target: "calendar1",
			            type: 'right',
			            autoRender: false,
			            showPrev: false,
                        showNext: false
			        }
                ],
                listeners:{
                    onBeforeShow:function(){
                
                    },
				    onShow:function(){
				
				    },
				    onChange:function(){
				    
				    }
			    }
            },objs = this;
            if(typeof opts !== "undefined"){
                $.extend(true,_defaults.listeners, opts.listeners);
                $.extend(true,_defaults, opts.options);
            }
            var $objs = $(objs);
            for(var b in _defaults){
			    if(b!="listeners"){
				    $objs.data(b, _defaults[b]);
			    }
		    }
            for(var b in _defaults.listeners){
                objs[0][b] = _defaults.listeners[b];
            }
            if(!CalendarManage["instance"]){
                CalendarManage['instance'] = new CalendarManage(_defaults);
            }
            function doReleaseCapture() {
                if (CalendarManage['instance'].ctObj && CalendarManage['instance'].ctObj.releaseCapture) {
                    CalendarManage['instance'].ctObj.releaseCapture();
                    CalendarManage['instance'].ctObj = null;
                }
            }
            function doSetCapture(obj) {
                if (obj.setCapture) {
                    doReleaseCapture();
                    obj.setCapture();
                    CalendarManage['instance'].ctObj = obj;
                }
            }
            if (_defaults.showWeek) {
                CalendarManage['instance'].setWeek(objs);
            }
            $objs.bind('focus', function () {
                CalendarManage['instance'].show(this);
                window.document.getElementById('calendars').onmousedown = function (e) {
                    doSetCapture(objs);
                    return false;
                };
            });
            $objs.bind('mouseup', function () {
                doReleaseCapture();
            });
            $objs.bind('change', function (e) {
                CalendarManage['instance'].change(this);
            });
            $objs.bind('blur', function (e) {
                doReleaseCapture();
                CalendarManage['instance'].hide();
            });
		    return CalendarManage['instance'];
        }
    });
})(jQuery, undefined);