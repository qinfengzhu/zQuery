/*
* the initail mod upload
* @Author:      dingyantao
* @CreateDate:  2015-02-11
*/
(function () {
    var UploadControl = function(pObj,pOpts){
        this.opts = {
            //请求地址 String
            action:"",
            //上传所使用的name String
            name:"file",
            //是否多文件上传 Bool 默认false
            multiple:false,
            //限制只显示的类型
            accept:"",
            //上传的其他数据 Object{}
            data:{},
            //选择文件后是否自动上传 Bool 默认true false需自行触发submit
            autoSubmit:true,
            //文件大小限制 单位kb
            limitSize:null,
            //文件类型限制 "jpg|png|gif" "*" 
            limitType:null,
            responseType:false,
            className:["",""],
            id:0,
            //选择文件  pFile对象
            onChange:function(pFileObj){},
            //上传提交  pFile对象
            onSubmit: function (pFileObj){},
            //完成上传
            onComplete: function (pResponse){},
            onErrorSize:function(){},
            onErrorType:function(){}
        }
        $.extend(true, this.opts, pOpts);
        this.target = $(pObj);
        this.init();
    }
    UploadControl.prototype = {
        init:function(){
            this.bindEvent();
        },bindEvent:function(){
            var _this = this;
            this.target.on("click",function(e){
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else if (window.event) {
                    window.event.returnValue = false;
                }
            });
            this.target.on("mouseover",function(){
                if (!_this.file) {
                    _this.createFile();
                }
                _this.setStyle();                
            });
        },setStyle:function(){
            var _offset = this.target.offset();
            this.filePanel.css({
                "position":"absolute",
                "left":_offset.left,
                "top":_offset.top,
                "width":this.target[0].offsetWidth + "px",
                "height":this.target[0].offsetHeight + "px",
                "visibility":"visible"
            });
        },createFile:function(){
            var _file = $(["<input type=file name=",this.opts.name," />"].join(''));
            if(this.opts.multiple){//是否支持多文件上传
                _file.attr("multiple","multiple");
            }
            if(this.opts.accept.length > 0){
                _file.attr("accept",this.opts.accept);
            }
            _file.css({
                'position': 'absolute',
                'right': 0,
                'margin': 0,
                'padding': 0,
                'fontSize': '480px',
                'cursor': 'pointer'
            });
            var _filePanel = $("<div></div>");
            _filePanel.css({
                'display': 'block',
                'position': 'absolute',
                'overflow': 'hidden',
                'margin': 0,
                'padding': 0,
                'opacity': 0,
                'direction': 'ltr',
                'zIndex': 2147483583
            });
            _filePanel.attr("filter","alpha(opacity=0)");            
            _filePanel.append(_file);
            $$.container.append(_filePanel);            
            this.file = _file;
            this.filePanel = _filePanel;
            this.initFile();
        },clearFile:function(){    
            if (!this.file) {
                return;
            }
            this.filePanel.remove();
            this.file = null;
        },getFileObj:function(){
            var _fileFromPath = /.*(\/|\\)/;
            if(this.opts.multiple){
                var _list = [],
                    _files = this.file[0].files,
                    _length = _files.length;
                for(var i = 0;i < _length;i++){
                    var _file = _files[i],
                        _f = _file.name.replace(_fileFromPath, "");
                    _list.push({
                        name:_f,
                        ext:this.getExt(_f),
                        size:_file.size
                    });
                }
                return _list;
            }else{
                var _file = this.file[0].files[0],
                    _f = _file.name.replace(_fileFromPath, "");
                return {
                    name:_f,
                    ext:this.getExt(_f),
                    size:_file.size
                }
            }
        },initFile:function(){
            var _settings = this.opts,
                _this = this;
            this.file.on("change",function(){
                if(_this.file.val().length == 0) return;
                if($.type(_settings.onChange) === "function"){
                    if(false === _settings.onChange.call(_this,_this.getFileObj())
                        || false === _this.validation()){
                        _this.clearFile();
                        return;
                    }
                    if(_settings.autoSubmit){
                        _this.submit();
                    }
                }
            });
        },createIframe:function(){
            var _id = this.getUID();
            var _iframe = $('<iframe src="javascript:false;" name="' + _id + '" />');
            _iframe.attr('id', _id);
            _iframe.css("display",'none');
            $$.container.append(_iframe);
            return _iframe;
        },createForm:function(pIframe){
            var _settings = this.opts;
            var _form = $('<form method="post" enctype="multipart/form-data"></form>');
            _form.attr("action",_settings.action);
            _form.attr("target",pIframe[0].name);
            _form.css("display","none");
            $$.container.append(_form);
            for(var key in _settings.data){
                var el = $(["<input type=hidden name=",key,
                    " value=",_settings.data[key],"/>"].join(''));
                _form.append(el);
            }
            return _form;
        },getUID:function(){
            return "zhaoGangUpload" + this.id++;
        },getExt:function(pFile){
            return (-1 !== pFile.indexOf('.')) ? pFile.replace(/.*[.]/, '') : '';
        },submit:function(){
            var _this = this,
                _settings = this.opts;
            if (!this.file || this.file.val() === "") {
                return;
            }
            var _file = this.file.val().replace(/.*(\/|\\)/, "");
            if($.type(_settings.onSubmit) === "function"){
                if(false === _settings.onSubmit.call(this, _this.getFileObj())){
                    this.clearFile();
                    return;
                }
            }
            //this.filePanel.remove();
            var _iframe = this.createIframe(),
                _form = this.createForm(_iframe);
            _form.append(this.file);
            _form[0].submit();
            _form.remove();
            this.getRespons(_iframe);
            this.clearFile();
        },getRespons:function(pIframe){//获取响应
            var _flag = false,
                _this = this,
                _settings = this.opts;
            pIframe.on("load",function(){                
                if(// For Safari
                    pIframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" ||
                    // For FF, IE
                    pIframe.src == "javascript:'<html></html>';"){
                    if(_flag){
                        setTimeout(function(){ pIframe.remove(); },0);
                    }
                    return;
                }
                var _doc = pIframe[0].contentDocument ? pIframe[0].contentDocument : window.frames[pIframe[0].id].document;
                // fixing Opera 9.26,10.00
                if (_doc.readyState && _doc.readyState != 'complete') {
                    return;
                }
                // fixing Opera 9.64
                if (_doc.body && _doc.body.innerHTML == "false") {
                    return;
                }
                var _response;
                if (_doc.XMLDocument) {
                    // response is a xml document Internet Explorer property
                    _response = _doc.XMLDocument;
                } else if (_doc.body) {
                    // response is html document or plain text
                    _response = _doc.body.innerHTML;
                    if (_settings.responseType && _settings.responseType.toLowerCase() == 'json') {
                        if (_doc.body.firstChild && _doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
                            _response = _doc.body.firstChild.firstChild.nodeValue;
                        }

                        if (_response) {
                            _response = eval("(" + _response + ")");
                        } else {
                            _response = {};
                        }
                    }
                } else {
                    // response is a xml document
                    _response = _doc;
                }
                if($.type(_settings.onComplete) === "function"){
                    _settings.onComplete.call(_this, _response);
                }
                // Reload blank page, so that reloading main page
                // does not re-submit the post. Also, remember to
                // delete the frame
                _flag = true;
                // Fix IE mixed content issue
                pIframe.src = "javascript:'<html></html>';";
            });
        },validation:function(){
            var _settings = this.opts,
                _files = this.getFileObj();
            if(_settings.multiple == false){
                _files = [_files];
            }
            var _length = _files.length;
            for(var i = 0;i < _length;i++){
                var _file = _files[i];
                if(_settings.limitSize > 0){
                    if((_settings.limitSize * 1024) < _file.size){
                        if($.type(_settings.onErrorSize) === "function"){
                            _settings.onErrorSize.call(null);
                        }
                        return false;
                    }
                }
                if(_settings.limitType && _settings.limitType.length > 0){
                    (_settings.limitType == "*") && (_settings.limitType = "\\w+")
                    var _reg = new RegExp("^"+ _settings.limitType +"$","g");
                    if(!_reg.test(_file.ext)){
                        if($.type(_settings.onErrorType) === "function"){
                            _settings.onErrorType.call(null);
                        }
                        return false;
                    }
                }
            }
            return true;
        }
    }
    $.fn.extend({
        Upload: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            UploadControl["instance"] = new UploadControl(this, _defaults);
            return UploadControl["instance"];
        }
    });
})();