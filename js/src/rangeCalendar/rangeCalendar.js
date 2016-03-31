/*
 * the initail mod rangeCalendar
 * @Author:      dingyantao
 * @CreateDate:  2015-4-28
 */
;(function ($, undefined) {
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
  var RangeCalendar = function(pObj,pOpts) {
  	this.opts = {
      date: new Date(),
      type:"range",
      minDate:null,
      maxDate:null,
      startDate:null,
      endDate:null,
      template: {
      	close:'<div class="calendar_close"><i></i></div>',
        leftHead:'<div class="calendar_title"><button class="{$type}"></button>{$data}</div>',
        rightHead:'<div class="calendar_title">{$data}<button class="{$type}"></button></div>',
        shead: '<div class="calendar_title"><button class="{$typel}"></button>{$data}<button class="{$typer}"></button></div>',
        body:  '<dl class="calendar_day"><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt class="weekend">六</dt><dt class="weekend">日</dt><dd>{$dates}</dd></dl>',
        bodyMonth:'<dl class="calendar_month"><dd>{$dates}</dd></dl>',
        footer: '<div class="calendar_footer"><div class="calendar_range">选择时间段<span>{$start}</span>-<span>{$end}<span></div><div class="calendar_btns"></div></div>',
        week:'<a href="javascript:" {$id} {$Class} {$Style}>{$week}</a>',
        day: '<a href="javascript:" {$id} {$Class} {$Style}>{$day}</a>',
        month:'<a href="javascript:" {$id} {$Class} {$Style}>{$month}</a>',
        festival: '<span class="c_day_festival">{$day}</span>'
      },
      classNames: {
        select: "day_select",
        hover: "day_hover",
        nothismonth: "day_no",
        blankdate: 'day_no',
        today: "today",
        tomorrow: "tomorrow",
        aftertomorrow: "aftertomorrow",
        none: "none",
        type: "left"
      },
      tagName:{
    		closeBtn:"i",
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
      container:null,
      //月份切换区间
      step:1,
      /*[
        {
          title:"导出",
          onChange:function(){}
        }
      ]*/
      otherBtns:[]
    }
    $.extend(true, this.opts, pOpts);
    $.extend(this,this.opts);
    this.target = $(pObj);
    this.init();
    this.initialize();
  }
  RangeCalendar.prototype = {
    init: function () {
      this.createEl();
    },initialize: function () {
      this.bindMoveEvent();
      this.bindEvent();
    },bindMoveEvent:function(){
      var _this = this,
        startDate = null,
        endDate = null,
        datStartDate = null,
        dateEndDate = null;
      /*
      this.calendarPanel.on("mouseover",function(e){
        _this.chkHoverColor(_this.startDate, _this.endDate, e.target);
      });
      this.calendarPanel.on("mouseout",function(e){
        var toElement = e.relatedTarget || e.toElement;
        if (toElement && _this.input && !$.contains(_this.target[0].parentNode, toElement) && startDate && endDate) {
          datStartDate = this.strToDate(startDate);
          dateEndDate = this.strToDate(endDate);
          _this.clearHoverColor(datStartDate, dateEndDate);
        }
      });
      */
    },bindEvent: function(){
      var _this = this;
      this.target.on("click",function(){
        _this.render(_this.formatDate());
        _this.setPosition();
      });
      this.calendarPanel.on("mousedown",function(e){
        var tag = e.target,
            _tag = $(tag);
        //月份切换
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
        //关闭
        if(tag.tagName == _this.tagName.closeBtn.toUpperCase()){
          _this.hide();
          return false;
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
      this.changeMonth += pNum;
      _date = new Date(this.changeYear, this.changeMonth, 1);
      this.render(_date);
    },clickEvent:function(pDom){
      if (!$(pDom).hasClass(this.classNames.nothismonth)) {
        var _date = $(pDom).data("date");
        if(this.startDate == null){
          this.startDate = _date;
        }else if(this.startDate == _date){
          this.startDate = this.endDate;
          this.endDate = null;
        }else if(this.startDate && this.endDate == null){
          if(this.startDate.toDate() > _date.toDate()){
            this.endDate = this.startDate;
            this.startDate = _date;
          }else{
            this.endDate = _date;
          }
        }else if(this.endDate == _date){
          this.endDate = null;
        }else{
          var _d = _date.toDate();
          if(_d < this.startDate.toDate()){
            this.startDate = _date;
          }else if(_d > this.endDate.toDate()){
            this.endDate = _date;
          }else{
            this.endDate = _date;
          }
        }
        this.change(0);
      }
    },formatDate:function(){
      var _date = this.target.data(this.type),
        _returnDate = null;
      if(_date){
        var _dates = _date.split(",");
        this.startDate = _dates[0];
        this.endDate = _dates[1];
        _returnDate = this.startDate.toDate();
        this.changeYear = this.yearDate = _returnDate.getFullYear();
        this.changeMonth = this.monthDate = _returnDate.getMonth();
        this.weekDate = this.getWeek(_returnDate);
      }else{
        this.changeYear = this.yearDate = this.date.getFullYear();
        this.changeMonth = this.monthDate = this.date.getMonth();
      }
      return _returnDate || this.date;
    },createEl:function(){
      this.panel = $("<div class=\"calendar\"></div>");
      this.panel.appendTo(this.container || $$.container);
      this.calendarPanel = $("<div></div>");
      this.otherPanel = $("<div></div>");
      this.panel.append(this.calendarPanel).append(this.otherPanel);
    },render:function(pDate){
      this.calendarPanel.html("");
      this.calendarPanel.append($(this.template.close));
      var _leftPanel = $("<div class=\"calendar_month\"></div>"),
        _rightPanel = $("<div class=\"calendar_month\"></div>");
      _leftPanel.append(this.createHead(pDate,true));
      _leftPanel.append(this.createBody(pDate));
      var _rightDate = this.addMonth(pDate,this.step);
      _rightPanel.append(this.createHead(_rightDate,false));
      _rightPanel.append(this.createBody(_rightDate));
      this.calendarPanel.append(_leftPanel).append(_rightPanel);
      this.otherPanel.html("");
      this.otherPanel.append(this.createFooter());
      this.initOtherBtns();
      this.panel.show();
    },setPosition: function () {
      var offset = this.target.offset();
          offset.top += this.target[0].offsetHeight;
      this.panel.offset(offset);
      this.panel.cover();
      $.type(this.listeners.onShow) === "function" && this.listeners.onShow.call(this);
    },hide:function(){
      this.panel.uncover();
      this.panel.hide();
    },createHead:function(pDate,pFlag){//日历头部
      if(pFlag){
        return this.template.leftHead.replaceWith({
          type:"calendar_prev",
          data: pDate.getFullYear() + "年" + (pDate.getMonth() + 1) + "月"
        })
      }
      return this.template.rightHead.replaceWith({
        type:"calendar_next",
        data: pDate.getFullYear() + "年" + (pDate.getMonth() + 1) + "月"
      });
    },createBody:function(pDate){//日历主题
      var _year = pDate.getFullYear(),
          _month = pDate.getMonth(),
          _week = null,
          _maxWeek = null,
          weekClass = "",
          tempWeek = null,
          tempData = null;
      var _beginDay = new Date(_year, _month, 1).getDay() - 1,
          _nDays = new Date(_year,_month + 1, 0).getDate() + 1, 
          _dates = [];
      for (var i = 1; i < 43; i++) {
        var tempDate = new Date(_year,_month,
            (i - _beginDay)
        ),
        tempClass = this.getClass(tempDate);
        /*if(i % 7 == 1){
            tempWeek = this.getWeek(tempDate);
            weekClass = this.weekDate != null ? (this.weekDate .week == tempWeek.week ? this.classNames.select : "" ) : "";
            tempData = ["data-date=\"",tempWeek.date.join(','),"\" data-val=\"",tempWeek.year,"年第",tempWeek.week,"周\""].join('');
            _dates.push(this.template.week.replaceWith({
                id:tempData,
                Class: ["class=\"week ", weekClass, " ", tempClass, "\""].join(''),
                Style:"",
                week:tempWeek.week
            }));
        }*/
        tempData = ["data-date=\"",tempDate.format("yyyy-mm-dd"),"\""].join('');
        if (i > _beginDay && i < _nDays + _beginDay) {//当前月
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
      }
      return this.template.body.replaceWith({dates:_dates.join('')});
    },createFooter:function(){//日历底部
      return this.template.footer.replaceWith({
        start:this.startDate == null ? "" : this.startDate,
        end:this.endDate == null ? "" : this.endDate
      });
    },initOtherBtns:function(){
      var _this = this;
        _btnsPanel = this.otherPanel.find(".calendar_btns");
      for(var i = 0,l = this.otherBtns.length;i < l;i++){
        (function(index){
          $("<a href='javascript:'>" + _this.otherBtns[index].title + "<a>")
            .appendTo(_btnsPanel)
            .on("click",function(){
              if($.type(_this.otherBtns[index].onChange) == "function"){
                _this.otherBtns[index].onChange.call(_this);
              }
            });
        })(i);        
      }
    },getClass:function(pDate){
      var returnValue = "",
          minDate = this.minDate,
          maxDate = this.maxDate,
          startDate = this.startDate,
          endDate = this.endDate,
          strDate = this.strToDate(pDate.format("yyyy-mm-dd"));
      if(minDate) minDate = minDate.pad();
      if(maxDate) maxDate = maxDate.pad();
      if(startDate) startDate = startDate.toDate();
      if(endDate) endDate = endDate.toDate();
      if (minDate && strDate < this.strToDate(minDate)) {
          returnValue = this.classNames.nothismonth;
      }
      if (maxDate && strDate > this.strToDate(maxDate)) {
          returnValue = this.classNames.nothismonth;
      }
      if(returnValue.length == 0){
        if((startDate && +startDate == +strDate) || (endDate && +endDate == +strDate)){
          returnValue = this.classNames.select;
        }
        if(startDate < strDate && endDate > strDate){
          returnValue = this.classNames.hover;
        }
      }
      return returnValue;
    },strToDate: function (str) {
      if (str) {
          return str.toDate();
      }
    },chkHoverColor: function (startDate, endDate, tag) {
      var datStartDate = null;
      var dateEndDate = null;
      if (startDate 
        && (tag.tagName == 'A' || tag.parentNode.tagName == 'A') 
        && !$(tag).hasClass(this.classNames.select) && !$(tag).hasClass(this.classNames.nothismonth)) {
          datStartDate = this.strToDate(startDate);
          dateEndDate = this.strToDate(endDate);
          this.setHoverColor(datStartDate, dateEndDate, tag);
          return;
      }
    },setHoverColor: function (startDate, endDate, tag) {
      tag = tag.tagName == "A" ? tag : tag.parentNode;
      var date = this.getDateById(tag.id);
      endDate = endDate ? endDate : date;
      var tags = this.target[0].parentNode.getElementsByTagName(tag.tagName);
      for (var i = 0; i < tags.length; i++) {
        var strClass = !$(tags[i]).hasClass(this.classNames.select) && !$(tags[i]).hasClass(this.classNames.nothismonth);
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
    },clearHoverColor: function (startDate, endDate) {
      var tags = this.target[0].parentNode.getElementsByTagName('a');
      for (var i = 0; i < tags.length; i++) {
        var strClass = !$(tags[i]).hasClass(this.classNames.select) && !$(tags[i]).hasClass(this.classNames.nothismonth)
        if (tags[i].id) {
          var tempDate = this.getDateById(tags[i].id);
          if (tempDate < startDate || tempDate > endDate) {
              tags[i].style.backgroundColor = "";
          }
        }
      }
    },getDateById: function (id) {
      var temp = id.replace(/_.*/, '').split('-');
      var newDate = new Date(temp[0], (temp[1] - 1), (temp[2] * 1));
      return newDate;
    },addMonth:function(pDate,pNum){
      return new Date(pDate.getFullYear(),(pDate.getMonth() + pNum),1);
    }
  }
  $.fn.extend({
    RangeCalendar: function (pOpts) {
      var _defaults = {};
      if (typeof pOpts !== "undefined") {
          $.extend(true, _defaults, pOpts);
      }
      RangeCalendar["instance"] = new RangeCalendar(this, _defaults);
      return RangeCalendar["instance"];
    }
  });  
})(jQuery);