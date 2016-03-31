/*
* the initail mod gridView
* @Author:      dingyantao
* @CreateDate:  2014-10-09
*/
(function ($) {
    var formatThousandNum = function(pStr){
        var _s = pStr.split('.'),
            _fStr = _s[0],
            _lStr = _s.length > 1 ? '.' + _s[1] : '',
            _len = _fStr.length, _str2 = '', _max = Math.floor(_len / 3); 
        for(var i = 0 ; i < _max ; i++){
            var s = _fStr.slice(_len - 3, _len);
            _fStr = _fStr.substr(0, _len - 3);
            _str2 = (',' + s) + _str2;
            _len = _fStr.length;
        }
        _fStr += _str2 + _lStr;
        return _fStr.length > 0 && _fStr.substr(0,1) === ',' ? _fStr.substr(1,_fStr.length) : _fStr;
    }
    String.prototype.Thousand = function (pFiexed) {
        return formatThousandNum(parseFloat(this).toFixed(pFiexed === undefined ? 2 : pFiexed));
    };
    Number.prototype.Thousand = function(pFiexed){
        return formatThousandNum(this.toFixed(pFiexed === undefined ? 2 : pFiexed));
    };
    var GridTargetList = [];
    $(window).on("resize.gridView", function () {
        setTimeout(function () {
            for(var i = 0,l = GridTargetList.length;i < l;i++){
                var _oldWidth = GridTargetList[i].width();
                GridTargetList[i].css("width","0px");
                var _width = GridTargetList[i].parent().width();
                if(_width > 0){
                    GridTargetList[i].css("width",GridTargetList[i].parent().width());
                }else{
                    GridTargetList[i].css("width",_oldWidth);
                }
            }
        }, 0);
    });
    var GirdWhereList = [];
    $(document).on("click.grid_where",function(e){
        var _dom = $(e.target)
        for(var i = 0, l = GirdWhereList.length;i < l;i++){
            var _where =  GirdWhereList[i];
            if(!_where.hasParent(_dom[0],[_where.view[0],_where.btn[0]])){
                _where.hide();
            }
        }
    });
    var GridWhereControl = function(pObj,pOpts){//gridview筛选组件
        pOpts = $.extend({
            type:true,          //默认true 筛选类型 单选true 复选false
            bindDataSource:[],  //绑定数据 {key:"",value:""}
            panel:null,         //筛选panel
            btn:null,           //入口按钮
            icon:null,          //筛选小图标
            view:null,          //筛选view
            btns:null,          //单选按钮集合
            btnOk:null,         //复选确定按钮
            btnChecks:null,     //复选按钮集合
            btnAll:null,        //单选全选按钮
            checkAll:null,      //复选全选容器
            checkAllBtn:null,   //复选全选按钮
            selectData:[],      //选中的数据
            onChange:null       //选中事件
        }, pOpts);
        $.extend(this, pOpts);
        this.panel = $(pObj);
        this.init();
    };
    GridWhereControl.prototype = {
        init:function(){
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){            
            this.btn = this.panel.children("b");
            this.icon = this.btn.children("i");
            this.view = this.panel.children("ul");
            this.initView();
            if(this.type){//单选
                this.titleHtml = this.btn.children("span");
                this.title = this.titleHtml.data("title");
                this.btnAll = this.view.find("li:eq(0)>a");
                this.btns = this.view.find("li:gt(0)>a");
            }else{//复选
                this.checkAll = this.view.find("li:eq(0)>label");
                this.checkAllBtn = this.checkAll.children("input");
                this.btnChecks = this.view.find("li:gt(0) input");
                this.btnOk = this.view.find("li.btn>a");
            }
            GirdWhereList.push(this);
        },bindEvent:function(){
            var _this = this;
            this.btn.on("click.grid_where",function(){
                if(_this.btn.data("__type__")){                   
                    _this.hide();
                }else{
                    _this.show();
                }
            });
            if(this.type){
                this.btnAll.on("click.grid_where",function(){
                    _this.selectData = [];
                    _this.titleHtml.html(_this.title);
                    _this.hide();
                    _this.change();
                });
                this.btns.on("click.grid_where",function(){
                    _this.selectData = [];
                    _this.selectData.push($(this).data("value"));
                    _this.titleHtml.html($(this).html());
                    _this.hide();
                    _this.change();
                });
            }else{
                this.checkAll.on("click.grid_where",function(){
                    _this.setAll();
                });
                this.btnOk.on("click.grid_where",function(){
                    _this.hide();
                    _this.change();
                });
            }            
        },initView:function(){
            $$.container.append(this.view);            
        },show:function(){
            this.view.css({
                position:"absolute",
                left:this.btn.offset().left,
                top:this.btn.offset().top + this.btn.height() + 1
            });
            this.btn.data("__type__",true);
            this.panel.cover();
            this.panel.addClass("active");
            this.icon.removeClass("icon-caret-down").addClass("icon-caret-up");
            this.view.show();
        },hide:function(){
            //$(document).off("click.grid_where");
            this.btn.data("__type__",false);
            this.panel.uncover();
            this.panel.removeClass("active");
            this.icon.removeClass("icon-caret-up").addClass("icon-caret-down");
            this.view.hide();
        },change:function(pDom){
            $.type(this.onChange) === "function" && this.onChange.call(null);
        },setAll:function(){
            var _this = this;
            $.each(this.btnChecks,function(){
                this.checked = _this.checkAllBtn[0].checked;
            });
        },getData:function(){
            if(this.type){
                return this.selectData;
            }else{
                var _this = this;
                this.selectData = [];
                $.each(this.btnChecks,function(){
                    if(this.checked){
                        _this.selectData.push($(this).data("value"));
                    }
                });
                return this.selectData;
            }
        },hasParent:function (pSon, pDoms) {
            var _node = pSon,
                _val = false;
            if (_node != null) {
                for (var i = 0, l = pDoms.length; i < l; i++) {
                    if (pDoms[i] == _node) return true;
                }
                while (_node.parentNode != null) {
                    _node = _node.parentNode;
                    for (var i = 0, l = pDoms.length; i < l; i++) {
                        if (pDoms[i] == _node) return true;
                    }
                }
            }
            return _val;
        }
    };
    var GridPageControl = function (pObj, pOpts) {//gridview分页组件
        pOpts = $.extend({
            index:1,                    //当前页
            viewNum:3,
            pageNum:50,                 //每页显示数量
            total:100,                  //总数
            pageRate:[50,100,200,500],  //每页显示数量
            onChange:null,              //分页事件回调function(pIndex)
            onSetNum:null,               //设置每页显示数量function(pNum)
            type:true
        }, pOpts);
        $.extend(this, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    };
    GridPageControl.prototype = {
        init: function () {
            this.setOptions();
            if(this.type){
                this.viewPage(this.index);
            }else{
                this.viewPageNumber(this.index);
            }
        },
        setOptions: function () {
            
            this.pageTotal = this.total % this.pageNum > 0 ? parseInt(this.total / this.pageNum) + 1 : parseInt(this.total / this.pageNum);
        },
        prevPage: function () {
            this.index -= 1;
            return this.setPageByIndex(this.index);
        },
        nextPage: function () {
            this.index += 1;
            return this.setPageByIndex(this.index);
        },
        setTotle: function (pNum) {
            this.total = pNum;
            this.pageTotal = this.total % this.pageNum > 0 ? parseInt(this.total / this.pageNum) + 1 : parseInt(this.total / this.pageNum);
            if(this.type){
                this.viewPage(this.index);
            }else{
                this.viewPageNumber(this.index);
            }
        },
        bindEvent: function () {
            var _this = this;
            this.target.off("click.gridPage");
            this.target.on("click.gridPage", function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                target = target.tagName === "I" ? target.parentNode : target;
                if (target.tagName === "A") {
                    if($(target).hasClass("no")) return;
                    var _type = $(target).data("type"),
                        _hash = {
                            "prev":function(){ _this.prevPage() },
                            "next":function(){ _this.nextPage() },
                            "first":function(){ _this.setPageByIndex(1) },
                            "last":function(){ _this.setPageByIndex(_this.pageTotal) },
                            "refresh":function(){ _this.setPageByIndex(_this.index) }
                        }
                    if(_hash[_type]){
                        _hash[_type]();
                    }else{
                        var index = parseInt(target.innerHTML, 10);
                        _this.setPageByIndex(index);
                    }
                }
            });
            this.pageInput.on("keydown.gridPage",function(e){
                if(e.keyCode == $.KEY_ENTER){
                    _this.onEnter();
                }
            });
            this.goInput && this.goInput.on("click.gridPage",function(){
                _this.onEnter();
            });
            this.numDrop && this.numDrop.on("change.gridPage", function () {
                _this.pageNum = ~~_this.numDrop.val();
                if($.type(_this.onSetNum) === "function"){
                    _this.index = 1;
                    _this.setTotle(_this.total);
                    _this.onSetNum.call(this,_this.numDrop.val());
                }
            });
        },
        onEnter:function(){
            var _val = this.pageInput.val();
            _val = _val.replace(/\D/g,'');
            if(_val.length == 0) {
                this.setPageByIndex(1);
            }else{
                if(~~_val == this.index){
                    this.pageInput.val(this.index);
                    return;
                } 
                if(~~_val > this.pageTotal){
                    this.setPageByIndex(this.pageTotal);
                }else{
                    this.setPageByIndex(_val);
                }
            }
        },
        setPageByIndex: function (pIndex) {
            if (typeof pIndex === "undefined") {
                return this.index;
            } else {
                this.index = pIndex = ~ ~pIndex;
                if($.type(pIndex) === "number"){
                    if (pIndex < 1) {
                        return [false, "over-low"];
                    } else if (pIndex > this.pageTotal) {
                        return [false, "over-high"];
                    } else {
                        this.indexHtml && this.indexHtml.html(pIndex);                        
                        if(this.type){
                            this.pageInput.val(pIndex);
                            this.initPage();
                        }else{
                            this.viewPageNumber(pIndex);
                            this.pageInput.val(pIndex);
                        }                        
                        if($.type(this.onChange) === "function"){
                            this.onChange.call(null,pIndex);
                        }
                        return [true, ""];
                    }
                }                
            }
        },
        initPage:function(){
            if(this.index == 1){
                this.firstBtn && this.firstBtn.addClass("no");
                this.prevBtn.addClass("no");
            }else{
                this.firstBtn && this.firstBtn.removeClass("no");
                this.prevBtn.removeClass("no");
            }

            if(this.index < this.pageTotal){
                this.nextBtn.removeClass("no");
                this.lastBtn && this.lastBtn.removeClass("no");
            }else{
                this.nextBtn.addClass("no");
                this.lastBtn && this.lastBtn.addClass("no");
            }
        },
        viewPageNumber:function(pIndex){
            this.index = pIndex;
            var dnum = this.viewNum % 2,
                hnum = (this.viewNum - dnum) / 2,
                center = pIndex - (pIndex - dnum) % hnum,
                start = Math.max(1, center - hnum + 1 - dnum),
                end = Math.min(this.pageTotal, start + this.viewNum - 1);
            var template = '<div class="page_box">\
                <$ var start = GlobalData.start,end = GlobalData.end,currentIndex = GlobalData.currentIndex; $>\
                <div class="page">\
                    <span class="text">共 <$= GlobalData.total $> 条</span>\
                    <a href="javascript:" class="prev" data-type="prev">&lt;</a>\
                    <$ if(start > 1){ $>\
                        <a href="javascript:" class="num">1</a>\
                    <$ } $>\
                    <$ if(start > 2){ $>\
                        <span class="more">...</span>\
                    <$ } $>\
                    <$ for(;start < currentIndex;start++){ $>\
                        <a href="javascript:" class="num"><$= start $></a>\
                    <$ } $>\
                    <span class="num active"><$= GlobalData.currentIndex $></span>\
                    <$ for (currentIndex++; currentIndex <= end; currentIndex++) { $>\
                        <a href="javascript:" class="num"><$= currentIndex $></a>\
                    <$ } $>\
                    <$ if(end < GlobalData.pageTotal - 1){ $>\
                        <span class="more">...</span>\
                    <$ } $>\
                    <$ if(end < GlobalData.pageTotal){ $>\
                        <a href="javascript:" class="num"><$= GlobalData.pageTotal $></a>\
                    <$ } $>\
                    <a href="javascript:" class="next" data-type="next">&gt;</a>\
                    <span class="text"><input type="text"></span>\
                    <span class="button"><input type="button" value="Go"></span>\
                </div>\
            </div>';
            this.target.html($.template.replace(template,{
                total:this.total,
                currentIndex:pIndex,
                start:start,
                end:end,
                pageTotal:this.pageTotal
            }));
            this.prevBtn = this.target.find(".prev");
            this.nextBtn = this.target.find(".next");
            this.pageInput = this.target.find("input:eq(0)");
            this.goInput = this.target.find("input:eq(1)");
            this.initPage();
            this.bindEvent();
        },
        viewPage: function (pIndex) {
            this.index = pIndex;            
            var template = '\
                    <div class="pGroup"><select>\
                        <$ for(var i = 0,l = GlobalData.pageRate.length;i < l;i++){ $>\
                            <option value="<$= GlobalData.pageRate[i] $>"><$= GlobalData.pageRate[i] $>&nbsp;&nbsp;</option>\
                        <$ } $>\
                    </select></div>\
                    <div class="btnseparator"></div>\
                    <div class="pageNum">\
                        <div class="pGroup">\
                            <a href="javascript:" class="first" data-type="first" title="第一页"><i class="icon-step-backward"></i></a>\
                            <a href="javascript:" class="prev" data-type="prev" title="上一页"><i class="icon-caret-left"></i></a>\
                        </div>\
                        <div class="btnseparator"></div>\
                        <div class="pGroup">\
                            到<input type="text" value="<$= GlobalData.index $>" />页\
                        </div>\
                        <div class="btnseparator"></div>\
                        <div class="pGroup">\
                            <a href="javascript:" class="next" data-type="next" title="下一页"><i class="icon-caret-right"></i></a>\
                            <a href="javascript:" class="last" data-type="last" title="最后一页"><i class="icon-step-forward"></i></a>\
                        </div>\
                        <div class="btnseparator"></div>\
                        <div class="pGroup">\
                            <a href="javascript:" class="refresh" data-type="refresh" title="刷新"><i class="icon-refresh"></i></a>\
                        </div>\
                    </div>\
                    <div class="btnseparator"></div>\
                    <div class="pGroup"><span>共<$= GlobalData.pageTotal $>页</span></div>\
                    <div class="pGroup"><span><$= GlobalData.index $></span><span>/<$= GlobalData.pageTotal $></span></div>';
                    //<span>当前第<$= GlobalData.index $>页</span>\
            this.target.html($.template.replace(template,{
                pageRate:this.pageRate,
                index:this.index,
                total:this.total,
                pageTotal:this.pageTotal
            }));
            this.indexHtml = this.target.find("span:eq(1)");
            this.numDrop = this.target.find("select");
            this.numDrop.val(this.pageNum);
            this.firstBtn = this.target.find(".first");
            this.prevBtn = this.target.find(".prev");
            this.nextBtn = this.target.find(".next");
            this.lastBtn = this.target.find(".last");
            this.pageInput = this.target.find("input");
            this.initPage();
            this.bindEvent();
        }
    };
    $.fn.extend({
        GridPage: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            GridPageControl["instance"] = new GridPageControl(this, _defaults);
            return GridPageControl["instance"];
        },GridWhere:function(pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            return new GridWhereControl(this,_defaults);
        }
    });
    var GridControl = {};
    GridControl.ColHeadControl = $.Base.Event.extend({  //列头对象
        init: function (pOpts) {
            $.extend(this, {
                panel:null,
                colList:[],
                prevSort:null,
                headTempalte:'\
                    <tr>\
                        <$ for(var i = 0,l = GlobalData.colHead.length;i < l;i++){\
                            var item = GlobalData.colHead[i]; $>\
                            <th colspan="<$= item.colspan $>">\
                                <div style="text-align: center;"><$= item.title $></div>\
                            </th>\
                        <$ } $>\
                    </tr>',
                template:'\
                <div class="colHeadBox">\
                    <table cellpadding="0" cellspacing="0">\
                        <$= GlobalData.headHtml $>\
                        <tr>\
                        <$ if(GlobalData.isLeftTemplate && GlobalData.isTemplate){ $>\
                            <th class="grid_template" data-col="grid_template" align="center">\
                                <div style="text-align:center;width:<$= GlobalData.templateWidth - 10 $>px;">操作</div>\
                            </th>\
                        <$ } $>\
                        <$ if(GlobalData.isNumber){ $>\
                            <th data-col="grid_number" align="center">\
                                <div style="text-align: center;width:30px;"></div>\
                            </th>\
                        <$ } $>\
                        <$ if(GlobalData.isCheckBox){ $>\
                            <th data-col="grid_check" align="center">\
                                <div style="text-align: center;width:40px;">\
                                    <label><input type="checkbox" />全选</label>\
                                </div>\
                            </th>\
                        <$ } $>\
                        <$ for(var i = 0,l = GlobalData.colModule.length;i < l;i++){\
                            var item = GlobalData.colModule[i];$>\
                            <th data-col="<$= item.name $>" class="<$= item.className $>">\
                                <div style="text-align:<$= item.headAlign $>;width:<$= item.width $>px">\
                                <$ if(item.where){ $>\
                                    <span class="shelves">\
                                        <b style="width:<$= item.width $>px"><span data-title="<$= item.title $>"><$= item.title $></span><i class="icon-caret-down"></i></b>\
                                        <ul class="shelves_info" style="display:none;width:<$= item.width + 20 $>px">\
                                        <$ if(item.where.type){ $>\
                                            <li><a href="javascript:">全部</a></li>\
                                            <$ for(var j = 0,jl = item.where.bindDataSource.length;j < jl;j++){\
                                                var whereItem = item.where.bindDataSource[j]; $>\
                                                <li><a href="javascript:" data-value="<$= whereItem.value $>"><$= whereItem.key $></a></li>\
                                            <$ } $>\
                                        <$ }else{ $>\
                                            <li><label><input type="checkbox" />全部</label></li>\
                                            <$ for(var j = 0,jl = item.where.bindDataSource.length;j < jl;j++){\
                                                var whereItem = item.where.bindDataSource[j]; $>\
                                                <li><label><input type="checkbox" data-value="<$= whereItem.value $>" /><$= whereItem.key $></label></li>\
                                            <$ } $>\
                                            <li class="btn"><a href="javascript:" class="orangebtn">确认</a></li>\
                                        <$ } $>\
                                        </ul>\
                                    </span>\
                                <$ }else{ $>\
                                    <$= item.title $><i></i>\
                                <$ } $>\
                                </div>\
                            </th>\
                        <$ } $>\
                        <$ if(!GlobalData.isLeftTemplate && GlobalData.isTemplate){ $>\
                            <th class="grid_template" data-col="grid_template" align="center">\
                                <div style="text-align:center;width:<$= GlobalData.templateWidth - 10 $>px;">操作</div>\
                            </th>\
                        <$ } $>\
                        </tr>\
                    </table>\
                </div>'
            }, pOpts);
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){
            var _headHtml = null;
            if(this.colHead.length > 0){
                this.initColHead();
                _headHtml = $.template.replace(this.headTempalte,{
                    colHead:this.colHeadList
                });
            }
            this.panel.html($.template.replace(this.template,{
                colModule:this.colModule,
                templateWidth:this.templateWidth,
                isTemplate:this.isTemplate,
                isLeftTemplate:this.isLeftTemplate,
                isCheckBox:this.isCheckBox,
                isNumber:this.isNumber,
                headHtml:_headHtml == null ? "" : _headHtml
            }));
            this.colPanel = this.panel.find("tr:eq("+ (this.colHead.length > 0 ? 1 : 0) +")");
            if(this.isCheckBox){
                this.checkAll = this.colPanel.find("th:eq("
                    + ((false == this.isNumber ? 0 : 1) + (false == this.isLeftTemplate ? 0 : 1)) 
                    +") label");
                this.checkBtn = this.checkAll.children("input");
                this.newEvent("checkAll","memory");
            }
            this.initColList();
            this.newEvent("sortChange","memory");
            this.newEvent("whereChange","memory");
        },bindEvent:function(){
            var _this = this;
            if(this.isCheckBox){
                this.checkAll.on("click.gridView",function(){
                    _this.triggerEvent("checkAll",_this.checkBtn[0].checked);
                });
            }
        },initColHead:function(){
            var _col = [];
            this.isNumber && _col.push({title:""});
            this.isCheckBox && _col.push({title:""});            
            for(var i = 0,l = this.colHead.length;i < l;i++){
                _col.push({
                    title:this.colHead[i].title,
                    colspan:this.colHead[i].colspan
                });
            }
            this.isTemplate && _col.push({title:""});
            this.colHeadList = _col;
        },initColList:function(){
            var _this = this;
            for (var i = 0,l = this.colModule.length;i < l;i++) {
                var _col = new GridControl.ColControl({
                    panel:this.colPanel.find("th:eq(" + (i + this.otherColNumber) + ")"),
                    name:this.colModule[i].name,
                    isSort:this.isSort && this.colModule[i].isSort,
                    where:this.colModule[i].where
                });
                _col.addEvent("whereChange",function(){
                    _this.triggerEvent("whereChange",_this.getWhere());
                });
                _col.addEvent("sortChange",function(){
                    if(_this.prevSort && _this.prevSort.name != this.name){
                        _this.prevSort.removeSort();
                    }
                    _this.prevSort = this;
                    _this.triggerEvent("sortChange",{
                        sortName:this.name,
                        sortOrder:this.sortOrder
                    });
                });
                this.colList.push(_col);
            };
        },setSort:function(pName,pOrder){

        },setColWidth:function(pIndex){
            this.colList[pIndex].panel.children("div").css("width",this.colModule[pIndex].width + "px");
        },getWhere:function(){
            var _returnObj = {};
            for(var i = 0,l = this.colModule.length;i < l;i ++){
                if(this.colModule[i].where){
                    var _data = this.colList[i].gridWhere.getData();
                    if(_data.length > 0)_returnObj[this.colModule[i].name] = _data;
                }
            }
            return _returnObj;
        }
    });
    GridControl.ColControl = $.Base.Event.extend({    //列对象
        init: function (pOpts) {
            $.extend(this, {
                panel:null,
                name:null,
                gridWhere:null,
                where:null,
                isSort:false,
                sortBtn:null,
                sortOrder:null
            }, pOpts);
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){
            var _this = this;
            if(this.where){
                this.newEvent("whereChange","memory");
                this.gridWhere = this.panel.find("span.shelves").GridWhere({
                    type:this.where.type,
                    onChange:function(){
                        _this.triggerEvent("whereChange");
                    }
                });
            }else{
                if(this.isSort){
                    this.sortBtn = this.panel.find("i");
                    if(this.sortOrder){
                        this.sortBtn.addClass(this.sortOrder == "desc" ? "icon-arrow-down" : "icon-arrow-up");
                    }
                    this.newEvent("sortChange","memory");
                }
            }
        },bindEvent:function(){
            var _this = this;
            if(this.where){

            }else{
                if(this.isSort){
                    this.panel.hover(
                        function(){
                            _this.hoverSortBtn(true);
                        },function(){
                            if(_this.sortOrder){
                                _this.hoverSortBtn(false);
                            }else{
                                _this.sortBtn.removeClass("icon-arrow-down").removeClass("icon-arrow-up");
                            }
                        }
                    );
                    this.panel.on("click.gridView",function(){
                        if(_this.sortOrder){
                            _this.sortOrder = _this.sortOrder == "desc" ? "esc" : "desc";
                            _this.hoverSortBtn(false);
                        }else{
                            _this.sortOrder = "desc";
                        }
                        _this.triggerEvent("sortChange");
                    });
                }
            }                      
        },hoverSortBtn:function(pFlag){
            if(pFlag){
                if(this.sortBtn.hasClass("icon-arrow-down")){
                    this.sortBtn.removeClass("icon-arrow-down").addClass("icon-arrow-up");
                }else{
                    this.sortBtn.removeClass("icon-arrow-up").addClass("icon-arrow-down");
                }
            }else{
                if(this.sortOrder == "desc"){
                    this.sortBtn.removeClass("icon-arrow-up").addClass("icon-arrow-down");
                }else{
                    this.sortBtn.removeClass("icon-arrow-down").addClass("icon-arrow-up");
                }
            }
        },removeSort:function(){
            this.sortOrder = null;
            this.sortBtn.removeClass("icon-arrow-down").removeClass("icon-arrow-up");
        }
    });
    GridControl.DragControl = $.Base.Event.extend({   //拖拽线对象
        init: function (pOpts) {
            $.extend(this, {
                panel:null,
                colModule:null,
                scrollLeft:0,
                template:'\
                    <$ for(var i = 0,l = GlobalData.dragList.length;i < l;i++){\
                        var left = GlobalData.dragList[i]; $>\
                        <div style="height:<$= GlobalData.height $>px;left:<$= left $>px;"></div>\
                    <$ } $>\
                '
            }, pOpts);
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){
            this.loadPage();            
            this.newEvent("dragCol","memory");
        },bindEvent:function(){
            var _this = this;
            this.panel.children("div").each(function(i,pDom){
                var _dom = $(pDom);
                (function(index,dom,mouseDom){
                    var _downX = 0,
                        _isDonw = false;
                        _moveNum = 0;
                    dom.on("mousedown.gridView",function(e){
                        _downX = e.clientX;
                        dom.addClass("over");
                        _isDonw = true;
                        mouseDom.on({
                            "mousemove.gridView":function(e){
                                if(_isDonw){
                                    var _left = _this.dragList[index] + e.clientX - _downX;
                                    if(_left > _this.dragList[index] - _this.colModule[index].width + 20){
                                        _moveNum = e.clientX - _downX;
                                        dom.css("left",_left +"px");
                                    }                                    
                                }                                
                            },"mouseup.gridView":function(e){
                                if(_isDonw){
                                    dom.removeClass("over");
                                    _isDonw = false;
                                    _this.colModule[index].width += _moveNum;
                                    _this.loadPage();
                                    _this.bindEvent();
                                    _this.triggerEvent("dragCol",{
                                        index:index,
                                        moveNumber:_moveNum
                                    });
                                    mouseDom.off("mousemove").off("mouseup");
                                }
                            }
                        });
                    });                    
                })(i,_dom,_this.panel.parent());
            })
        },initDrag:function(){
            var _arr = [],
                _left = 0;
            if(this.isLeftTemplate){
                _left += this.templateWidth + 10;
            }
            if(this.isNumber){
                _left += 41;
            }
            if(this.isCheckBox){
                _left += 51;
            }
            for (var i = 0,l = this.colModule.length;i < l;i++){
                _left += this.colModule[i].width + 11;
                _arr.push(_left - 2 - this.scrollLeft);
            }
            this.dragList = _arr;
        },loadPage:function(){
            this.initDrag();
            this.panel.html($.template.replace(this.template,{
                height:this.height,
                dragList:this.dragList
            }));
        },setScrollLeft:function(pNum){
            this.scrollLeft = pNum;
            this.loadPage();
            this.bindEvent();
        }
    });
    GridControl.TableControl = $.Base.Event.extend({  //列表对象
        init: function (pOpts) {
            $.extend(this,{
                panel:null,
                rowList:[],
                colModule:null,
                data:null,
                height:null,
                selectRow:null,
                prevIndex:0,
                template:'\
                <table cellpadding="0" cellspacing="0" border="0" >\
                    <$ for(var i = 0,l = GlobalData.data.length;i < l;i++){\
                        var item = GlobalData.data[i],\
                            _trClass = (i + 1) % 2 == 0 ? "class=two" : ""; $>\
                        <tr <$= _trClass $> >\
                        <$ if(GlobalData.isLeftTemplate && GlobalData.isTemplate){ $>\
                            <td class="grid_template" data-col="grid_template" align="center">\
                                <div style="text-align:center;width:<$= GlobalData.templateWidth $>px;">\
                                    <$ for(var j = 0,jl = GlobalData.templateModule.length;j < jl;j++){\
                                        var temp = GlobalData.templateModule[j],\
                                            tempClass = true === temp.isDisable ? " disable" : "";\
                                        if($.type(temp.convert) === "function" && temp.convert.call(null,item) == false){\
                                            if(temp.convertClassName.length > 0){ $>\
                                                <a href="javascript:" data-template class="<$= temp.convertClassName + " disable" $>"><i class="<$= temp.iClass $>"></i><$= temp.title $></a>\
                                            <$ } $>\
                                        <$ }else{ $>\
                                            <a href="javascript:" data-template class="<$= temp.className + tempClass $>"><i class="<$= temp.iClass $>"></i><$= temp.title $></a>\
                                        <$ } $>\
                                    <$ } $>\
                                </div>\
                            </td>\
                        <$ } $>\
                        <$ if(GlobalData.isNumber){ $>\
                            <td data-col="grid_number" align="center">\
                                <div style="text-align: center;width:30px;"><$= i+1 $></div>\
                            </td>\
                        <$ } $>\
                        <$ if(GlobalData.isCheckBox){ $>\
                            <td data-col="grid_check" align="center">\
                                <div style="text-align: center;width:40px;">\
                                    <input type="checkbox" />\
                                </div>\
                            </td>\
                        <$ } $>\
                        <$ for(var j = 0,jl = GlobalData.colModule.length;j < jl;j++){\
                            var col = GlobalData.colModule[j],\
                                _class = 0 == col.className.length ? "" : "class=" + col.className ; $>\
                            <td align="<$= col.align $>" <$= _class $> data-name="<$= col.name $>" >\
                                <div style="text-align:<$= col.align $>;width:<$= col.width $>px">\
                                <$ if(col.isDetail){ $>\
                                    <a href="javascript:" class="icon_up">+</a>\
                                <$ } $>\
                                <$ if(col.type == "Label"){ $>\
                                    <$= col.formatter == null ? item[col.name] : col.formatter(item[col.name]) $>\
                                <$ }else if(col.type == "Text"){ $>\
                                    <$ if(col.convert != null && col.convert(item) === false){ $>\
                                        <input type="text" class="text" readonly="readonly" value="<$= col.formatter == null ? item[col.name] : col.formatter(item[col.name]) $>" />\
                                    <$ }else{ $>\
                                        <input type="text" class="text" value="<$= col.formatter == null ? item[col.name] : col.formatter(item[col.name]) $>" />\
                                    <$ } $>\
                                <$ }else if(col.type == "Select"){ $>\
                                    <select <$= (col.convert != null && col.convert(item) === false) ? "disabled=disabled" : "" $> >\
                                    <$ for(var k = 0,kl = col.bindDataSource.length;k < kl;k++){\
                                        var _check = item[col.name] == col.bindDataSource[k].value ? "selected=selected" : ""; $>\
                                        <option value="<$= col.bindDataSource[k].value $>" <$= _check $> ><$= col.bindDataSource[k].key $></option>\
                                    <$ } $>\
                                    </select>\
                                <$ }else if(col.type == "MaskSelect"){ $>\
                                    <$ if(item[col.name] != null){ $>\
                                    <input type="text" class="maskText" data-json=<$= $.jsonToString(item[col.name]) $> value="<$= item[col.name][col.maskName] $>" />\
                                    <$ }else { $>\
                                    <input type="text" class="maskText" />\
                                    <$ } $>\
                                    <a href="javascript:" class="maskBtn">…</a>\
                                <$ }else if(col.type == "Checkbox"){ $>\
                                    <$ if(col.convert != null && col.convert(item) === false){ $>\
                                        <input type="checkbox" disabled="disabled" <$= item[col.name] == true ? "checked=checked" : "" $> />\
                                    <$ }else{ $>\
                                        <input type="checkbox" <$= item[col.name] == true ? "checked=checked" : "" $> />\
                                    <$ } $>\
                                <$ } $>\
                                </div>\
                            </td>\
                        <$ } $>\
                        <$ if(!GlobalData.isLeftTemplate && GlobalData.isTemplate){ $>\
                            <td class="grid_template" data-col="grid_template" align="center">\
                                <div style="text-align:center;width:<$= GlobalData.templateWidth $>px;">\
                                    <$ for(var j = 0,jl = GlobalData.templateModule.length;j < jl;j++){\
                                        var temp = GlobalData.templateModule[j],\
                                            tempClass = true === temp.isDisable ? " disable" : "";\
                                        if($.type(temp.convert) === "function" && temp.convert.call(null,item) == false){\
                                            if(temp.convertClassName.length > 0){ $>\
                                                <a href="javascript:" data-template class="<$= temp.convertClassName + " disable" $>"><i class="<$= temp.iClass $>"></i><$= temp.title $></a>\
                                            <$ } $>\
                                        <$ }else{ $>\
                                            <a href="javascript:" data-template class="<$= temp.className + tempClass $>"><i class="<$= temp.iClass $>"></i><$= temp.title $></a>\
                                        <$ } $>\
                                    <$ } $>\
                                </div>\
                            </td>\
                        <$ } $>\
                        </tr>\
                        <tr class="detial none">\
                            <td colspan="<$= GlobalData.detail.colspan $>"><div style="width:auto"></div></td>\
                        </tr>\
                    <$ } $>\
                </table>', 
                rowTempalte:'\
                <tr <$= GlobalData.trClass $> >\
                    <$ if(GlobalData.isLeftTemplate && GlobalData.isTemplate){ $>\
                        <td class="grid_template" data-col="grid_template" align="center">\
                            <div style="text-align:center;width:90px;">\
                                <a href="javascript:" data-type="delete" class="graybtn"><i class="icon-trash"></i>删除</a>\
                            </div>\
                        </td>\
                    <$ } $>\
                    <$ if(GlobalData.isCheckBox){ $>\
                        <td data-col="grid_check" align="center">\
                            <div style="text-align: center;width:40px;">\
                                <input type="checkbox" />\
                            </div>\
                        </td>\
                    <$ } $>\
                    <$ if(GlobalData.data){\
                        var item = GlobalData.data; $>\
                    <$ for(var j = 0,jl = GlobalData.colModule.length;j < jl;j++){\
                        var col = GlobalData.colModule[j],\
                            _class = 0 == col.className.length ? "" : "class=" + col.className ;\
                        if(GlobalData.rowAddModule.indexOf("," + col.name + ",") !== -1){ $>\
                            <td align="<$= col.align $>" <$= _class $> data-name="<$= col.name $>" >\
                                <div style="text-align:<$= col.align $>;width:<$= col.width $>px">\
                                <$ if(col.isDetail){ $>\
                                    <a href="javascript:" class="icon_up">+</a>\
                                <$ } $>\
                                <$ if(col.type == "Label"){ $>\
                                    <$= col.formatter == null ? item[col.name] : col.formatter(item[col.name]) $>\
                                <$ }else if(col.type == "Text"){ $>\
                                    <input type="text" class="text" value="<$= col.formatter == null ? item[col.name] : col.formatter(item[col.name]) $>" />\
                                <$ }else if(col.type == "Select"){ $>\
                                    <select>\
                                    <$ for(var k = 0,kl = col.bindDataSource.length;k < kl;k++){\
                                        var _check = item[col.name] == col.bindDataSource[k].value ? "selected=selected" : ""; $>\
                                        <option value="<$= col.bindDataSource[k].value $>" <$= _check $> ><$= col.bindDataSource[k].key $></option>\
                                    <$ } $>\
                                    </select>\
                                <$ }else if(col.type == "MaskSelect"){ $>\
                                    <$ if(item[col.name] != null){ $>\
                                    <input type="text" class="maskText" data-json=<$= $.jsonToString(item[col.name]) $> value="<$= item[col.name][col.maskName] $>" />\
                                    <$ }else { $>\
                                    <input type="text" class="maskText" />\
                                    <$ } $>\
                                    <a href="javascript:" class="maskBtn">…</a>\
                                <$ }else if(col.type == "Checkbox"){ $>\
                                    <$ if(col.convert != null && col.convert(item) === false){ $>\
                                        <input type="checkbox" disabled="disabled" <$= item[col.name] == true ? "checked=checked" : "" $> />\
                                    <$ }else{ $>\
                                        <input type="checkbox" <$= item[col.name] == true ? "checked=checked" : "" $> />\
                                    <$ } $>\
                                <$ } $>\
                                </div>\
                            </td>\
                        <$ }else{ $>\
                            <td><div style="text-align:<$= col.align $>;width:<$= col.width $>px"></div></td>\
                        <$ } $>\
                    <$ } $>\
                    <$ }else{ $>\
                    <$ for(var j = 0,jl = GlobalData.colModule.length;j < jl;j++){\
                        var col = GlobalData.colModule[j],\
                            _class = 0 == col.className.length ? "" : "class=" + col.class ;\
                        if(GlobalData.rowAddModule.indexOf("," + col.name + ",") !== -1){ $>\
                            <td align="<$= col.align $>" <$= _class $> data-name="<$= col.name $>" >\
                                <div style="text-align:<$= col.align $>;width:<$= col.width $>px">\
                                <$ if(col.type == "Text"){ $>\
                                    <input type="text" class="text" value="" />\
                                <$ }else if(col.type == "Select"){ $>\
                                    <select>\
                                    <$ for(var k = 0,kl = col.bindDataSource.length;k < kl;k++){ $>\
                                        <option value="<$= col.bindDataSource[k].value $>" ><$= col.bindDataSource[k].key $></option>\
                                    <$ } $>\
                                    </select>\
                                <$ }else if(col.type == "MaskSelect"){ $>\
                                    <input type="text" class="maskText" />\
                                    <a href="javascript:" class="maskBtn">…</a>\
                                <$ }else if(col.type == "Checkbox"){ $>\
                                    <$ if(col.convert != null && col.convert(item) === false){ $>\
                                        <input type="checkbox" disabled="disabled" <$= item[col.name] == true ? "checked=checked" : "" $> />\
                                    <$ }else{ $>\
                                        <input type="checkbox" <$= item[col.name] == true ? "checked=checked" : "" $> />\
                                    <$ } $>\
                                <$ } $>\
                                </div>\
                            </td>\
                        <$ }else{ $>\
                            <td><div style="text-align:<$= col.align $>;width:<$= col.width $>px"></div></td>\
                        <$ } $>\
                    <$ } $>\
                    <$ } $>\
                    <$ if(!GlobalData.isLeftTemplate && GlobalData.isTemplate){ $>\
                        <td class="grid_template" data-col="grid_template" align="center">\
                            <div style="text-align:center;width:90px;">\
                                <a href="javascript:" data-type="delete" class="graybtn"><i class="icon-trash"></i>删除</a>\
                            </div>\
                        </td>\
                    <$ } $>\
                </tr>'
            }, pOpts);
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){
            this.panel.css("height",this.height+"px");
            this.loadPage(this.data);
        },bindEvent:function(){
        },loadPage: function (pData) {
            this.selectRow = null;
            this.data = pData || this.data;
            this.panel.html($.template.replace(this.template,{
                data:this.data,
                colModule:this.colModule,
                templateWidth:this.templateWidth,
                isTemplate:this.isTemplate,
                isLeftTemplate:this.isLeftTemplate,
                templateModule:this.templateModule,
                isCheckBox:this.isCheckBox,
                isNumber:this.isNumber,
                detail:this.getDetail()
            }));
            var _this = this,
                _rowsPanel = this.panel.find("tr");
            this.rowList = [];
            for (var i = 0,l = this.data.length;i < l;i++){
                var _row = new GridControl.RowControl({
                    panel:$(_rowsPanel[i * 2]),
                    detialPanel:$(_rowsPanel[i * 2 + 1]),
                    data:this.data[i],
                    colModule:this.colModule,
                    isTemplate:this.isTemplate,
                    isLeftTemplate:this.isLeftTemplate,
                    otherColNumber:this.otherColNumber,
                    templateModule:this.templateModule,
                    isCheckBox:this.isCheckBox,
                    isNumber:this.isNumber,
                    onDetail:this.onDetail,
                    onDoubleClick:this.onDoubleClick,
                    onClick:this.onClick,
                    onCheck:this.onCheck
                });
                _row.addEvent("onChange",function(pCell){
                    _this.setSelectRow(this.panel);
                    //_this.setSelectCell(pCell);
                });
                this.rowList.push(_row);
            }
        },getDetail:function(){
            var _w = 0,_colspan = 0;
            //_colspan += this.isLeftTemplate == true ? 1 : 0;
            //_w += this.isLeftTemplate == true ? this.templateWidth : 0;
            _colspan += this.isNumber == true ? 1 : 0;
            _w += this.isCheckBox == true ? 40 : 0;
            _colspan += this.isCheckBox == true ? 1 : 0;
            _w += this.isTemplate == true ? 160 : 0;
            _colspan += this.isTemplate == true ? 1 : 0;
            for (var i = this.colModule.length - 1; i >= 0; i--) {
                _w += this.colModule[i].width;
                _colspan++;
            };
            return {
                width:_w,
                colspan:_colspan
            };
        },checkAll:function(pFlag){
            for (var i = this.rowList.length - 1; i >= 0; i--) {
                this.rowList[i].check(pFlag);
            };
        },getSelectedData:function(){
            var _returnObj = [];
            for(var i = 0,l = this.rowList.length;i < l;i++){
                if(this.rowList[i].checkBtn[0].checked){
                    _returnObj.push(this.rowList[i].getData());
                }
            };
            return _returnObj;
        },addRow:function(pData){
            var _this = this,
                _rowLength = this.rowList.length,
                _newRowPanel = $($.template.replace(this.rowTempalte,{
                    trClass:_rowLength % 2 == 0 ? "class=two" : "",
                    colModule:this.colModule,
                    rowAddModule:this.rowAddModule,
                    isTemplate:this.isTemplate,
                    isLeftTemplate:this.isLeftTemplate,
                    templateModule:this.templateModule,
                    isCheckBox:this.isCheckBox,
                    data:pData || {}
                }));
            if(this.selectRow){
                _newRowPanel.insertAfter(this.selectRow);
            }else{
                this.panel.find("table").append(_newRowPanel);
            }
            var _row = new GridControl.RowControl({
                panel:_newRowPanel,
                colModule:this.colModule,
                rowAddModule:this.rowAddModule,
                isTemplate:this.isTemplate,
                isLeftTemplate:this.isLeftTemplate,
                otherColNumber:this.otherColNumber,
                templateModule:this.templateModule,
                isCheckBox:this.isCheckBox,
                isNumber:this.isNumber,
                data:pData || {},
                type:"add",
                onCheck:this.onCheck
            });
            _row.addEvent("onChange",function(){
                _this.setSelectRow(this.panel);
            });
            _row.addEvent("addDetele",function(){
                if(_this.selectRow == this.panel) _this.selectRow = null;
                this.panel.remove();
                this.isDeleteRow = true;//这块写的有点坑
                _this.deleteRow();
            });
            this.rowList.push(_row);
            return _newRowPanel;
        },getData:function(){
            var _returnObj = [];
            for(var i = 0,l = this.rowList.length;i < l;i++){
                _returnObj.push(this.rowList[i].getData());
            }
            return _returnObj;
        },getUpdateData:function(){
            var _returnObj = [];
            for(var i = 0,l = this.rowList.length;i < l;i++){
                var _data = this.rowList[i].getUpdateData();
                if(_data){
                    _returnObj.push(_data);
                }                
            }
            return _returnObj;
        },getDataByType:function(pType){
            var _returnObj = [];
            for(var i = 0,l = this.rowList.length;i < l;i++){
                if(this.rowList[i].type == pType){
                    _returnObj.push(this.rowList[i].getData());
                }
            }
            return _returnObj;
        },setColWidth:function(pIndex,pMove){
            var _this = this;
            this.panel.find(">table>tbody>tr:not(.detial)").each(function(i,dom){
                $(dom).find("td:eq(" + (_this.otherColNumber + pIndex) + ")>div").css("width",_this.colModule[pIndex].width + "px");
            });
        },setSort:function(pName,pOrder){
            this.data = this.getData();
            if(this.data.length > 0){
                var _type = isNaN(this.data[0][pName] * 1);
                if(_type){
                    this.sortData(pName,pOrder == "desc");
                }else{
                    this.data.sort(pOrder == "desc"
                        ? function(a,b){
                            return b[pName] - a[pName];
                        } : function(a,b){
                            return a[pName] - b[pName];
                        }
                    );
                }
            }
            this.loadPage();
        },sortData:function(pName,pFlag){
            if(pFlag){
                this.data.sort(function(a,b){
                    return a[pName] == b[pName] ? 0 : b[pName] > a[pName]  ? 1 : -1;
                });
            }else{
                this.data.sort(function(a,b){
                    return a[pName] == b[pName] ? 0 : a[pName] > b[pName] ? 1 : -1;
                });
            }
        },setSelectRow:function(pDom){
            if(this.selectRow){
                this.selectRow.removeClass("selected");
            }
            this.selectRow = pDom;
            this.selectRow.addClass("selected");
        },selectedRows:function(pData,pName){
            var _rows = [];
            $.extend(_rows,pData,true);
            for(var i = 0,l = this.rowList.length;i < l;i++){
                if(_rows.length == 0) return;
                if(this.rowList[i].data[pName] === _rows[0][pName]){
                    this.rowList[i].checkBtn[0].checked = true;
                    _rows.shift();
                }
            }
        },setSelectCell:function(pDom){
            /*if(this.selectCell){
                this.selectCell.removeClass("");
            }
            this.selectCell = pDom;
            this.selectCell.addClass("");*/
        },deleteRow:function(){
            for (var i = this.rowList.length - 1; i >= 0; i--) {
                if(this.rowList[i].isDeleteRow){
                    this.rowList.splice(i,1);
                    return;
                }
            };
        },selectRowByName:function(pData,pName,pFlag){
            var _hitIndex = null,
                _hitRow = null,
                _isHit = false,
                _isFlag = false;
            for(var i = 0,l = this.rowList.length;i < l;i++) {
                if(pFlag){
                    if(this.rowList[i].data[pName].indexOf(pData[pName]) !== -1){
                        _isFlag = true;
                    }
                }else{
                    if(this.rowList[i].data[pName] == pData[pName]){
                        _isFlag = true;
                    }
                }
                if(_isFlag){
                    if(i <= this.prevIndex && !_isHit){
                        _hitIndex = i;
                        _hitRow = this.rowList[i].panel;
                        _isHit = true;
                        continue;
                    }
                    if(this.prevIndex == 0 || i > this.prevIndex){
                        this.prevIndex = i;
                        this.rowList[i].panel.trigger("click.gridView");
                        return;
                    }
                }
            }
            this.prevIndex = _hitIndex;
            _hitRow.trigger("click.gridView");
        }
    });
    GridControl.RowControl = $.Base.Event.extend({    //行对象
        init: function (pOpts) {
            $.extend(this, {
                panel:null,
                detialPanel:null,
                detialBtn:null,
                data:null,
                cellList:{},
                checkBtn:null,
                updateBtn:null,
                deleteBtn:null,
                rowAddModule:null,
                templateState:[],
                type:"load",
                onCheck:null
            }, pOpts);
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){
            this.oldData = $.extend(true,{},this.data);
            this.detialBtn = this.panel.find("a.icon_up");
            if(this.isCheckBox){
                this.checkBtn = this.panel.find("td:eq("
                    +((false == this.isNumber ? 0 : 1) + (false == this.isLeftTemplate ? 0 : 1))
                    +") input");
            }
            if(this.isTemplate){
                this.templateBtns = this.panel.find(".grid_template a");
            }
            this.initCells();
            this.initTemplate();
            if(this.rowAddModule){
                this.newEvent("addDetele","memory");
            }
            this.newEvent("onChange","memory");
        },bindEvent:function(){
            var _this = this;
            if(this.onDoubleClick){
                this.panel.on("dblclick.gridView",function(){
                    if($.type(_this.onDoubleClick) === "function"){
                        _this.onDoubleClick.call(null,_this.data);
                    }
                });
            } 
            if(this.isCheckBox){
                this.checkBtn.on("click.gridview",function(){
                    if($.type(_this.onCheck) === "function"){
                        _this.onCheck.call(null,_this.checkBtn,_this.data);
                    }
                });
            }           
            this.panel.on("click.gridView",function(e){
                _this.triggerEvent("onChange");
                e = e || window.event;
                var target = e.target || e.srcElement;
                if(target.tagName == "INPUT"){
                    if(target.getAttribute("type") == "checkbox") return;
                } 
                if(_this.onClick){
                    $.type(_this.onClick) === "function" && _this.onClick.call(_this,_this.data);
                }
            });
            if(_this.rowAddModule){
                _this.templateBtns.on("click.gridView",function(){
                    _this.triggerEvent("addDetele");
                    return;
                });
            }else{
                for (var i = 0,l = this.templateModule.length; i < l; i++) {                    
                    if(this.templateModule[i].isDisable) continue;
                    if(this.templateState[i].flag){
                        (function(index,btnIndex){
                            _this.templateBtns.eq(btnIndex).on("click.gridView",function(){
                                if($.type(_this.templateModule[index].onChange) === "function"){
                                    _this.templateModule[index].onChange.call(_this, _this.data, $(this));
                                }                                
                            });
                        })(i,this.templateState[i].btnIndex);
                    }
                };
            }
            this.detialBtn.on("click.gridView",function(){
                if(_this.detialBtn.data("type") === undefined){
                    if($.type(_this.onDetail) === "function"){
                        _this.onDetail.call(_this, _this.data, _this.detialPanel.find("div"));
                        _this.detialBtn.html("-").removeClass("icon_up").addClass("icon_down").data("type",true);
                        _this.detialPanel.show();
                    }
                }else{
                    if(_this.detialBtn.data("type")){
                        _this.detialBtn.html("+").removeClass("icon_down").addClass("icon_up").data("type",false);
                        _this.detialPanel.hide();
                    }else{
                        _this.detialBtn.html("-").removeClass("icon_up").addClass("icon_down").data("type",true);
                        _this.detialPanel.show();
                    }
                }
            });
        },initCells:function(){
            var _this = this;
            for (var i = 0,l = this.colModule.length;i < l;i++){
                var _col = this.colModule[i];
                if(_col.type != "Label"){
                    var _cell = new GridControl.CellControl({
                        data:this.data,
                        rowPanel:this.panel,
                        panel:this.panel.find("td:eq(" + (i + this.otherColNumber) + ")"),
                        colModule:_col
                    });
                    this.cellList[_col.name] = _cell;
                    if(_col.init && $.type(_col.init) == "function"){
                        _col.init.call(null,_cell.btn,_cell.maskBtn,_this.panel,this.data);
                    }
                }
            };
        },initTemplate:function(){
            var _index = 0;
            for (var i = 0,l = this.templateModule.length; i < l; i++) {
                var _convert = this.templateModule[i].convert;
                if(_convert && $.type(_convert) === "function"){
                    var _flag = _convert.call(null,this.data);
                    this.templateState.push({
                        flag:_flag,
                        btnIndex:(false == _flag && this.templateModule[i].convertClassName.length == 0) ? --_index : _index
                    });
                }else{
                    this.templateState.push({
                        flag:true,
                        btnIndex:_index
                    });
                }
                _index++;
            };
        },check:function(pFlag){
            if(this.checkBtn){
                this.checkBtn[0].checked = pFlag;
            }
        },getData:function(){
            var _returnObj = this.data || {};
            for(var key in this.cellList){
                _returnObj[key] = this.cellList[key].getValue();
            }
            return _returnObj;
        },getUpdateData:function(){
            var _this = this,
                _flag = false,
                _returnObj = this.data || {};
            for(var key in this.cellList){
                _returnObj[key] = this.cellList[key].getValue();
                for (var i = _this.colModule.length - 1; i >= 0; i--) {
                    if(_this.colModule[i].name == key){
                        if(_this.colModule[i].type == "MaskSelect"){
                            var _maskName = _this.colModule[i].maskName;
                            if(_this.oldData[key][_maskName] != _returnObj[key][_maskName]){
                                _flag = true;
                            }
                        }else{
                            if(_this.oldData[key] != _returnObj[key]){
                                _flag = true;
                            }
                        }
                    }
                }                
            }
            return false == _flag ? null : _returnObj;
        }
    });
    GridControl.CellControl = $.Base.Event.extend({   //单元格对象
        init: function (pOpts) {
            $.extend(this, {
                data:null,
                rowPanel:null,
                panel:null,
                btn:null,
                maskBtn:null,
                colModule:null
                //type:"Text" //默认输入框Text,选择框Select,弹层MaskSelect 3种
            }, pOpts);
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){
            if(this.colModule.type == "Text"){
                this.btn = this.panel.find("input");
            }else if(this.colModule.type == "Select"){
                this.btn = this.panel.find("select");
            }else if(this.colModule.type == "MaskSelect"){
                this.btn = this.panel.find("input");
                this.maskBtn = this.panel.find("a.maskBtn");
            }else if(this.colModule.type == "Checkbox"){
                this.btn = this.panel.find("input");
            }else{
                this.btn = this.panel.find("div");
            }
        },bindEvent:function(){
            var _this = this;
            if((this.colModule.type == "Text" || this.colModule.type == "Select" || this.colModule.type == "Checkbox") && this.colModule.triggerList.length > 0){
                for(var i = 0,l = this.colModule.triggerList.length;i < l;i++){
                    var _trigger = this.colModule.triggerList[i];
                    if(_trigger.triggerType){
                        (function(trigger){
                            _this.btn.on(trigger.triggerType,function(e){
                                if($.type(trigger.triggerChange) === "function"){
                                    trigger.triggerChange.call(_this,_this.data,_this.btn,_this.rowPanel,e);
                                }
                            });
                        })(_trigger);
                    }                    
                }
            }else if(this.colModule.type == "MaskSelect" && this.colModule.onMask){
                this.maskBtn.on("click.gridView",function(e){
                    if($.type(_this.colModule.onMask) === "function"){
                        _this.colModule.onMask.call(_this,_this.data,_this.btn,_this.rowPanel,e);
                    }
                });
            }
        },getValue:function(){
            if(this.colModule.type == "Text" || this.colModule.type == "Select"){
                return this.btn.val()
            }else if(this.colModule.type == "MaskSelect"){
                return this.btn.data("json");
            }else if(this.colModule.type == "Checkbox"){
                return this.btn[0].checked;
            }
        },setValue:function(pVal){
            if(this.colModule.type == "Text" || this.colModule.type == "Select"){
                this.btn.val(pVal);
            }else if(this.colModule.type == "Label"){
                this.btn.html(pVal);
            }else if(this.colModule.type == "MaskSelect"){
                this.btn.val(pVal[this.colModule.maskName]);
                this.btn.data("json",pVal);
            }else if(this.colModule.type == "Checkbox"){
                return this.btn[0].checked = pVal;
            }
        }
    });
    GridControl.OtherControl = $.Base.Event.extend({  //其他数据对象
        init: function (pOpts) {
            $.extend(this, {
                panel:null,
                data:[],
                template:'\
                    <div class="grid_table"><div style="float:left;padding-right:40px">\
                        <table cellpadding="0" cellspacing="0" border="0">\
                            <$ for(var i =0,l = GlobalData.length;i < l;i++){\
                                var row = GlobalData[i]; $>\
                                <tr>\
                                    <$ for(var j = 0,jl = row.length;j < jl;j++){ \
                                        var item = row[j]; $>\
                                    <td><div style="width:<$= item $>px"></div></td>\
                                    <$ } $>\
                                </tr>\
                            <$ } $>\
                        </table>\
                    </div></div>'
            }, pOpts);
        },setOptions:function () {
            this.panel.hide();
        },loadPage:function(pData){
            this.formatData(pData.length);
            this.panel.html($.template.replace(this.template,this.data));
            this.panel.children("div").css({
                "overflow":"hidden"
            })
            this.render(pData);
            this.panel.show();
        },formatData:function(pLength){
            this.data = [];
            for(var i =0,l = pLength;i < l;i++){
                var _list = [];
                if(this.isTemplate){
                    _list.push(this.templateWidth);
                }
                if(this.isNumber){
                    _list.push(30);
                }
                if(this.isCheckBox){
                    _list.push(40);
                }
                for(var j = 0,jl = this.colModule.length;j < jl;j++){
                    _list.push(this.colModule[j].width);
                }
                this.data.push(_list);
            }
        },render:function(pData){
            for(var i =0,l = pData.length;i < l;i++){
                var _rowPanel = this.panel.find("tr:eq("+i+")");
                for(var j = 0,jl = pData[i].length;j < jl;j++){
                    var _item = pData[i][j];
                    _rowPanel.find("td:eq("+ _item.index +") div").html(_item.text);
                }
            }
        },setColWidth:function(pIndex){
            var _this = this;
            this.panel.find("tr").each(function(i,dom){
                $(dom).find("td:eq(" + (_this.otherColNumber + pIndex) + ")>div").css("width",_this.colModule[pIndex].width + "px");
            });
        }
    });
    var GridView = function  (pObj,pOpts) {
        this.opts = {
            datasource:[],      //数据源绑定 json格式 [{},{}]
            width:null,             //默认不设置 自动获取父节点的宽度
            height:500,             //列表高度 默认200
            headAlign:"center",     //默认center 全局列头对齐方式：left center right
            pageModule:{                //--分页配置--
                panel:null,                   //分页容器 默认null 需配置jQeryDom
                isTop:false,                  //是否置顶
                index:1,                      //当前页
                pageNum:50,                   //当前每页显示数量
                pageRate:[50,100,200,500],    //每页显示数量
                total:50,                     //总数
                onChange:null,                //分页事件回调function(pIndex)
                onSetNum:null,                //设置每页显示数量function(pNum)
                type:true                     //两套分页默认true
            },
            colHead:[],//列头合并用
            /*{
                title:""        //列头名
                colspan:1       //合并列数
            }*/
            colModule:[],        //字段映射文本模块---------------------------
            /*{
                name:"",            //属性名
                title:"",           //列头名
                width:100,          //默认100        宽度 例如：100=100px
                headAlign:"center", //默认center     列头对齐方式：left center right
                align:"center",     //默认center     对齐方式：left center right
                className:"",       //默认无样式     可添加空格分割的class 可控制子元素样式
                type:"Label",       //默认显示Label  输入框Text 选择框Select 弹层MaskSelect 复选框Checkbox 5种
                formatter:null,     //function(val)  格式化数据用，只适用于Label与Text列
                convert:null,       //function(data) 转换行内是否在Text类型下readonly
                bindDataSource:[],  //Select绑定数据 {key:"",value:""}
                maskName:"",        //映射对应maskSelect显示部分的属性名 仅type:"MaskSelect"时使用
                triggerList:[       //绑定多个事件
                    {
                        triggerType:null,                                   //默认不绑定 绑定事件类型
                        triggerChange:function(pData,pBtn,pRowPanel),       //绑定事件回调
                    }
                ],
                init:function(pBtn,pMaskBtn),                       //type!="Label"的初始化
                onMask:function(pData,pBtn,pRowPanel){}             //MaskSelect的click回调
                isSort:true,
                where:null,             //默认不筛选
                {                       //列筛选
                    type:true,          //默认true  筛选类型 单选true 复选false
                    bindDataSource:[]   //绑定数据 {key:"",value:""}
                }
            }*/            
            rowAddModule:"",        //行新增 "col1,col2,col3" 列名逗号分隔
            isLeftTemplate: false,   //是否左侧显示操作区
            templateWidth:90,       //每个操作按钮宽度  默认90
            templateModule:[],      //操作模块---------------------------
            /*[]调整
            {
                isDisable:false,        //默认不禁用  全列禁用
                title:"修改",           //按钮文本
                className:"bluebtn",    //按钮样式  蓝色bluebtn 灰色graybtn 橘色orangebtn
                iClass:"icon-pencil",   //图标样式
                onChange:null,          //行数据function(pData)
                convertClassName:"graytext",    //单行禁用样式
                convert:null            //转换行内是否禁用该操作按钮，必须要return bool，默认行内存在
            }*/
            sortModule:{        //排序模块--------------------
                global:false,   //是否全局排序  默认false 为true不执行本地排序但触发onChange
                onChange:null   //sortName排序属性、sortOrder排序方式 desc降序 esc升序 function(sortName,sortOrder)
            },
            isSort:true,        //是否开启排序 默认true
            isNumber:true,      //是否自动序号 默认true
            isDrag:true,        //是否开启拖拽列 默认true
            otherItems:[],      //其他数据的配置功能{ title:"",text:"" }
            isCheckBox:false,   //是否可选功能，列头全选:true false 默认false
            colOrderKey:"",
            onWhere:null, //function(pData)
            /*
             * [用于筛选回调]
             * @param  {[json]} pData [{#key1#:[],#key2#:[]}]
             * #key#对应列name
             * value对应数组筛选值
             */
            onDetail:null,      //function(pData,pDom)
            onClick:null,       //function(pData)
            onDoubleClick:null, //function(pData)
            onCheck:null,       //function(pDom,pData)
            onCheckAll:null    
        }
        $.extend(true, this.opts, pOpts);
        if(this.opts.pageModule){
            this.opts.pageModule.pageRate = pOpts.pageModule.pageRate;
        }        
        this.target = $(pObj);
        this.init();
        this.initialize();
    }
    GridView.prototype = {
        init: function () {
            this.target.html("");
        },initialize: function () {
            this.setOptions();
            this.bindEvent();
        },setOptions: function () {
            $.extend(this,{
                _colHeadPanel:$("<div class=\"grid_colHead\"></div>"),
                _dragPanel:$("<div class=\"grid_drag\"></div>"),
                _tablePanel:$("<div class=\"grid_table\"></div>"),
                _otherPanel:$("<div class=\"grid_other\"></div>"),
                _pagePanel:$("<div class=\"grid_page\"></div>"),
                _sortName:null,
                _sortOrder:null,
                colHead:null,
                drag:null,
                table:null,
                page:null
            });
            if(this.opts.width == null){
                this.target.css("width",this.target.parent().width());
                GridTargetList.push(this.target);
            }            
            this.target.addClass("gridview").append(this._colHeadPanel).append(this._dragPanel)
                .append(this._tablePanel).append(this._otherPanel);
            this.formatTempalteModule();
            this.formatColModule();
            this.colHead = new GridControl.ColHeadControl({
                panel:this._colHeadPanel,
                colHead:this.opts.colHead,
                colModule:this.opts.colModule,
                templateWidth:this.templateWidth,
                isTemplate:this.isTemplate,
                isCheckBox:this.opts.isCheckBox,
                isSort:this.opts.isSort,
                isNumber:this.opts.isNumber,
                isLeftTemplate:this.opts.isLeftTemplate,
                otherColNumber:this.otherColNumber
            });
            if(this.opts.isDrag){
                this.drag = new GridControl.DragControl({
                    panel:this._dragPanel,
                    colModule:this.opts.colModule,
                    height:this.opts.height + this._colHeadPanel.height(),
                    templateWidth:this.templateWidth,
                    isTemplate:this.isTemplate,
                    isCheckBox:this.opts.isCheckBox,
                    isNumber:this.opts.isNumber,
                    isLeftTemplate:this.opts.isLeftTemplate,
                    otherColNumber:this.otherColNumber
                });
            }            
            this.table = new GridControl.TableControl({
                panel:this._tablePanel,
                colModule:this.opts.colModule,
                rowAddModule:this.opts.rowAddModule,
                data:this.opts.datasource,
                height:this.opts.height,
                templateModule:this.opts.templateModule,
                templateWidth:this.templateWidth,
                isTemplate:this.isTemplate,
                isCheckBox:this.opts.isCheckBox,
                isNumber:this.opts.isNumber,
                isLeftTemplate:this.opts.isLeftTemplate,
                otherColNumber:this.otherColNumber,
                onDetail:this.opts.onDetail,
                onDoubleClick:this.opts.onDoubleClick,
                onClick:this.opts.onClick,
                onCheck:this.opts.onCheck
            });
            if(this.opts.pageModule){
                if(this.opts.pageModule.panel != null && this.opts.pageModule.panel.length > 0){
                    this.opts.pageModule.panel.append(this._pagePanel);
                }else{
                    if(this.opts.pageModule.isTop){
                        this._pagePanel.insertBefore(this._colHeadPanel);
                    }else{
                        this.target.append(this._pagePanel);
                    }
                }                
                this.page = this._pagePanel.GridPage({
                    total: this.opts.pageModule.total,
                    index: this.opts.pageModule.index,
                    pageNum: this.opts.pageModule.pageNum,
                    pageRate: this.opts.pageModule.pageRate,
                    onChange:this.opts.pageModule.onChange,
                    onSetNum:this.opts.pageModule.onSetNum,
                    type:this.opts.pageModule.type
                });
            }
            this.other = new GridControl.OtherControl({
                panel:this._otherPanel,
                isTemplate:this.isTemplate,
                isCheckBox:this.opts.isCheckBox,
                isNumber:this.opts.isNumber,
                templateWidth:this.templateWidth,
                colModule:this.opts.colModule,
                otherColNumber:this.otherColNumber
            })
            this.setWidth();
        },bindEvent: function () {
            var _this = this;
            this.table.panel.scroll(function(){
                _this.opts.isDrag && _this.drag.setScrollLeft(_this.table.panel.scrollLeft());
                _this.colHead.panel.scrollLeft(_this.table.panel.scrollLeft());
                _this._otherPanel.children("div").scrollLeft(_this.table.panel.scrollLeft());
            });
            this.colHead.addEvent("whereChange",function(pData){//筛选
                if(_this.opts.onWhere && $.type(_this.opts.onWhere) === "function"){
                    _this.opts.onWhere.call(null,pData);
                }
            });
            this.colHead.addEvent("sortChange",function(pData){//排序
                _this.sortName = pData.sortName;
                _this.sortOrder = pData.sortOrder;
                if (_this.opts.sortModule.global && $.type(_this.opts.sortModule.onChange) === "function") {
                    _this.opts.sortModule.onChange.call(_this,_this.sortName,_this.sortOrder)
                }else{
                    _this.table.setSort(_this.sortName,_this.sortOrder);
                }
            });
            this.colHead.addEvent("checkAll",function(pFlag){
                _this.table.checkAll(pFlag);
                if(_this.opts.onCheckAll && $.type(_this.opts.onCheckAll) === "function"){
                    _this.opts.onCheckAll.call(null,pFlag);
                }
            });
            if(this.opts.isDrag){                
                this.drag.addEvent("dragCol",function(data){
                    _this.colHead.setColWidth(data.index);
                    _this.table.setColWidth(data.index);
                    _this.other.setColWidth(data.index);
                });
            }
        },formatTempalteModule:function(){
            if(this.opts.templateModule.length > 0){
                this.templateWidth = (this.opts.templateModule.length * this.opts.templateWidth);
                var _temps = [];
                for(var i = 0,l = this.opts.templateModule.length;i < l;i++){
                    var _temp = $.extend(true,{
                        convertClassName:"",
                        isDisable:false
                    },this.opts.templateModule[i]);
                    _temps.push(_temp);
                }
                this.opts.templateModule = _temps;
            }else if(this.opts.rowAddModule.length > 0){
                this.templateWidth = this.opts.templateWidth;
            }
            this.isTemplate = this.opts.templateModule.length > 0 || this.opts.rowAddModule.length > 0;
            this.otherColNumber = (true == this.isTemplate && true == this.opts.isLeftTemplate ? 1 : 0) +
                (false == this.opts.isNumber ? 0 : 1) +
                (false == this.opts.isCheckBox ? 0 : 1);
        },formatColModule:function(){
            var _cols = [];
            for(var i = 0,l = this.opts.colModule.length;i < l;i++){
                var _col = $.extend(true,{
                    width:100,
                    headAlign:this.opts.headAlign,
                    align:"center",
                    type:"Label",
                    className:"",
                    formatter:null,
                    convert:null,
                    triggerList:[],
                    init:null,
                    isSort:!this.opts.sortModule.global
                },this.opts.colModule[i]);
                _cols.push(_col);
            }
            this.opts.colModule = _cols;
            this.opts.rowAddModule = "," + this.opts.rowAddModule + ",";
        },setWidth:function(){
            if(this.opts.width){
                this.target.css("width",this.opts.width+"px");
            }
        },GetData:function(){//返回改动后grid数据集合 类型:[]
            return this.table.getData();
        },GetUpdateData:function(){
            return this.table.getUpdateData();
        },GetAddData:function(){
            return this.table.getDataByType("add");
        },GetSelectedData:function(){//有可选功能情况返回被选中行数据集合 类型:[]
            return this.table.getSelectedData();
        },LoadPage:function(pData){//根据参数数据重新加载
            this.table.loadPage(pData);
            if(this.opts.isCheckBox){
                this.colHead.checkBtn[0].checked = false;
            }
            if (!this.opts.sortModule.global && this.sortName && this.sortOrder) {
                this.table.setSort(this.sortName,this.sortOrder);
                //if (this.colHead.prevSort) {
                //    this.colHead.prevSort.removeSort();
                //}
            }            
        },AddRow:function(pData){//提供添加行函数调用
            return this.table.addRow(pData);
        },SetPageIndex:function(pIndex){//设置分页索引
            this.page.index = pIndex;
        },SetTotle:function(pNum){//设置数据总数量配置分页用            
            this.page.setTotle(pNum);
        },SelectedRows:function(pData,pName){
            if(this.opts.isCheckBox && pData.length > 0){
                this.table.selectedRows(pData,pName);
            }
        },SelectRow:function(pData,pName,pFlag){
            this.table.selectRowByName(pData,pName,pFlag);
        },AppendRow:function(pDom){
            this.appendRow().find("td").append(pDom);
        },AppendToRow:function(pDom){
            this.appendRow().find("td").appendTo(pDom);
        },appendRow:function(){
            var _colspan = this.opts.colModule.length,
                _num = _colspan + (this.opts.isNumber == false ? 0 : 1) + (this.opts.isCheckBox == false ? 0 : 1) + (this.opts.templateModule.length > 0 ? 1 : 0);
                _rowDom = $("<tr><td colspan=" + _num + "></td></tr>");
            this.table.panel.find("table").append(_rowDom);
            return _rowDom;
        },LoadOther:function(pData) {
            this.other.loadPage(pData);
        }
    }
    $.fn.extend({
        GridView: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            GridView["instance"] = new GridView(this, _defaults);
            return GridView["instance"];
        }
    });
})(jQuery);