﻿(function(A){var B='<div class="intro_img"><img src="${src}"/></div>',C=function(D){A.extend(this,{imgSrc:null,view:null,timer:null});this.target=D;this.init();};C.prototype={init:function(){this.setOption();this.bindEvent();},setOption:function(){this.isCreate=true;},bindEvent:function(){var D=this;this.target.bind("mousemove",function(E){if(D.isCreate){D.isCreate=false;D.createHtml();D.setPostion(E);}else{D.setPostion(E);}clearTimeout(D.timer);});this.target.bind("mouseout",function(E){D.timer=setTimeout(function(){D.clearHtml();},50);});},createHtml:function(){this.imgSrc=this.target.attr("src");this.view=A(A.template.render(B,{src:this.imgSrc}));$$.container.append(this.view);this.view.cover();},clearHtml:function(){this.view.uncover();this.view.remove();this.isCreate=true;},setPostion:function(H){var F,G;if(document.documentElement&&document.documentElement.scrollTop){G=document.documentElement.scrollLeft;F=document.documentElement.scrollTop;}else{if(document.body){G=document.body.scrollLeft;F=document.body.scrollTop;}}var I={left:H.clientX+G,top:H.clientY+F};var E=A(window).width(),D=0;if(this.view.find("img").width()+I.left>E){D=I.left-this.view.find("img").width()-10;}else{D=I.left+10;}this.view.css("position","absolute").css({left:D,top:I.top+10});}};A.fn.extend({ImgTips:function(){this.each(function(){new C(A(this));});}});})(jQuery);