(function ($) {
    var printAreaCount = 0;
    var PrintControl = function (pOpts) {
        this.opts = {
            removeId: "print_panel",
            url: null,
            html: null, 	//String 打印使用的html字符串
            type: "print"	//设置方式: print 直接打印, printPreView 打印预览
        }
        $.extend(true, this.opts, pOpts);
        this.init();
    }
    PrintControl.prototype = {
        init: function () {
            if($$.browser.IsIE){
                $("#"+this.opts.removeId).hide();
                window.print();
                $("#"+this.opts.removeId).show();
            }else{
                this.createIfram();
            }
        },createIfram: function () {
            $("#print_iframe" + printAreaCount).remove();
            printAreaCount++;
            var iframeStyle = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';
            var iframe = document.createElement('iframe');
            this.iframe = $(iframe);
            this.iframe.attr({ style: iframeStyle, id: "print_iframe" + printAreaCount });
            var doc = null;
            if (this.opts.url) {
                var _this = this;
                iframe.src = this.opts.url;
                document.body.appendChild(iframe);
                if (iframe.attachEvent) {
                    iframe.attachEvent("onload", function () {
                        _this.play(iframe.contentWindow.document, iframe.contentWindow);
                    });
                } else if(iframe.addEventListener) {
                    iframe.addEventListener("load",function(){
                        _this.play(iframe.contentWindow.document, iframe.contentWindow);
                    });
                }else{
                    iframe.onload = function () {                        
                        _this.play(iframe.contentWindow.document, iframe.contentWindow);
                    };
                }         
            } else {
                document.body.appendChild(iframe);
                doc = iframe.contentWindow.document;
                doc.write(this.opts.html);
                doc.close();
                this.frameWindow = iframe.contentWindow;
                this.startPrint();
            }
        },startPrint: function () {
            this.frameWindow.close();
            this.frameWindow.focus();
            if (this.opts.type == "print") {
                this.frameWindow.print();
            }
        },play:function(pDoc,pWin){
            if(pDoc.getElementById(this.opts.removeId)){
                pDoc.getElementById(this.opts.removeId).style.display = "none";
            }
            var _html = pDoc.body.innerHTML.replace(/>\s+</g, "><").replace(/[\r\n]/g, "");
            console.log(_html);
            pDoc.body.innerHTML = _html;
            pDoc.close();
            this.frameWindow = pWin;
            this.startPrint();
        }
    };
    $.extend({
        PrintHtml: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            new PrintControl(_defaults);
        }
    });
})(jQuery);