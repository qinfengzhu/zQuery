/*
* the initail mod gridView
* @Author:      dingyantao
* @CreateDate:  2014-10-09
*/
(function ($) {
    var TreeControl = {};
    TreeControl.TreeNode = $.Base.Event.extend({
        init: function (pOpts) {
            $.extend(this, {
                panel:null,
                parentNodeTemplate:'<dl><$ var _checkedClass = GlobalData.data.IsChecked == true ? " select" : "",               _checkClass = GlobalData.isCheckBox == true ? "check" : ""; $><dt class="<$= _checkClass $>"><button class="close" data-id="<$= GlobalData.data.TreeId $>"></button><$ if(GlobalData.isCheckBox){ $><a class="checkbox<$= _checkedClass $>" data-id="<$= GlobalData.data.TreeId $>"></a><$ } $><a href="javascript:" data-id="<$= GlobalData.data.TreeId $>"><$ if(GlobalData.data.Icon){ $><i class="<$= GlobalData.data.Icon $>"></i><$ } $><$= GlobalData.formatter == null ? GlobalData.data.Name : GlobalData.formatter(GlobalData.data) $></a></dt></dl>',
                nodeAllTemplate:'<$ for(var i = 0,l = GlobalData.nodeList.length;i < l;i++){            var item = GlobalData.nodeList[i],                _checkedClass = item.IsChecked == true ? " select" : "",                _class = i + 1 == GlobalData.nodeList.length ? "last " : "",                _checkClass = GlobalData.isCheckBox == true ? "check" : "";            if(item.HasChild){ $><dd class="<$= _class + _checkClass $>" style="display:none"><dl><dt class="<$= _checkClass $>"><button class="close" data-id="<$= item.TreeId $>"></button><$ if(GlobalData.isCheckBox){ $><a class="checkbox<$= _checkedClass $>" data-id="<$= item.TreeId $>" ></a><$ } $><a href="javascript:" data-id="<$= item.TreeId $>"><$ if(item.Icon){ $><i class="<$= item.Icon $>"></i><$ } $><$= GlobalData.formatter == null ? item.Name : GlobalData.formatter(item) $></a></dt><$= $.template.replace(GlobalData.template,{nodeList:item.NodeList,template:GlobalData.template,isCheckBox:GlobalData.isCheckBox,formatter:GlobalData.formatter}) $></dl></dd><$ }else{ $><dd class="<$= _class + _checkClass $>" style="display:none"><$ if(GlobalData.isCheckBox){ $><a class="checkbox<$= _checkedClass $>" data-id="<$= item.TreeId $>"></a><$ } $><a href="javascript:" data-id="<$= item.TreeId $>" ><$ if(item.Icon){ $><i class="<$= item.Icon $>"></i><$ } $><$= GlobalData.formatter == null ? item.Name : GlobalData.formatter(item) $></a></dd><$ } $><$ } $>',
                nodeTemplate:'<$ for(var i = 0,l = GlobalData.data.length;i < l;i++){            var item = GlobalData.data[i],                _class = i + 1 == GlobalData.data.length ? "last " : "",                _checkClass = GlobalData.isCheckBox == true ? "check" : "";            if(item.HasChild){ $><dd class="<$= _class + _checkClass $>" ><dl><dt class="<$= _checkClass $>"><button class="close" data-id="<$= item.TreeId $>"></button><$ if(GlobalData.isCheckBox){ $><a class="checkbox" data-id="<$= item.TreeId $>"></a><$ } $><a href="javascript:" data-id="<$= item.TreeId $>"><$ if(item.Icon){ $><i class="<$= item.Icon $>"></i><$ } $><$= GlobalData.formatter == null ? item.Name : GlobalData.formatter(item) $></a></dt></dl></dd><$ }else{ $><dd class="<$= _class + _checkClass $>" ><$ if(GlobalData.isCheckBox){ $><a class="checkbox" data-id="<$= item.TreeId $>"></a><$ } $><a href="javascript:" data-id="<$= item.TreeId $>"><$ if(item.Icon){ $><i class="<$= item.Icon $>"></i><$ } $><$= GlobalData.formatter == null ? item.Name : GlobalData.formatter(item) $></a></dd><$ }        } $>',
                seletedNode:null,
                cacheTreeParent:{},
                treeDataList:{},
                GlobalGuid:0,
                prevNodeIndex:0
            }, pOpts);
            this.setOptions();
            this.bindEvent();
        },setOptions:function(){
            this.loadPage();
        },bindEvent:function(){
            var _this = this;
            this.panel.on("click.treeView",function(e){
                var tag = e.target,
                    _tag = $(tag);
                if(tag.tagName == "A"){                    
                    if(_tag.hasClass("checkbox")){
                        _this.check(_tag);
                    }else{
                        _this.change(_tag);
                    }
                }else if(tag.tagName == "BUTTON"){
                    _this.showNode(_tag);
                }
            });
            this.panel.on("dblclick.treeView",function(e){
                var tag = e.target;
                if(tag.tagName == "A"){
                    var _tag = $(tag);
                    if(!_tag.hasClass("checkbox")){
                        if(_this.treeDataList[_tag.data("id")].HasChild){
                            _this.showNode(false == _this.isCheckBox ? _tag.prev() : _tag.prev().prev());
                        }
                        if(_this.onDoubleClick && $.type(_this.onDoubleClick) === "function"){
                            _this.onDoubleClick.call(null, _this.treeDataList[_tag.data("id")], _tag);
                        }
                    }
                }
            });
        },loadPage:function(){
            this.formatData();
            if(this.rootData && this.url){
                this.panel.html($.template.replace(this.parentNodeTemplate,{
                    data:this.rootData,
                    isCheckBox:this.isCheckBox,
                    json:$.jsonToString(this.rootData),
                    formatter:this.formatter
                }));
                this.loadNode(this.rootData.Id,this.panel.find("dl:eq(0)"));
            }else if(this.datasource){
                this.panel.html($.template.replace(this.parentNodeTemplate,{
                    data:this.datasource,
                    isCheckBox:this.isCheckBox,
                    formatter:this.formatter
                }));
                if(this.datasource.HasChild){
                    this.panel.find("dl:eq(0)").append($.template.replace(this.nodeAllTemplate,{
                        nodeList:this.datasource.NodeList,
                        template:this.nodeAllTemplate,
                        isCheckBox:this.isCheckBox,
                        formatter:this.formatter
                    }));
                    this.datasource && this.showNode(this.panel.find("button:eq(0)"));
                }
            }else if(this.rootData && this.ajaxFun){                
                this.panel.html($.template.replace(this.parentNodeTemplate,{
                    data:this.rootData,
                    isCheckBox:this.isCheckBox,
                    json:$.jsonToString(this.rootData),
                    formatter:this.formatter
                }));
                this.showNode(this.panel.find("button:eq(0)"));
            }else{
                $.error("tree data is null");
            }
        },formatData:function(){
            if(this.datasource){
                this.datasource.TreeId = this.createID();
                this.treeDataList[this.datasource.TreeId] = this.datasource;
                this.formatNodeData(this.datasource.NodeList,this.datasource.TreeId);
            }else if(this.rootData){
                this.rootData.TreeId = this.createID();
                this.treeDataList[this.rootData.TreeId] = this.rootData;
            }
        },formatNodeData:function(pList,pId){
            for (var i = 0,l = pList.length; i < l; i++) {
                pList[i].TreeId = this.createID();
                this.treeDataList[pList[i].TreeId] = pList[i];
                this.cacheTreeParent[pList[i].TreeId] = this.treeDataList[pId];
                if(pList[i].HasChild){
                    this.formatNodeData(pList[i].NodeList,pList[i].TreeId);
                }
            };
        },createID:function(){
            return this.GlobalGuid++;
        },loadFunNode:function(pData,pDL,pDom){
            for (var i = pData.length - 1; i >= 0; i--) {
                pData[i].TreeId = this.createID();
                this.treeDataList[pData[i].TreeId] = pData[i];
                this.cacheTreeParent[pData[i].TreeId] = this.treeDataList[this.seletedNode.data("id")];
            };
            pDL.append($.template.replace(this.nodeTemplate,{
                data:pData,
                isCheckBox:this.isCheckBox,
                formatter:this.formatter
            }));
            pDL.data("__loaded__",true);
        },loadNode:function(pId,pDL,pDom){
            var _context = {};
                _context[this.ajaxId] = pId,
                _this = this;
            $.ajax({
                url:this.url,
                context:_context,
                method:this.ajaxType,
                success:function(data){
                    pDL.append($.template.replace(_this.nodeTemplate,{
                        data:data,
                        isCheckBox:_this.isCheckBox,
                        formatter:_this.formatter
                    }));
                    pDL.data("__loaded__",true);
                }
            });  
        },showNode:function(pDom){
            var _dl = pDom.parent().parent(),
                _selectDom = false == this.isCheckBox ? pDom.next() : pDom.next().next();
            if(this.isOpenChange){
                this.change(_selectDom);
            }
            if(_dl.data("__loaded__") || this.datasource){
                if(pDom.hasClass("open")){
                    pDom.removeClass("open").addClass("close");
                    _dl.children("dd").hide();
                }else{
                    pDom.removeClass("close").addClass("open");
                    _dl.children("dd").show();
                }
            }else{
                if(pDom.hasClass("open")){
                    pDom.removeClass("open").addClass("close");
                }else{
                    pDom.removeClass("close").addClass("open");
                }
                if(this.url){
                    this.loadNode(pDom.data("id"),_dl,_selectDom);
                }else if(this.ajaxFun && $.type(this.ajaxFun) === "function"){
                    this.ajaxFun.call(this,this.treeDataList[pDom.data("id")],_dl,_selectDom);
                }
            }
        },check:function(pDom){
            var _isChild = pDom.parent()[0].tagName == "DT" ? true : false;
            if(pDom.hasClass("select")){
                pDom.removeClass("select");
                if(_isChild){
                    pDom.parent().parent().find("dd a.checkbox").removeClass("select");
                }else{
                    pDom.find("a.checkbox").removeClass("select");
                }
                this.setParentNode(pDom);
            }else{
                pDom.addClass("select");
                if(_isChild){
                    pDom.parent().parent().find("dd a.checkbox").addClass("select");
                }else{
                    pDom.find("a.checkbox").addClass("select");
                }                
                this.setParentNode(pDom);
            }
        },change:function(pDom){
            if(this.seletedNode){
                this.seletedNode.removeClass(this.className);
            }
            pDom.addClass(this.className);
            this.seletedNode = pDom;
            if($.type(this.onChange) === "function"){
                this.onChange.call(this,this.treeDataList[pDom.data("id")],pDom);
            }
        },setParentNode:function(pDom,pFlag){
            var _parent = pDom.parent().parent();
            if(_parent.length > 0 && _parent[0].tagName == "DL"){
                var _root = _parent.children("dt").children("a.checkbox"),
                    _nodes = _parent.children("dd").find(">a.checkbox,>dl>dt>a.checkbox,>dl>dd>a.checkbox"),
                    _flag = true;
                _nodes.each(function(pIndex,pDom){
                    if(!$(pDom).hasClass("select")){
                        _flag = false;
                        return;
                    }
                });
                if(_flag){
                    _root.addClass("select");
                }else{
                    _root.removeClass("select");
                }
                this.setParentNode(_parent);
            }
            return;
        },getSelectedData:function(){
            var _returnObj = [],
                _this = this;
            this.panel.find("a.checkbox").each(function(pIndex,pDom){
                var _dom = $(pDom);
                if(_dom.hasClass("select")){
                    _returnObj.push(_this.treeDataList[_dom.data("id")]);
                }
            });
            return _returnObj;
        },getParentNode:function(pData){
            return this.cacheTreeParent[pData.TreeId];
        },getParentNodeALL:function(pData){
            var _this = this,
                _returnObj = [],
                _node = null;
            function getParentNodeById(pId){
                _node = _this.cacheTreeParent[pId];
                if(!_node){
                    return;
                }
                _returnObj.push(_node);
                arguments.callee(_node.TreeId)
            }
            getParentNodeById(pData.TreeId);
            _node = null;
            return _returnObj;
        },setNodeByName:function(pName){
            var _hitIndex = null,
                _hitNode = null,
                _isHit = false;
            for(var i in this.treeDataList){
                if(this.treeDataList[i].Name.indexOf(pName) !== -1){
                    if(~~i <= ~~this.prevNodeIndex && !_isHit){
                        _hitIndex = i;
                        _hitNode = this.treeDataList[i];
                        _isHit = true;
                        continue;
                    }
                    if(~~this.prevNodeIndex == 0 || ~~i > ~~this.prevNodeIndex){
                        this.prevNodeIndex = i;
                        this.setNodeByData(this.treeDataList[i]);
                        return;
                    }
                }
            }
            this.prevNodeIndex = _hitIndex;
            this.setNodeByData(_hitNode);
        },setNodeByData:function(pData){
            var _parentAll = this.getParentNodeALL(pData);
            for(var i = _parentAll.length - 1;i >= 0;i--){
                var _dom = this.panel.find("button[data-id=" + _parentAll[i].TreeId + "]");
                if(_dom.hasClass("close")){
                    this.showNode(_dom);
                }
            }
            var _checkDom = this.panel.find("a[data-id="+pData.TreeId+"]");
            this.change(this.isCheckBox == false ? _checkDom : _checkDom.eq(1));
            var _this = this;
            setTimeout(function(){
                var _top = _checkDom.offset().top + _this.panel.parent().scrollTop() - _this.panel.parent().offset().top;
                _this.panel.parent().scrollTop(_top);
            }, 0);
        },selectCheck:function(pData,pParam){
            for(var i in this.treeDataList){
                for(var j = 0,jl = pData.length;j < jl;j++){
                    if(this.treeDataList[i][pParam] == pData[j][pParam]){
                        this.checkNodeByTreeId(this.treeDataList[i].TreeId);
                    }
                }
            }
        },checkNodeByTreeId:function(pTreeId) {
            var _checkDom = this.panel.find("a.checkbox[data-id="+pTreeId+"]");
            if(!_checkDom.hasClass("select")){
                this.check(_checkDom);
            }            
        }
    });
    var TreeView = function(pObj,pOpts) {
        this.opts = {
            formatter:null,     //格式化树显示name
            rootData:null,      //url根节点数据
            datasource:null,    //全部数据展现
            ajaxFun:null,       //自定义ajax事件回调 function(pData, pDl, pDom)
            url:null,           //ajax时使用
            ajaxId:"nodeId",    //用于ajax时使用的参数名
            ajaxType:"get",     //ajaxType
            isCheckBox:false,   //是否需要选中功能
            className:"active", //选中样式
            isOpenChange:true,  //开展或者缩起是否触发onChange
            onDoubleClick:null, //双击事件
            onChange:null,      //选中回调
            onLoad:null,        //每次展开缩进的回调
            onFisrtLoad:null    //第一次请求加载后的回调
        }
        $.extend(true, this.opts, pOpts);
        this.target = $(pObj);
        this.init();
        this.initialize();
    }
    TreeView.prototype = {
        init: function () {
            this.target.html("");
        },initialize: function () {
            this.setOptions();
        },setOptions: function () {
            var _panel = $("<div class=\"ntree\"></div>");
            this.target.html(_panel);
            this.tree = new TreeControl.TreeNode($.extend({panel:_panel},this.opts));
        },GetSelectedData:function(){
            return this.tree.getSelectedData();
        },SetNodeByName:function(pName){
            this.tree.setNodeByName(pName);
        },SelectCheck:function(pData,pParam) {
            if(this.tree.isCheckBox){
                this.tree.selectCheck(pData,pParam);
            }            
        }
    }
    $.fn.extend({
        TreeView: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            TreeView["instance"] = new TreeView(this, _defaults);
            return TreeView["instance"];
        }
    });
})(jQuery);