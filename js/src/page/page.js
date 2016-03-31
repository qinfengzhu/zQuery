/*
* the initail mod page
* @Author:      dingyantao
* @CreateDate:  2013-10-12
*/
(function ($) {
    var PageControl = function (pObj, pOpts) {
        pOpts = $.extend({
            total: 0,
            index: 1,
            viewNum: 5,
            pageNum: 10,
            className: "ahover",
            pageTotal:0
        }, pOpts);
        this.target = $(pObj);
        this.init(pOpts);
    }
    PageControl.prototype = {
        init: function (pOpts) {
            this.setOptions(pOpts);
            this.bindEvent();
            this.viewPage(this.index);
        },
        setOptions: function (pOpts) {
            $.extend(this, pOpts);
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
        setTotle:function(pNum){
            this.total = pNum;
            this.pageTotal = this.total % this.pageNum > 0 ? parseInt(this.total / this.pageNum) + 1 : parseInt(this.total / this.pageNum);
            this.viewPage(this.index);
        },
        bindEvent: function () {
            var _this = this;
            this.target.bind("click", function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                if (target.tagName === "A") {
                    var _type = $(target).data("type");
                    if (_type == "prev") {
                        _this.prevPage();
                    } else if (_type == "next") {
                        _this.nextPage();
                    } else if( _type == "first") {//首页
                        _this.setPageByIndex(1);
                    } else if(_type == "last"){//末页
                        _this.setPageByIndex(_this.pageTotal);
                    } else{
                        var index = parseInt(target.innerHTML, 10);
                        _this.setPageByIndex(index);
                    }
                }
            });
        },
        setPageByIndex: function (pIndex) {
            if (typeof pIndex === "undefined") {
                return this.index;
            } else {
                if (pIndex < 1) {
                    return [false, "over-low"];
                } else if (pIndex > this.pageTotal) {
                    return [false, "over-high"];
                } else {
                    this.viewPage(pIndex);
                    this.target.trigger("change", [pIndex]);
                    return [true, ""];
                }
            }
        },
        viewPage: function (pIndex) {
            this.index = pIndex;
            var dnum = this.viewNum % 2,
                hnum = (this.viewNum - dnum) / 2,
                center = pIndex - (pIndex - dnum) % hnum,
                start = Math.max(1, center - hnum + 1 - dnum),
                end = Math.min(this.pageTotal, start + this.viewNum - 1);
            var firstStr = this.index > 1 ? "<a href=\"###\" data-type=\"first\">首页</a>" : "",
                prevStr = this.index > 1 ? "<a data-type=\"prev\" href=\"###\">上一页</a>" : "",
                startStr = start > 1 ? "<a href=\"###\">1</a><span class=\"c_page_ellipsis\">...</span>" : "",
                endStr = end < this.pageTotal ? "<span class=\"c_page_ellipsis\">...</span><a href=\"###\">" + this.pageTotal + "</a>" : "",
                nextStr = this.index < this.pageTotal ? "<a data-type=\"next\" href=\"###\">下一页</a>" : "",
                lastStr = this.index < this.pageTotal ? "<a href=\"###\" data-type=\"last\">末页</a>" : "",
                str = [];
            for (; start < pIndex; start++) {
                str.push("<a href=\"###\">" + start + "</a>");
            }
            str.push("<a href=\"###\" class=\"" + this.className + "\">" + pIndex + "</a>");
            for (pIndex++; pIndex <= end; pIndex++) {
                str.push("<a href=\"###\">" + pIndex + "</a>");
            }
            this.target.html(firstStr + prevStr + startStr + str.join("") + endStr + nextStr + lastStr);
        }
    }

    $.fn.extend({
        Page: function (pOpts) {
            var _defaults = {};
            if (typeof pOpts !== "undefined") {
                $.extend(true, _defaults, pOpts);
            }
            PageControl["instance"] = new PageControl(this, _defaults);
            return PageControl["instance"];
        }
    });
})(jQuery);