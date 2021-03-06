﻿/*
 * the initail mod address
 * @Author:      dingyantao
 * @CreateDate:  2013-9-27
 */

 /**
 * @class address
 * 地址选择器组件
 * @param {Object} opt  配置项
 * @return {Object}  地址选择器组件实例
 */
(function ($,undefined) {
    // @cfg {integer} FOCUS_INTERVAL 检测输入延迟
    var FOCUS_INTERVAL = 100,
    //提示样式
        STYLE_SUGGESTION = null;
    //筛选样式
        STYLE_FILTER = null;
    String.prototype.trim   =   function(){   
      return this.replace(/(^\s*)|(\s*$)/g,"");   
    }

    //提示对象
    var Suggestion = function(pObj,pOpts){
        this.opts = {
            source:null,
            message:{
                suggestion:'从下列城市选择'
            }
        }
        this.target = pObj;
        this.init(pOpts);
    }
    Suggestion.prototype ={
        init:function(pOpts){
            $.extend(true,this.opts, pOpts);
            this.createStyle();
            this.createHtml();
        },
        createHtml:function(){
            var el = document.createElement('div');
            el.id = "address_suggestionContainer_"+ this.target[0].id;
            this.container = $(el);
            this.container.appendTo($$.container);
            var _html = $.template.replace(this.opts.template.suggestion,{
                message:this.opts.message.suggestion,
                data:this.opts.source.suggestion
            });
            this.container.html(_html);
            if ($.type(this.opts.template.suggestionInit)=='function'){
                this.opts.template.suggestionInit(this.container);
            }
            this.sView = this.container.children().first();
            this.sView[0].style.position = 'absolute';
        },
        show:function(){
            var _offset = this.target.offset();
            this.sView.css({ 
                left: _offset.left + "px ",
                top: (_offset.top + this.target[0].offsetHeight) + "px"
            });
            this.sView.cover();
            this.sView.show();
        },
        hide:function(){
            this.sView.uncover();
            this.sView.hide();
        },
        createStyle: function () {
            if(STYLE_SUGGESTION) return;
            STYLE_SUGGESTION = true;
            var sty;
            if ($$.browser.IsIE) {
                sty = window.document.createStyleSheet();
                sty.cssText = this.opts.template.suggestionStyle;
            } else {
                sty = window.document.createElement('style');
                sty.type = "text/css";
                sty.textContent = this.opts.template.suggestionStyle;
                window.document.getElementsByTagName('head')[0].appendChild(sty);
            }
        }
    }    
    //筛选对象
    var Filter = function(pObj,pOpts){
        this.opts={
            source:null,
            message:{
                filterResult:'${val}，按拼音排序',
                noFilterResult:'对不起，找不到：${val}',
                isShowTitle:true,
                sort:[]
            },
            //是否上来选中
            isShowHover:true,
            /**
                @cfg {string} jsonpFilter jsonp过滤数据源url  
                ${key}        查询值  
                ${accurate}   是否精确 1 精确 0不精确
                返回格式
                 {
                     //查询值
                     key:'xx',
                     //数据
                     data:"@...@",
                     //缓存时间，分钟(todo)
                     cache:60
                 }
            */
            jsonpFilter:null,
            /** 
                @cfg {array} sort 数据排序方式，对jsonpFilter数据无效
                * <pre>
                * 格式
                * [^]列号|别名[+][$]
                * ^ 头部匹配
                * $ 尾部匹配
                * + 当前及之后字段匹配
                * </pre>
                * @default ['^0$','^1$','^3+$','^0','^1','^3+','0','1','3+']
            */
            sort:['^0$','^1$','^3+$','^0','^1','^3+','0','1','3+'],
            charset:"utf-8",
            container:null
        }
        this.target = pObj;
        this.init(pOpts);
    }
    Filter.prototype = {
        init:function(pOpts){
            $.extend(true,this.opts, pOpts);
            $.extend(this,{
                _filterCount:0,
                _filterEnable:false,
                _lastFilterData:null,
                _lastFilterRendarData:null,
                _lastSelect:null
            });
            this.createStyle();
            this.createHtml();
        },
        createHtml:function(){
            if(this.opts.container == null){
                var el = document.createElement('div');
                el.id = "address_filterContainer_"+ this.target[0].id;
                this.container = $(el);
                this.container.appendTo($$.container);
                this.containerFlag = true;
            }else{
                this.container = this.opts.container;
                this.containerFlag = false;
            }            
            if ($.type(this.opts.template.filterInit)=='function'){
                this.opts.template.filterInit(this.container);
            }
        },
        filterData:function(pVal,pIsAccurate,pIsReturnBest,pFn){
            if(this.opts.jsonpFilter){
                this._filterDataByJsonp(pVal,pIsAccurate,pIsReturnBest,pFn);
            }else{
                return this._filterData(pVal,pIsAccurate,pIsReturnBest);
            }
        },        
        _filterDataByJsonp:function(pVal,pIsAccurate,pIsReturnBest,pFn){
            var _this = this,
                listArr=[],k=0,
                privateFilterCount=this._filterCount,
                url = $.template.render(this.opts.jsonpFilter, {
                    key:encodeURIComponent(escape(pVal)),
                    accurate: pIsAccurate ? 1 : 0
                });
            $.ajax({
                charset:this.opts.charset,
                url:url,
                dataType: "jsonp",
                global: false,
                success:(function(source){
                    if ((this._filterEnable||pIsReturnBest)&&privateFilterCount==this._filterCount){
                        var arr=source.data.split('@');
                        for (var i=0,n=arr.length;i<n;i++){
                            if (arr[i]){
                                if (pIsReturnBest){
                                    if ($.type(pFn)=='function'){
                                        pFn(arr[i]);
                                    }
                                    return;
                                }
                                if (arr[i].slice(0,2)=='$='){
                                    var item=$.template.render(arr[i].slice(2),{
                                        val:val
                                    });
                                }else{
                                    var t=arr[i].split('|');
                                    var item={
                                        left: t[this.displayHash.left] || '',
                                        right: t[this.displayHash.right] || '',
                                        data:arr[i]
                                    };
                                }
                                listArr[k++]=item;
                            }
                        }
                        this.updateFilter(listArr,source.key);
                    }
                }).bind(this)
            });          
        },
        _filterData:function(pVal,pIsAccurate,pIsReturnBest){
            var _this=this,
                listArr=[],k=0,
                dataString=this.opts.source.data;
            switch ($.type(this.opts.sort)){
                case 'array':
                    var reString=this.sortReString[pIsAccurate?'accurate':'vague'];
                    var reVal=_this.toReString(pVal);
                    var msg=$.type(this.opts.message.sort)=='array'?this.opts.message.sort:[];
                    for (var i=0,n=reString.length;i<n;i++){
                        reString[i][1]=reVal;
                        var re=new RegExp(reString[i].join(''),'gi');
                        var itemArr=[],l=0;
                        dataString=dataString.replace(re,function(a,b){
                            var c=b.split('|');
                            var item={
                                left:c[_this.displayHash.left]||'',
                                right:c[_this.displayHash.right]||'',
                                data:b
                            };
                            itemArr[l++]=item;
                            return '';
                        });
                        if (l){
                            itemArr.sort(this._sortData);
                            if (pIsReturnBest){
                                return itemArr[0].data;
                            }
                            if (msg[i]){
                                itemArr.unshift($.template.render(msg[i],{
                                    val:val,
                                    items:itemArr
                                }));
                            }
                            listArr[k++]=itemArr;
                        }
                    }
                    if (pIsReturnBest){
                        return false;
                    }
                    break;
                case 'function':
                    itemArr=this.opts.sort(this.opts.source.data,pVal,pIsAccurate,pIsReturnBest);
                    if (pIsReturnBest){
                        if (itemArr.length){
                            return itemArr[0].data;
                        }else{
                            return false;
                        }
                    }
                    listArr[k++]=itemArr;
                    break;
                default:
                    $.error('address._filterData','invalid sort type');
                    return false;
                    break;
            }
            listArr=Array.prototype.concat.apply([],listArr);
            this.updateFilter(listArr,pVal);
        },
        updateFilter:function(pData,pVal,pPage){
            var arr=[],k=0;
            //page
            var index=0;
            if ($.type(pData)=='array'){
                this._lastFilterData=pData;
            }else{
                pData=this._lastFilterData;
                if(this._lastSelect){
                    var els = this.container.find('*[data],label');
                    for (var i = els.length - 1; i >= 0; i--) {
                        if(els[i] == this._lastSelect[0]){
                            index = i;
                            break;
                        }
                    };
                }else{
                    index = -1;
                }
            }
            pPage=pPage||0;
            //pageSize
            var pageSize=this.opts.template.filterPageSize;
            //max
            var max=Math.ceil(pData.length/pageSize)-1;
            //current
            var current=Math.min(Math.max(0,pPage),max);
            //render data
            var t={
                isShowTitle: this.opts.message.isShowTitle,
                val:pVal||this._lastValue,
                hasResult:true,
                list:max+1?pData.slice(current*pageSize,Math.min((current+1)*pageSize,pData.length)):null,
                page:{
                    max:max,
                    current:current
                }
            };
            //last render data
            if (t.list){
                this._lastFilterRendarData=t;
            }else{
                t=this._lastFilterRendarData;
                if (t){
                    if (pVal){
                        t.val=pVal;
                        t.hasResult=false;
                    }
                }else{
                    this.clear();
                    this._filterEnable=false;
                    this.hide();
                    return;
                }
            }
            t.message = {
                filterResult: $.template.render(this.opts.message.filterResult,{ val : pVal||this._lastValue }),
                noFilterResult: $.template.render(this.opts.message.noFilterResult,{ val : pVal||this._lastValue})
            }
            arr[k++]=$.template.replace(this.opts.template.filter,t);
            this.container.html(arr.join(''));
            this.sView = this.container.children().first();
            if(this.containerFlag){
                this.sView[0].style.position = 'absolute';
            }
            if ($.type(this.opts.template.filterInit)=='function'){
                this.opts.template.filterInit(this.container);
            }
            index=Math.max(0,Math.min(index,t.list.length-1));
            var els=this.container.find('*[data],label');
            if (els[index].tagName=='LABEL'){
                if (index==els.length-1){
                    index-=1;
                }else{
                    index+=1;
                }
            }
            if(this.opts.isShowHover){
                this.showHover(els[index]);
            }
            this.show();
        },
        showHover:function(obj){
            if (!obj){
                obj=this.container.find('*[data]:first');
            }else{
                obj=$(obj);
            }
            if (this._lastSelect){
                if (this._lastSelect[0]==obj[0]){
                    return;
                }
                this._lastSelect.removeClass('hover');
            }
            obj.addClass('hover');
            this._lastSelect=obj;
        },
        _sortData:function(a,b){
            if (a.left>b.left){
                return 1;
            }else if (a.left==b.left){
                return 0;
            }else{
                return -1;
            }
        },
        toReString:function(pVal){
            var a={"\r":"\\r","\n":"\\n","\t":"\\t"};
            return pVal.replace(/([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g,"\\$1").replace(/[\r\t\n]/g,function(b){
                return a[b]}
            );
        },
        show:function(){
            var _offset = this.target.offset();
            if(this.containerFlag){
                this.sView.css({ 
                    left: _offset.left + "px ",
                    top: (_offset.top + this.target[0].offsetHeight) + "px"
                });
            }
            this.sView.cover();
            this.sView.show();
        },
        hide:function(){
            if(this.sView){
                this.sView.uncover();
                this.sView.hide();
            }            
        },
        createStyle: function () {
            if(STYLE_FILTER) return;
            STYLE_FILTER = true;
            var sty;
            if ($$.browser.IsIE) {
                sty = window.document.createStyleSheet();
                sty.cssText = this.opts.template.filterStyle;
            } else {
                sty = window.document.createElement('style');
                sty.type = "text/css";
                sty.textContent = this.opts.template.filterStyle;
                window.document.getElementsByTagName('head')[0].appendChild(sty);
            }
        },
        clear:function(){
            this._lastFilterData=null;
            this._lastFilterRendarData=null;
            this._lastSelect=null;
        }
    }
    //地址选择器对象
    var Address = function  (pObj,pOpts) {
        this.opts = {
            /** @cfg {object} source 数据源
                {
                     //别名
                     alias:['pinyin','cityName','cityId'],
                     //推荐城市
                     suggestion:{
                         '热门城市':[
                             {display:'北京',data:'Beijing|北京|2'},
                             {display:'上海',data:'Shanghai|上海|2'}
                         ],
                         '常用城市':[
                             {display:'天津',data:'Tianjin|天津|3'}
                         ],
                     },
                     data:'@Aletai|阿勒泰|AAT|@Xingyi|兴义|ACX|@Baise|百色|AEB|@Ankang|安康|AKA|@...@'   //完整数据
                 }
            */
            source:null,
            /**
                @cfg {string} jsonpSource jsonp数据源url
            */
            jsonpSource:null,
            //@cfg {string} charset 编码格式
            charset:"utf-8",
            /**
             * @cfg {object} relate 关联元素
             * <pre>
             * 格式
             * 列号|别名:选择器|dom对象
             * 样例
                {
                    0:'#hidden1',
                    1:'#hidden2'
                }
             *</pre>
             */
            relate:{},
            /**
             * @cfg {object} message 提示文字
             * <pre>
             * suggestion 推荐城市提示文字
             * filterResult 过滤结果提示文字
             * noFilterResult 过滤无结果提示文字
             * </pre>
             * @default 
             * <pre>
                {
                    suggestion:'从下列城市选择',
                    filterResult:'${val}，按拼音排序',
                    noFilterResult:'对不起，找不到：${val}'
                }
             * </pre>
             */
            message:{
                suggestion:'从下列城市选择',
                filterResult:'${val}，按拼音排序',
                noFilterResult:'对不起，找不到：${val}',
                isShowTitle:true,
                sort:[]
            },
            isShowHover:true,
            /**
             * @cfg {boolean} isAutoCorrect 是否自动纠正输入值
             * @default false
             */
            isAutoCorrect:false,
            /**
             * @cfg {boolean} isFocusNext 是否在选择后自动定位到当前form下一个输入框
             * @default false
             */
            isFocusNext:false,
            /** 
                @cfg {array} sort 数据排序方式，对jsonpFilter数据无效
                * <pre>
                * 格式
                * [^]列号|别名[+][$]
                * ^ 头部匹配
                * $ 尾部匹配
                * + 当前及之后字段匹配
                * </pre>
                * @default ['^0$','^1$','^3+$','^0','^1','^3+','0','1','3+']
            */
            sort:['^0$','^1$','^3+$','^0','^1','^3+','0','1','3+'],
            /**
             * @cfg {object} template 模板
             * <pre>
             * 格式
                {
                    //推荐模板
                    suggestion:'...',
                    //推荐样式
                    suggestionStyle:'...',
                    //推荐初始化
                    suggestionInit:function(){...},
                    //过滤模板
                    filter:'...',
                    //过滤样式
                    filterStyle:''
                    //过滤初始化
                    filterInit:function(){...},
                }
                数据格式
                suggestion:{
                    data:{
                        group1:[
                            {display:'...',data:'...|...|...'},
                            {display:'...',data:'...|...|...'}
                        ],
                        group2:[
                            {display:'...',data:'...|...|...'},
                            {display:'...',data:'...|...|...'}
                        ]
                    },
                    message:{
                        suggestion:'...',
                    }
                }
                filter:{
                    val:'...',
                    hasResult:true|false,
                    list:[
                        {left:'...',right:',,,','data':'...|...|...'},
                        {left:'...',right:',,,','data':'...|...|...'}
                    ]|null,
                    page:{
                        max:10,
                        current:1
                    },
                    message:{
                        filterResult:'...',
                        noFilterResult:'...'
                    }
                }
            */
            template:{
                suggestion:'\
                    <div class="c_address_box" style="display:none;">\
                        <div class="c_address_hd"><$= GlobalData.message $></div>\
                        <div class="c_address_bd">\
                            <ol class="c_address_ol">\
                                <$ for(var key in GlobalData.data){ $>\
                                    <li><span><$= key $></span></li>\
                                <$ } $>\
                            </ol>\
                            <$ for(var key in GlobalData.data){ $>\
                                <ul class="c_address_ul layoutfix">\
                                <$ for(var i =0,l=GlobalData.data[key].length;i < l;i++){\
                                    var item = GlobalData.data[key][i]; $>\
                                    <li><a data="<$= item.data $>" href="javascript:void(0);"><$= item.display $></a></li>\
                                <$ } $>\
                                </ul>\
                            <$ } $>\
                        </div>\
                    </div>\
                ',
                suggestionStyle:'\
                    ul,li,ol{ padding:0; margin:0; list-style:none}\
                    .c_address_box{ position:absolute; width:500px; background:#ffffff; top:30px; left:74px; z-index:99;  overflow:hidden; *zoom:1; border-top:5px solid #333333; box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);}\
                    .c_address_box .c_address_hd{ line-height:45px; height:45px;padding-left:10px; color:#666; font-size:12px; border:0; background:transparent}\
                    .c_address_box .c_address_hd em{ font-weight:normal; padding-left:5px;}\
                    .c_address_bd{ border:0; padding:0}\
                    .c_address_ol{background: none repeat scroll 0 0 #F3F3F3;border-bottom: 1px solid #DFDFDF;height: 35px;list-style-type: none;padding: 0 0 0 10px;}\
                    .c_address_ol li{ float: left;    height: 32px;}\
                    .c_address_ol li span{ float:left; line-height:32px; height:32px; width:76px; text-align:center; margin-top:3px; font-family:Arial; color:#666}\
                    .c_address_ol li .hot_selected{  background:#fff; border-left:1px solid #dddddd; border-right:1px solid #dddddd; border-top:3px solid #ff6501; font-weight:bold; margin-top:0;    color: #000000; position:relative;    font-weight: bold;    height: 33px;    margin-bottom: -1px;    padding: 0 7px;}\
                    .c_address_ul{ padding:18px 0 18px 23px; overflow:hidden;}\
                    .c_address_ul b{ position:absolute; width:20px; left:0px; top:0px; height:30px; line-height:30px;  color:#ff6600;}\
                    .c_address_ul li{ height:32px; width:93px; float:left; }\
                    .c_address_ul li a{ float:left; height:30px; line-height:30px; width:86px; margin-right:5px; color:#666}\
                    .c_address_ul li a:hover{ background:none transparent; color:#F60; border-color:#FFF; text-decoration:underline}\
                ',
                suggestionInit:defaultSuggestionInit,
                filter:'\
                    <div class="c_address_select">\
                        <div class="c_address_wrap" style="width:' + (pOpts.filterWidth || 452) + 'px;">\
                            <$ if(GlobalData.isShowTitle){ $>\
                            <div class="c_address_hd">\
                                <$ if(GlobalData.hasResult){ $><$= GlobalData.message.filterResult $>\
                                <$ } else{ $><$= GlobalData.message.noFilterResult $><$ } $>\
                            </div>\
                            <$ } $>\
                            <div class="c_address_list" style="">\
                                <$ for(var key in GlobalData.list){\
                                    var item = GlobalData.list[key]; $>\
                                    <a href="javascript:void(0);" data="<$= item.data $>" style="display: block;"><span><$= item.left $></span>\
                                        <$= item.right $></a>\
                                <$ } $>\
                            </div>\
                            <$ if(GlobalData.page.max > 0){ var page =GlobalData.page; $>\
                                <div class="c_address_pagebreak" style="display: block;">\
                                    <$ if(page.current>0){ $>\
                                        <a href="javascript:void(0);" page="<$= page.current-1 $>">&lt;-</a>\
                                    <$ } $>\
                                    <$ if(page.current<2){ $>\
                                        <$ for(var i = 0,l=Math.min(5,page.max+1);i < l;i++){ $>\
                                            <a href="javascript:void(0);" <$ if(page.current == i){ $>class="address_current"<$ } $>\
                                            page="<$= i $>"><$= i+1 $></a>\
                                        <$ } $>\
                                    <$ } else if(page.current>page.max-2){ $>\
                                        <$ for(var i = Math.max(0,page.max-4),l=page.max+1;i<l;i++){ $>\
                                            <a href="javascript:void(0);" <$ if(page.current == i){ $>class="address_current"<$ } $>\
                                            page="<$= i $>"><$= i+1 $></a>\
                                        <$ } $>\
                                    <$ } else { $>\
                                        <$ for(var i = Math.max(0,page.current-2),l=Math.min(page.current+3,page.max+1);i<l;i++){ $>\
                                            <a href="javascript:void(0);" <$ if(page.current == i){ $>class="address_current"<$ } $>\
                                            page="<$= i $>"><$= i+1 $></a>\
                                        <$ } $>\
                                    <$ } $>\
                                    <$ if(page.current<page.max){ $>\
                                        <a href="javascript:void(0);" page="<$= page.current+1 $>">-&gt;</a>\
                                    <$ } $>\
                                </div>\
                            <$ } $>\
                        </div>\
                    </div>\
                ',
                filterStyle:'\
                    .c_address_hd { height: 24px; border-color: #2F8150; border-style: solid; border-width: 1px 1px 0; background-color: #2F8150; color: #fff; line-height: 24px; padding-left: 10px; }\
                    .c_address_select { width:300px; height:355px; font-family: Arial, Simsun; font-size: 12px; }\
                    .c_address_wrap { width: 300px; height:349px; min-height: 305px; margin: 0; padding: 0 0 4px; border: 1px solid #969696; background:#fff; text-align: left; }\
                    .c_address_list { margin: 0; padding: 0; height:300px; }\
                    .c_address_list label { border-bottom: 1px solid #FFFFFF; border-top: 1px solid #FFFFFF; display: block; height: 22px; line-height: 22px; min-height: 22px; overflow: hidden; padding: 1px 9px 0; text-align: center; }\
                    .c_address_list span { float: right; font: 10px/22px verdana; margin: 0; overflow: hidden; padding: 0; text-align: right; white-space: nowrap; width: 110px; }\
                    .c_address_list a { border-bottom: 1px solid #FFFFFF; border-top: 1px solid #FFFFFF; color: #0055AA; cursor: pointer; display: block; height: 22px; line-height: 22px; min-height: 22px; overflow: hidden; padding: 1px 9px 0; text-align: left; text-decoration: none; }\
                    .c_address_list a.hover { background: none repeat scroll 0 0 #E8F4FF; border-bottom: 1px solid #7F9DB9; border-top: 1px solid #7F9DB9; }\
                    .address_selected { background: none repeat scroll 0 0 #FFE6A6; color: #FFFFFF; height: 22px; }\
                    .c_address_pagebreak { line-height: 25px; margin: 0; padding: 0; text-align: center; }\
                    .c_address_pagebreak a { color: #0055AA; display: inline-block; font-family: Arial, Simsun, sans-serif; font-size: 14px; margin: 0; padding: 0 4px; text-align: center; text-decoration: underline; width: 15px; }\
                    a.address_current { color: #000; text-decoration: none; }\
                ',
                filterInit:defaultFilterInit,
                filterPageSize:10,
                filterContainer:null
            },
            /**
             * @cfg {object} display 数据展示方式
             * <pre>
             * left 左栏显示列号或别名
             * right 右栏显示列号或别名
             * suggestion 推荐栏显示列号或别名
             * value 填入值显示列号或别名
             * </pre>
             * @default <pre>
                {
                    left:0,
                    right:1,
                    suggestion:1,
                    value:1
                }
             * </pre>
            */
            display:{
                left:0,
                right:1,
                suggestion:1,
                value:1
            },
            delay:0,            
            /**
             * @cfg {integer} minLength 过滤的最小输入长度
             * @default 1
             */
            minLength:1
        };
        this.target = $(pObj);
        this.init();
        this.initialize(pOpts);
    }
    Address.prototype = {
        init:function() {
            var c = document.createElement('div');
            c.id = '_addressTemp_';
            c.style.display = 'none';
            $$.container.append(c);
            this.tempBox = $("#_addressTemp_");
        },
        initialize:function(pOpts) {
            this.setOptions(pOpts);            
            this.bindEvent();
        },
        setOptions:function(pOpts){
            $.extend(true,this.opts, pOpts);
            var _this = this;
            if (!this.opts.source){
                if (this.opts.jsonpSource){
                    $.ajax({
                        charset:this.opts.charset,
                        url:this.opts.jsonpSource,
                        dataType:"jsonp",
                        jsonp:"jsonpcallback",
                        success:function(data){
                            _this.opts.source = data;
                        }
                    });
                }
            }
            $.extend(this,{
                _isFocus:false,
                _enable:false,
                _focusClock:null,
                _checkClock:null,
                _tmpValue:null,
                _lastValue:null,
                _isCharIn:false,
                _suggestionContainer:null,
                _suggestionStyle:'position:absolute;top:-100000px;left:-100000px;z-index:200;',
                _isSuggestionRender:false,
                _filterContainer:null,
                _filterStyle:'position:absolute;top:-100000px;left:-100000px;z-index:200;',
                _sortReString:null,
                _displayRegExp:null,
                _displayHash:null,
                _colsHash:null,
                _suggestionEnable:false,
                _selectFlag:false,
                _getLengthRe:/[^\x00-\xFF]/g
            });
            if(this.opts.source.suggestion){
                this.suggestion = new Suggestion(this.target,{
                    source:_this.opts.source,
                    message:_this.opts.message,
                    template:{
                        suggestion:_this.opts.template.suggestion,
                        suggestionStyle:_this.opts.template.suggestionStyle,
                        suggestionInit:_this.opts.template.suggestionInit
                    },
                    tempBox:_this.tempBox
                });
                this.suggestion.container.bind("mousedown",function(e){ _this._filterMousedown(e); });
            }
            this.filter = new Filter(this.target,{
                source:_this.opts.source,
                message:_this.opts.message,
                jsonpFilter:_this.opts.jsonpFilter,
                sort:_this.opts.sort,
                display:_this.opts.display,
                template:{
                    filter:_this.opts.template.filter,
                    filterStyle:_this.opts.template.filterStyle,
                    filterInit:_this.opts.template.filterInit,
                    filterPageSize:_this.opts.template.filterPageSize
                },
                charset:_this.opts.charsetm,
                tempBox:_this.tempBox,
                container:_this.opts.template.filterContainer,
                isShowHover:_this.opts.isShowHover
            });
            this.filter.container.bind('mouseover',function(e){  _this._filterMouseover(e);});
            this.filter.container.bind('mousedown',function(e){  _this._filterMousedown(e);});            
        },
        bindEvent:function(){
            var _this = this;
            this.target.bind('focus',function(e){_this._focus(e);});
            this.target.bind('blur',function(){ _this._blur()});
            this.target.bind('keydown',function(e){ _this._keydown(e);});
            this.target.bind('keypress',function(e){ _this._keypress();});
            this.target.bind('mouseup',function(){ _this._mouseup();});
            //addition
            this.target.bind('mousedown',function(e){_this._focus(e);});
            this.target.bind('keydown',function(e){_this._focus(e);});
        },
        /**
         * @ method validate
         * 验证输入有效性
         * @param {boolean} 是否为精确匹配
         * @param {function} 回调函数，第一个参数为验证结果
         * @return {boolean} 返回验证结果，jsonpFilter方式下，返回值始终为false
         */
        validate:function(pIsAccurate,pFn){
            this._initSort();
            this._initDisplay();
            var _this=this;
            var val=this.target.val().trim().replace(/[\|@]/g,'');
            if (!val){
                this._unselect(true,true);
                return false;
            }
            if (this.jsonpFilter){
                this.filter.filterData(val,pIsAccurate,true,function(data){
                    if (data){
                        _this._select(data,true);
                        pFn&&pFn(true);
                    }else{
                        _this._unselect(false,true);
                        pFn&&pFn(false);
                    }
                });
                return false;
            }else{
                var data=this.filter.filterData(val,pIsAccurate,true);
                if (data){
                    this._select(data,true);
                    pFn&&pFn(true);
                    return true;
                }else{
                    this._unselect(false,true);
                    pFn&&pFn(false);
                    return false;
                }
            }
        },
        _focus:function(e){
            if (this._isFocus){
                if (this.opts.source.suggestion&&!this._suggestionEnable&&!this.filter._filterEnable){
                    this.suggestion.show();
                }
                return;
            }
            var _this = this;
            this._isFocus=true;
            this._isCharIn=false;
            this._tmpValue=this.filter._lastValue=null;
            this.filter.clear();
            this._inputCheck();
            clearTimeout(this._checkClock);
            clearInterval(this._focusClock);
            this._focusClock=setInterval(function(){ _this._focusInterval() },FOCUS_INTERVAL);
            var t=this.target[0];
            if(this.opts.source.data){
                switch (e.type){
                    case 'mousedown':
                        setTimeout(function(){
                            t.select();
                        });
                        break;
                    case 'focus':
                        t.select();
                        break;
                }
            }
        },
        _blur:function(){
            if(!this._isFocus) return;
            this._isFocus=false;
            this._hiddenSuggestion();
            this.filter.hide();
            clearTimeout(this._checkClock);
            clearInterval(this._focusClock);
            if (!this._selectFlag){
                if (this.opts.isAutoCorrect){
                    if (!this.opts.source){
                        this._unselect(true,true);
                        return;
                    }else{
                        this._unselect(false,true);
                        var _this = this;
                        this.validate(!this.opts.isAutoCorrect,function(t){
                            if (!t){
                                _this._unselect(true,false);
                            }
                        });
                    }
                }
            }
        },
        _keydown:function(e){
            switch (e.keyCode){
                case $.KEY_ENTER:
                    if (this.filter._filterEnable){
                        var t=this.filter._lastSelect;
                        this._isFocus = false;
                        if (t){
                            var data=t[0].getAttribute('data');
                            this._select(data);
                            this.target.trigger("enter");
                            return;
                        }
                        this._hiddenFilter();
                    }
                    this.target.trigger("enter");
                    break;
                case $.KEY_LEFT:
                case $.KEY_RIGHT:
                    if (this.filter._filterEnable){
                        var d=this.filter._lastFilterRendarData;
                        if (d&&d.page.max>=0){
                            switch (e.keyCode){
                                case $.KEY_LEFT:
                                    if (d.page.current>0){
                                        this.filter.updateFilter(null,null,d.page.current-1);
                                    }
                                    break;
                                case $.KEY_RIGHT:
                                    if (d.page.current<d.page.max){
                                        this.filter.updateFilter(null,null,d.page.current+1);
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case $.KEY_UP:
                case $.KEY_DOWN:                    
                    if(this.filter._filterEnable){
                        var t=this.filter._lastSelect,
                            d=this.filter._lastFilterRendarData,
                            els= this.filter.container.find('*[data]'),
                                index = -1;
                        if (t!==null&&d){                            
                            for (var i = els.length - 1; i >= 0; i--) {
                                if(els[i] == this.filter._lastSelect[0]){
                                    index = i;
                                    break;
                                }                                    
                            };
                            if (index!=-1){
                                var l=d.list.length;
                                index=(index+l+e.keyCode-39)%l;
                                this.filter.showHover(els[index]);
                            }else{
                                this.filter.showHover(els[0]);
                            }
                        }else{
                            this.filter.showHover(els[0]);
                        }
                    }
                    break;
                default:
                    if(!this.opts.isShowHover){
                        this.filter._lastSelect = null;
                    }
                    this._isCharIn=true;
                    return true;
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        },
        _keypress:function(){
            this._isCharIn=true;
        },
        _mouseup:function(){
            var t=this.target[0];
            if (t.releaseCapture){
                t.releaseCapture();
            }
        },        
        _focusInterval:function(){
            var val=this.target.val().trim().replace(/[\|@]/g,'');
            if (!this.opts.source||this._tmpValue===val){
                return;
            }
            this._tmpValue=val;
            if (this.delay){
                clearTimeout(this._checkClock);
                this._checkClock=setTimeout(this._inputCheck,this.delay);
            }else{
                this._inputCheck();
            }
        },
        _inputCheck:function(){
            var val=this.target.val().trim().replace(/[\|@]/g,'');
            if (!this.opts.source||this.filter._lastValue===val){
                return;
            }
            if (this.filter._lastValue!==null){
                this._isCharIn=true;
            }
            this.filter._lastValue=val;
            if (this._getLength(val)>=this.opts.minLength&&this._isCharIn){
                this._showFilter(val);
            }else{
                if(this.opts.source.suggestion){
                    this._showSuggestion();
                }
            }
        },
        _getLength:function(pStr){
            return pStr.replace(this._getLengthRe,'  ').length;
        },
        _showFilter:function(pVal){
            this.filter._filterEnable = true;
            this.filter._filterCount++;
            this._hiddenSuggestion();
            pVal=pVal.replace(/[\|@]/g,'');
            this._initSort();
            this._initDisplay();
            this.filter.filterData(pVal,false,false);
        },
        _hiddenFilter:function(){
            this.filter._filterEnable=false;
            this.filter.hide();
        },
        _showSuggestion:function(){
            this._suggestionEnable=true;
            this._hiddenFilter();
            this.suggestion.show();
        },
        _hiddenSuggestion:function(){
            if(this.opts.source.suggestion){
                this._suggestionEnable=false;
                this.suggestion.hide();
            }
        },
        _filterMouseover:function(e){
            var t=e.target;
            while (t&&t.tagName!='A'){
                t=t.parentNode;
            }
            if (t){
                var data=t.getAttribute('data');
                if (data){
                    this.filter.showHover(t);
                    return;
                }
            }
        },
        _filterMousedown:function(e){
            var t=e.target;
            while (t&&t.tagName!='A'){
                t=t.parentNode;
            }
            if (t){
                var data=t.getAttribute('data');
                if (data){
                    if ($$.browser.IsIE) {
                        var _this = this;
                        //防止点击到下方的iframe广告
                        t.onclick = function () {
                            _this._select(data);
                        };
                        this._isSuggestionRender = false;
                    } else {
                        this._select(data);
                    }
                }
                var page=t.getAttribute('page');
                if (page){
                    this.filter.updateFilter('','',+page);
                }
            }
            e.preventDefault();
            e.stopPropagation();
            t=this.target[0];
            if (t.setCapture){
                t.setCapture();
            }
            return false;
        },
        _initCols:function(){
            if (this._colsHash){
                return;
            }
            var t=this._colsHash={};
            if (this.opts.source.alias){
                for (var i=0,n=this.opts.source.alias.length;i<n;i++){
                    this._colsHash[this.opts.source.alias[i]]=i;
                }
            }
        },
        _initSort:function(){
            this._initCols();
            if (this._sortReString){
                return;
            }
            var t=this._sortReString=this.filter.sortReString={
                accurate:[],
                vague:[]
            };
            var k1=0,k2=0;
            switch ($.type(this.opts.sort)){
                case 'array':
                    for (var i=0,n=this.opts.sort.length;i<n;i++){
                        var arr=this.opts.sort[i].match(/^(\^?)([^\^\$\|@\r\n\+]+)(\+?)(\$?)$/);
                        if (arr){
                            if (/^\d$/.test(arr[2])){
                                arr[2]=parseInt(arr[2],10);
                            }else if (arr[2] in this._colsHash){
                                arr[2]=this._colsHash[arr[2]];
                            }else{
                                $.error('address._initSort','invalid sort column '+arr[2]);
                                continue;
                            }
                            var s=(+arr[2]||arr[3])?'([^\\|@]*\\|){'+arr[2]+(arr[3]?',':'')+'}':'';
                            t.accurate[k1++]=['@('+s,'','(\\|[^@]*)?)(?=@)'];
                            t.vague[k2++]=['@('+s+(arr[1]?'':'[^\\|@]*'),'',(arr[4]?'(\\|[^@]*)?':'[^@]*')+')(?=@)'];
                        }else{
                            $.error('address._initSort','invalid sort rule '+this.opts.sort[i]);
                        }
                    }
                    break;
                case 'function':
                    break;
                default:
                    $.error('address._initSort','invalid sort type '+this.opts.sort);
                    break;
            }
        },
        _initDisplay:function(){
            this._initCols();
            if (this._displayHash){
                return;
            }
            var t=this._displayHash=this.filter.displayHash={};
            var key,value;
            for (key in this.opts.display){
                value=this.opts.display[key];
                if (/^\d$/.test(value)){
                    t[key]=parseInt(value,10);
                }else if (value in this._colsHash){
                    t[key]=this._colsHash[value];
                }else{
                    t[key]=null;
                    $.error('address._initDisplay','invalid display column '+arr[1]);
                    continue;
                }
            }
        },
        _getItems:function(pData){
            this._initCols();
            var t=pData.split('|');
            var rv={length:t.length};
            for (var i=0,n=t.length;i<n;i++){
                rv[i]=t[i];
            }
            var k=this.opts.source.alias;
            if (k){
                for (var i=0,n=k.length;i<n;i++){
                    rv[k[i]]=t[i];
                }
            }
            return rv;
        },        
        _select:function(pData,pIsIgnoreFocusNext){
            var _this=this;
            this._selectFlag=true;
            setTimeout(function(){
                _this._selectFlag=false;
            });
            this._initDisplay();
            var t=pData.split('|');
            var val=t[this._displayHash.value]||'';
            this._tmpValue=this.filter._lastValue=val.trim();
            this.target.val(val);
            this.target.attr("data-val", pData);
            this.filter.clear();
            this._hiddenSuggestion();
            this._hiddenFilter();
            if (this.relate){
                for (var index in this.relate){
                    if (this.relate.hasOwnProperty(index)){
                        var relateEl=$(this.relate[index]);
                        if (!relateEl[0]){
                            $.error('address._select','invalid relate element');
                            continue;
                        }
                        if (/^\d$/.test(index)){
                            index=parseInt(index,10);
                        }else if (index in this._colsHash){
                            index=this._colsHash[index];
                        }else{
                            $.error('address._select','invalid relate column '+index);
                            continue;
                        }
                        relateEl.value(t[index]||'');
                    }
                }
            }
            this.target.trigger('change',{
                arguments:{
                    value:val,
                    data:pData,
                    items:this._getItems(pData)
                }
            });
            if (!pIsIgnoreFocusNext&&this.isFocusNext){
                var f=this.target[0].form;
                if (!f){
                    $.error('address._select','invalid form');
                    return;
                }
                var els=f.elements;
                for (var i=0,n=els.length-1;i<n;i++){
                    if (els[i]==this.target[0]){
                        setTimeout(function(){
                            els[i+1].focus();
                        });
                        return;
                    }
                }
            }
        },
        _unselect:function(pIsClearTarget,pIsClearRelate){
            if (pIsClearTarget){
                this._tmpValue=this.filter._lastValue=null;
                this.target.val('');
                this.filter.clear();
                this._hiddenSuggestion();
                this._hiddenFilter();
                this.target.trigger('change',{
                    arguments:{
                        value:'',
                        data:'',
                        items:null
                    }
                });
            }
            if (pIsClearRelate&&this.opts.relate){
                for (var index in this.opts.relate){
                    if (this.opts.relate.hasOwnProperty(index)){
                        var relateEl=$(this.opts.relate[index]);
                        if (!relateEl[0]){
                            $.error('address._select','invalid relate element');
                            continue;
                        }
                        relateEl.val('');
                    }
                }
            }
        }
    }
    function defaultSuggestionInit(pObj){
        var _spans=pObj.find('span'),
            _uls=pObj.find('ul');
        if (!_spans.length){
            return;
        }
        function switchTab(){
            var _this=this;
            _spans.each(function(i,span){
                if (span==_this){
                    $(span).addClass('hot_selected');
                    _uls[i].style.display='';
                }else{
                    $(span).removeClass('hot_selected');
                    _uls[i].style.display='none';
                }
            });
        }
        var w=30;
        for (var i=0,n=_spans.length;i<n;i++){
            w+=_spans[i].offsetWidth;
        }
        var t=pObj.find('div').first();
        if (t[0]){
            if (w>278){
                t.css('width',w+'px');
            }
        }
        _spans.bind('mousedown',switchTab);
        switchTab.apply(_spans[0]);
    }
    function defaultFilterInit(){

    }
    $.fn.extend({
        Address:function(pOpts) {
            var _defaults = {};
            if(typeof pOpts !== "undefined"){
                $.extend(true,_defaults,pOpts);
            }
            Address["instance"] = new Address(this,_defaults);
            return Address["instance"];
        }
    });
})(jQuery,undefined);