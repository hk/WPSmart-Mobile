var __WPS=function(){function n(){e=window.jQuery.noConflict()}var e=jQuery;if(window.jQuery===undefined||window.jQuery.fn.jquery<"1.10.2"){var t=document.createElement("script");t.setAttribute("type","text/javascript");t.setAttribute("src","https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js");(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(t);if(t.attachEvent){t.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded"){this.onreadystatechange=null;n()}}}else{t.onload=n}}else{e=window.jQuery}var r="//t.wpsmart.com/b",i="notset",s=new Fingerprint({canvas:true}),o=s.get(),u="",a=[],f="",l="",c="";self.init=function(t){function n(){i=e("<img/>");i.height=0;i.width=0;i.src=r;e("body").append(i);return i}function s(){var t=f.find(".swiper-container").swiper({mode:"horizontal",loop:false,duration:500,onSlideChangeEnd:function(e){u=self.cards.getActiveCard();var t=u.data("cid");if(a.indexOf(t)==-1){a.push(t);track.view(u)}}});var n=e(".wps-ad"),r=0;n.each(function(t,n){if(r==0)u=n;var i=e(n).find("a.wps-action");i.on("click",function(t){t.preventDefault();var r=e(this).attr("href"),i=n;self.track.click(i,r)});r++});if(l=="st"){f.appear({force_process:true});f.on("appear",function(e,t){if(a.length==0){var n=cards.getActiveCard();var r=n.data("cid");a.push(r);self.track.view(n)}})}else if(l=="sl"){var i;e(window).on("scroll",function(){clearTimeout(i);i=setTimeout(function(){if(e(this).scrollTop()+e(this).height()>e("#endarticle").offset().top*.9){f.css("-webkit-transform","translate3d(0px, 0px, 0px)");e(window).unbind("scroll");var t=cards.getActiveCard();var n=t.data("cid");a.push(n);self.track.view(t)}},200)});var s=f.swipe({triggerOnTouchEnd:false,triggerOnTouchLeave:true,threshold:75,allowPageScroll:"none",maxTimeThreshold:2500,swipeStatus:function(e,t,n,r,i,s){var o=200;if(t=="move"&&n=="down"){if(n=="down")self.cards.moveCards(r*-1);else if(n=="up")self.cards.moveCards(r-130)}else if(t=="cancel"){if(n=="down")self.cards.moveCards(0)}else if(t=="end"){if(n=="down")self.cards.moveCards(o*-1)}}})}}f=e(t);l=f.data("format");c=f.data("rid");n();s();return{}};self.track={view:function(e){actions.fire(e,"view")},click:function(e,t){actions.fire(e,"click",function(){actions.redirect(t)})}};self.actions={fire:function(e,t,n){var s=actions.createQueryString(t,e);i.prop("src",r+"?"+s);if(n!==undefined)setTimeout(n,350)},redirect:function(e){document.location.href=e},createQueryString:function(e,t){var n=(new Date).getTime(),r=e,i=t.data("cid"),s=encodeURIComponent(document.URL),u=c,a=l,f=t.data("pos"),h=o,p="t="+n+"&e="+r+"&c="+i+"&u="+s+"&r="+u+"&f="+a+"&p="+f+"&i="+h;return p}};self.cards={getActiveCard:function(){var t=e(".wps-ad"),n="";t.each(function(e,t){var r=t.getBoundingClientRect();if(r.left>0&&r.right<window.innerWidth){n=t}});return n},moveCards:function(e){var t=(e>0?"-":"")+Math.abs(e).toString();f.css("-webkit-transition-duration","0ms");f.css("-webkit-transform","translate3d(0px,"+t+"px,0px)")}};return{init:function(e){self.init(e)}}}()