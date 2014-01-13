//Appear
(function(d){var b=[];var h=false;var c=false;var f={interval:250,force_process:false};var g=d(window);var a;function e(){c=false;for(var j=0;j<b.length;j++){var k=d(b[j]).filter(function(){return d(this).is(":appeared")});k.trigger("appear",[k]);if(a){var i=a.not(k);i.trigger("disappear",[i])}a=k}}d.expr[":"]["appeared"]=function(k){var j=d(k);if(!j.is(":visible")){return false}var o=g.scrollLeft();var i=g.scrollTop();var n=j.offset();var m=n.left;var l=n.top;if(l+j.height()>=i&&l-(j.data("appear-top-offset")||0)<=i+g.height()&&m+j.width()>=o&&m-(j.data("appear-left-offset")||0)<=o+g.width()){return true}else{return false}};d.fn.extend({appear:function(k){var l=d.extend({},f,k||{});var j=this.selector||this;if(!h){var i=function(){if(c){return}c=true;setTimeout(e,l.interval)};d(window).scroll(i).resize(i);h=true}if(l.force_process){setTimeout(e,l.interval)}b.push(j);return d(j)}});d.extend({force_appear:function(){if(h){e();return true}return false}})})(jQuery);

// Fingerprint
/*
 * fingerprintJS 0.5.2 - Fast browser fingerprint library
 * https://github.com/Valve/fingerprintjs
 * Copyright (c) 2013 Valentin Vasilyev (iamvalentin@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

;(function (name, context, definition) {
    if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
    else if (typeof define === 'function' && define.amd) { define(definition); }
    else { context[name] = definition(); }
})('Fingerprint', this, function () {
    'use strict';

    var Fingerprint = function (options) {
        var nativeForEach, nativeMap;
        nativeForEach = Array.prototype.forEach;
        nativeMap = Array.prototype.map;

        this.each = function (obj, iterator, context) {
            if (obj === null) {
                return;
            }
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === {}) return;
                    }
                }
            }
        };

        this.map = function(obj, iterator, context) {
            var results = [];
            // Not using strict equality so that this acts as a
            // shortcut to checking for `null` and `undefined`.
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            this.each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });
            return results;
        };

        if (typeof options == 'object'){
            this.hasher = options.hasher;
            this.screen_resolution = options.screen_resolution;
            this.canvas = options.canvas;
            this.ie_activex = options.ie_activex;
        } else if(typeof options == 'function'){
            this.hasher = options;
        }
    };

    Fingerprint.prototype = {
        get: function(){
            var keys = [];
            keys.push(navigator.userAgent);
            keys.push(navigator.language);
            keys.push(screen.colorDepth);
            if (this.screen_resolution) {
                var resolution = this.getScreenResolution();
                if (typeof resolution !== 'undefined'){ // headless browsers, such as phantomjs
                    keys.push(this.getScreenResolution().join('x'));
                }
            }
            keys.push(new Date().getTimezoneOffset());
            keys.push(this.hasSessionStorage());
            keys.push(this.hasLocalStorage());
            keys.push(!!window.indexedDB);
            //body might not be defined at this point or removed programmatically
            if(document.body){
                keys.push(typeof(document.body.addBehavior));
            } else {
                keys.push(typeof undefined);
            }
            keys.push(typeof(window.openDatabase));
            keys.push(navigator.cpuClass);
            keys.push(navigator.platform);
            keys.push(navigator.doNotTrack);
            keys.push(this.getPluginsString());
            if(this.canvas && this.isCanvasSupported()){
                keys.push(this.getCanvasFingerprint());
            }
            if(this.hasher){
                return this.hasher(keys.join('###'), 31);
            } else {
                return this.murmurhash3_32_gc(keys.join('###'), 31);
            }
        },

        /**
         * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
         *
         * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
         * @see http://github.com/garycourt/murmurhash-js
         * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
         * @see http://sites.google.com/site/murmurhash/
         *
         * @param {string} key ASCII only
         * @param {number} seed Positive integer only
         * @return {number} 32-bit positive integer hash
         */

        murmurhash3_32_gc: function(key, seed) {
            var remainder, bytes, h1, h1b, c1, c2, k1, i;

            remainder = key.length & 3; // key.length % 4
            bytes = key.length - remainder;
            h1 = seed;
            c1 = 0xcc9e2d51;
            c2 = 0x1b873593;
            i = 0;

            while (i < bytes) {
                k1 =
                    ((key.charCodeAt(i) & 0xff)) |
                        ((key.charCodeAt(++i) & 0xff) << 8) |
                        ((key.charCodeAt(++i) & 0xff) << 16) |
                        ((key.charCodeAt(++i) & 0xff) << 24);
                ++i;

                k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
                h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
            }

            k1 = 0;

            switch (remainder) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xff);

                    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                    k1 = (k1 << 15) | (k1 >>> 17);
                    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                    h1 ^= k1;
            }

            h1 ^= key.length;

            h1 ^= h1 >>> 16;
            h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= h1 >>> 13;
            h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
            h1 ^= h1 >>> 16;

            return h1 >>> 0;
        },

        // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
        hasLocalStorage: function () {
            try{
                return !!scope.localStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        hasSessionStorage: function () {
            try{
                return !!scope.sessionStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        isCanvasSupported: function () {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        },

        isIE: function () {
            if(navigator.appName === 'Microsoft Internet Explorer') {
                return true;
            } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
                return true;
            }
            return false;
        },

        getPluginsString: function () {
            if(this.isIE()){
                return this.getIEPluginsString();
            } else {
                return this.getRegularPluginsString();
            }
        },

        getRegularPluginsString: function () {
            return this.map(navigator.plugins, function (p) {
                var mimeTypes = this.map(p, function(mt){
                    return [mt.type, mt.suffixes].join('~');
                }).join(',');
                return [p.name, p.description, mimeTypes].join('::');
            }, this).join(';');
        },

        getIEPluginsString: function () {
            var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
                'AcroPDF.PDF', // Adobe PDF reader 7+
                'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
                'QuickTime.QuickTime', // QuickTime
                // 5 versions of real players
                'rmocx.RealPlayer G2 Control',
                'rmocx.RealPlayer G2 Control.1',
                'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                'RealPlayer',
                'SWCtl.SWCtl', // ShockWave player
                'WMPlayer.OCX', // Windows media player
                'AgControl.AgControl', // Silverlight
                'Skype.Detection'];
            if(this.ie_activex && scope.ActiveXObject){
                // starting to detect plugins in IE
                return this.map(names, function(name){
                    try{
                        new ActiveXObject(name);
                        return name;
                    } catch(e){
                        return null;
                    }
                }).join(';');
            } else {
                return ""; // behavior prior version 0.5.0, not breaking backwards compat.
            }
        },

        getScreenResolution: function () {
            return [screen.height, screen.width];
        },

        getCanvasFingerprint: function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // https://www.browserleaks.com/canvas#how-does-it-work
            var txt = 'http://valve.github.io';
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);
            return canvas.toDataURL();
        }
    };


    return Fingerprint;

});


// TouchSwipe
(function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{a(jQuery)}}(function(e){var o="left",n="right",d="up",v="down",c="in",w="out",l="none",r="auto",k="swipe",s="pinch",x="tap",i="doubletap",b="longtap",A="horizontal",t="vertical",h="all",q=10,f="start",j="move",g="end",p="cancel",a="ontouchstart" in window,y="TouchSwipe";var m={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe"};e.fn.swipe=function(D){var C=e(this),B=C.data(y);if(B&&typeof D==="string"){if(B[D]){return B[D].apply(this,Array.prototype.slice.call(arguments,1))}else{e.error("Method "+D+" does not exist on jQuery.swipe")}}else{if(!B&&(typeof D==="object"||!D)){return u.apply(this,arguments)}}return C};e.fn.swipe.defaults=m;e.fn.swipe.phases={PHASE_START:f,PHASE_MOVE:j,PHASE_END:g,PHASE_CANCEL:p};e.fn.swipe.directions={LEFT:o,RIGHT:n,UP:d,DOWN:v,IN:c,OUT:w};e.fn.swipe.pageScroll={NONE:l,HORIZONTAL:A,VERTICAL:t,AUTO:r};e.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:h};function u(B){if(B&&(B.allowPageScroll===undefined&&(B.swipe!==undefined||B.swipeStatus!==undefined))){B.allowPageScroll=l}if(B.click!==undefined&&B.tap===undefined){B.tap=B.click}if(!B){B={}}B=e.extend({},e.fn.swipe.defaults,B);return this.each(function(){var D=e(this);var C=D.data(y);if(!C){C=new z(this,B);D.data(y,C)}})}function z(a0,aq){var av=(a||!aq.fallbackToMouseEvents),G=av?"touchstart":"mousedown",au=av?"touchmove":"mousemove",R=av?"touchend":"mouseup",P=av?null:"mouseleave",az="touchcancel";var ac=0,aL=null,Y=0,aX=0,aV=0,D=1,am=0,aF=0,J=null;var aN=e(a0);var W="start";var T=0;var aM=null;var Q=0,aY=0,a1=0,aa=0,K=0;var aS=null;try{aN.bind(G,aJ);aN.bind(az,a5)}catch(ag){e.error("events not supported "+G+","+az+" on jQuery.swipe")}this.enable=function(){aN.bind(G,aJ);aN.bind(az,a5);return aN};this.disable=function(){aG();return aN};this.destroy=function(){aG();aN.data(y,null);return aN};this.option=function(a8,a7){if(aq[a8]!==undefined){if(a7===undefined){return aq[a8]}else{aq[a8]=a7}}else{e.error("Option "+a8+" does not exist on jQuery.swipe.options")}return null};function aJ(a9){if(ax()){return}if(e(a9.target).closest(aq.excludedElements,aN).length>0){return}var ba=a9.originalEvent?a9.originalEvent:a9;var a8,a7=a?ba.touches[0]:ba;W=f;if(a){T=ba.touches.length}else{a9.preventDefault()}ac=0;aL=null;aF=null;Y=0;aX=0;aV=0;D=1;am=0;aM=af();J=X();O();if(!a||(T===aq.fingers||aq.fingers===h)||aT()){ae(0,a7);Q=ao();if(T==2){ae(1,ba.touches[1]);aX=aV=ap(aM[0].start,aM[1].start)}if(aq.swipeStatus||aq.pinchStatus){a8=L(ba,W)}}else{a8=false}if(a8===false){W=p;L(ba,W);return a8}else{ak(true)}return null}function aZ(ba){var bd=ba.originalEvent?ba.originalEvent:ba;if(W===g||W===p||ai()){return}var a9,a8=a?bd.touches[0]:bd;var bb=aD(a8);aY=ao();if(a){T=bd.touches.length}W=j;if(T==2){if(aX==0){ae(1,bd.touches[1]);aX=aV=ap(aM[0].start,aM[1].start)}else{aD(bd.touches[1]);aV=ap(aM[0].end,aM[1].end);aF=an(aM[0].end,aM[1].end)}D=a3(aX,aV);am=Math.abs(aX-aV)}if((T===aq.fingers||aq.fingers===h)||!a||aT()){aL=aH(bb.start,bb.end);ah(ba,aL);ac=aO(bb.start,bb.end);Y=aI();aE(aL,ac);if(aq.swipeStatus||aq.pinchStatus){a9=L(bd,W)}if(!aq.triggerOnTouchEnd||aq.triggerOnTouchLeave){var a7=true;if(aq.triggerOnTouchLeave){var bc=aU(this);a7=B(bb.end,bc)}if(!aq.triggerOnTouchEnd&&a7){W=ay(j)}else{if(aq.triggerOnTouchLeave&&!a7){W=ay(g)}}if(W==p||W==g){L(bd,W)}}}else{W=p;L(bd,W)}if(a9===false){W=p;L(bd,W)}}function I(a7){var a8=a7.originalEvent;if(a){if(a8.touches.length>0){C();return true}}if(ai()){T=aa}a7.preventDefault();aY=ao();Y=aI();if(a6()){W=p;L(a8,W)}else{if(aq.triggerOnTouchEnd||(aq.triggerOnTouchEnd==false&&W===j)){W=g;L(a8,W)}else{if(!aq.triggerOnTouchEnd&&a2()){W=g;aB(a8,W,x)}else{if(W===j){W=p;L(a8,W)}}}}ak(false);return null}function a5(){T=0;aY=0;Q=0;aX=0;aV=0;D=1;O();ak(false)}function H(a7){var a8=a7.originalEvent;if(aq.triggerOnTouchLeave){W=ay(g);L(a8,W)}}function aG(){aN.unbind(G,aJ);aN.unbind(az,a5);aN.unbind(au,aZ);aN.unbind(R,I);if(P){aN.unbind(P,H)}ak(false)}function ay(bb){var ba=bb;var a9=aw();var a8=aj();var a7=a6();if(!a9||a7){ba=p}else{if(a8&&bb==j&&(!aq.triggerOnTouchEnd||aq.triggerOnTouchLeave)){ba=g}else{if(!a8&&bb==g&&aq.triggerOnTouchLeave){ba=p}}}return ba}function L(a9,a7){var a8=undefined;if(F()||S()){a8=aB(a9,a7,k)}else{if((M()||aT())&&a8!==false){a8=aB(a9,a7,s)}}if(aC()&&a8!==false){a8=aB(a9,a7,i)}else{if(al()&&a8!==false){a8=aB(a9,a7,b)}else{if(ad()&&a8!==false){a8=aB(a9,a7,x)}}}if(a7===p){a5(a9)}if(a7===g){if(a){if(a9.touches.length==0){a5(a9)}}else{a5(a9)}}return a8}function aB(ba,a7,a9){var a8=undefined;if(a9==k){aN.trigger("swipeStatus",[a7,aL||null,ac||0,Y||0,T]);if(aq.swipeStatus){a8=aq.swipeStatus.call(aN,ba,a7,aL||null,ac||0,Y||0,T);if(a8===false){return false}}if(a7==g&&aR()){aN.trigger("swipe",[aL,ac,Y,T]);if(aq.swipe){a8=aq.swipe.call(aN,ba,aL,ac,Y,T);if(a8===false){return false}}switch(aL){case o:aN.trigger("swipeLeft",[aL,ac,Y,T]);if(aq.swipeLeft){a8=aq.swipeLeft.call(aN,ba,aL,ac,Y,T)}break;case n:aN.trigger("swipeRight",[aL,ac,Y,T]);if(aq.swipeRight){a8=aq.swipeRight.call(aN,ba,aL,ac,Y,T)}break;case d:aN.trigger("swipeUp",[aL,ac,Y,T]);if(aq.swipeUp){a8=aq.swipeUp.call(aN,ba,aL,ac,Y,T)}break;case v:aN.trigger("swipeDown",[aL,ac,Y,T]);if(aq.swipeDown){a8=aq.swipeDown.call(aN,ba,aL,ac,Y,T)}break}}}if(a9==s){aN.trigger("pinchStatus",[a7,aF||null,am||0,Y||0,T,D]);if(aq.pinchStatus){a8=aq.pinchStatus.call(aN,ba,a7,aF||null,am||0,Y||0,T,D);if(a8===false){return false}}if(a7==g&&a4()){switch(aF){case c:aN.trigger("pinchIn",[aF||null,am||0,Y||0,T,D]);if(aq.pinchIn){a8=aq.pinchIn.call(aN,ba,aF||null,am||0,Y||0,T,D)}break;case w:aN.trigger("pinchOut",[aF||null,am||0,Y||0,T,D]);if(aq.pinchOut){a8=aq.pinchOut.call(aN,ba,aF||null,am||0,Y||0,T,D)}break}}}if(a9==x){if(a7===p||a7===g){clearTimeout(aS);if(V()&&!E()){K=ao();aS=setTimeout(e.proxy(function(){K=null;aN.trigger("tap",[ba.target]);if(aq.tap){a8=aq.tap.call(aN,ba,ba.target)}},this),aq.doubleTapThreshold)}else{K=null;aN.trigger("tap",[ba.target]);if(aq.tap){a8=aq.tap.call(aN,ba,ba.target)}}}}else{if(a9==i){if(a7===p||a7===g){clearTimeout(aS);K=null;aN.trigger("doubletap",[ba.target]);if(aq.doubleTap){a8=aq.doubleTap.call(aN,ba,ba.target)}}}else{if(a9==b){if(a7===p||a7===g){clearTimeout(aS);K=null;aN.trigger("longtap",[ba.target]);if(aq.longTap){a8=aq.longTap.call(aN,ba,ba.target)}}}}}return a8}function aj(){var a7=true;if(aq.threshold!==null){a7=ac>=aq.threshold}return a7}function a6(){var a7=false;if(aq.cancelThreshold!==null&&aL!==null){a7=(aP(aL)-ac)>=aq.cancelThreshold}return a7}function ab(){if(aq.pinchThreshold!==null){return am>=aq.pinchThreshold}return true}function aw(){var a7;if(aq.maxTimeThreshold){if(Y>=aq.maxTimeThreshold){a7=false}else{a7=true}}else{a7=true}return a7}function ah(a7,a8){if(aq.allowPageScroll===l||aT()){a7.preventDefault()}else{var a9=aq.allowPageScroll===r;switch(a8){case o:if((aq.swipeLeft&&a9)||(!a9&&aq.allowPageScroll!=A)){a7.preventDefault()}break;case n:if((aq.swipeRight&&a9)||(!a9&&aq.allowPageScroll!=A)){a7.preventDefault()}break;case d:if((aq.swipeUp&&a9)||(!a9&&aq.allowPageScroll!=t)){a7.preventDefault()}break;case v:if((aq.swipeDown&&a9)||(!a9&&aq.allowPageScroll!=t)){a7.preventDefault()}break}}}function a4(){var a8=aK();var a7=U();var a9=ab();return a8&&a7&&a9}function aT(){return !!(aq.pinchStatus||aq.pinchIn||aq.pinchOut)}function M(){return !!(a4()&&aT())}function aR(){var ba=aw();var bc=aj();var a9=aK();var a7=U();var a8=a6();var bb=!a8&&a7&&a9&&bc&&ba;return bb}function S(){return !!(aq.swipe||aq.swipeStatus||aq.swipeLeft||aq.swipeRight||aq.swipeUp||aq.swipeDown)}function F(){return !!(aR()&&S())}function aK(){return((T===aq.fingers||aq.fingers===h)||!a)}function U(){return aM[0].end.x!==0}function a2(){return !!(aq.tap)}function V(){return !!(aq.doubleTap)}function aQ(){return !!(aq.longTap)}function N(){if(K==null){return false}var a7=ao();return(V()&&((a7-K)<=aq.doubleTapThreshold))}function E(){return N()}function at(){return((T===1||!a)&&(isNaN(ac)||ac===0))}function aW(){return((Y>aq.longTapThreshold)&&(ac<q))}function ad(){return !!(at()&&a2())}function aC(){return !!(N()&&V())}function al(){return !!(aW()&&aQ())}function C(){a1=ao();aa=event.touches.length+1}function O(){a1=0;aa=0}function ai(){var a7=false;if(a1){var a8=ao()-a1;if(a8<=aq.fingerReleaseThreshold){a7=true}}return a7}function ax(){return !!(aN.data(y+"_intouch")===true)}function ak(a7){if(a7===true){aN.bind(au,aZ);aN.bind(R,I);if(P){aN.bind(P,H)}}else{aN.unbind(au,aZ,false);aN.unbind(R,I,false);if(P){aN.unbind(P,H,false)}}aN.data(y+"_intouch",a7===true)}function ae(a8,a7){var a9=a7.identifier!==undefined?a7.identifier:0;aM[a8].identifier=a9;aM[a8].start.x=aM[a8].end.x=a7.pageX||a7.clientX;aM[a8].start.y=aM[a8].end.y=a7.pageY||a7.clientY;return aM[a8]}function aD(a7){var a9=a7.identifier!==undefined?a7.identifier:0;var a8=Z(a9);a8.end.x=a7.pageX||a7.clientX;a8.end.y=a7.pageY||a7.clientY;return a8}function Z(a8){for(var a7=0;a7<aM.length;a7++){if(aM[a7].identifier==a8){return aM[a7]}}}function af(){var a7=[];for(var a8=0;a8<=5;a8++){a7.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return a7}function aE(a7,a8){a8=Math.max(a8,aP(a7));J[a7].distance=a8}function aP(a7){if(J[a7]){return J[a7].distance}return undefined}function X(){var a7={};a7[o]=ar(o);a7[n]=ar(n);a7[d]=ar(d);a7[v]=ar(v);return a7}function ar(a7){return{direction:a7,distance:0}}function aI(){return aY-Q}function ap(ba,a9){var a8=Math.abs(ba.x-a9.x);var a7=Math.abs(ba.y-a9.y);return Math.round(Math.sqrt(a8*a8+a7*a7))}function a3(a7,a8){var a9=(a8/a7)*1;return a9.toFixed(2)}function an(){if(D<1){return w}else{return c}}function aO(a8,a7){return Math.round(Math.sqrt(Math.pow(a7.x-a8.x,2)+Math.pow(a7.y-a8.y,2)))}function aA(ba,a8){var a7=ba.x-a8.x;var bc=a8.y-ba.y;var a9=Math.atan2(bc,a7);var bb=Math.round(a9*180/Math.PI);if(bb<0){bb=360-Math.abs(bb)}return bb}function aH(a8,a7){var a9=aA(a8,a7);if((a9<=45)&&(a9>=0)){return o}else{if((a9<=360)&&(a9>=315)){return o}else{if((a9>=135)&&(a9<=225)){return n}else{if((a9>45)&&(a9<135)){return v}else{return d}}}}}function ao(){var a7=new Date();return a7.getTime()}function aU(a7){a7=e(a7);var a9=a7.offset();var a8={left:a9.left,right:a9.left+a7.outerWidth(),top:a9.top,bottom:a9.top+a7.outerHeight()};return a8}function B(a7,a8){return(a7.x>a8.left&&a7.x<a8.right&&a7.y>a8.top&&a7.y<a8.bottom)}}}));

// Swiper
var Swiper=function(f,b){function h(a,b){return document.querySelectorAll?(b||document).querySelectorAll(a):jQuery(a,b)}function g(){var c=A-l;b.freeMode&&(c=A-l);b.slidesPerView>a.slides.length&&(c=0);0>c&&(c=0);return c}function k(){function c(c){var d=new Image;d.onload=function(){a.imagesLoaded++;if(a.imagesLoaded==a.imagesToLoad.length&&(a.reInit(),b.onImagesReady))b.onImagesReady(a)};d.src=c}var d=a.h.addEventListener;a.browser.ie10?(d(a.wrapper,a.touchEvents.touchStart,B),d(document,a.touchEvents.touchMove,
    C),d(document,a.touchEvents.touchEnd,D)):(a.support.touch&&(d(a.wrapper,"touchstart",B),d(a.wrapper,"touchmove",C),d(a.wrapper,"touchend",D)),b.simulateTouch&&(d(a.wrapper,"mousedown",B),d(document,"mousemove",C),d(document,"mouseup",D)));b.autoResize&&d(window,"resize",a.resizeFix);p();a._wheelEvent=!1;if(b.mousewheelControl){void 0!==document.onmousewheel&&(a._wheelEvent="mousewheel");try{WheelEvent("wheel"),a._wheelEvent="wheel"}catch(e){}a._wheelEvent||(a._wheelEvent="DOMMouseScroll");a._wheelEvent&&
d(a.container,a._wheelEvent,N)}b.keyboardControl&&d(document,"keydown",O);if(b.updateOnImagesReady)for(a.imagesToLoad=h("img",a.container),d=0;d<a.imagesToLoad.length;d++)c(a.imagesToLoad[d].getAttribute("src"))}function p(){var c=a.h.addEventListener,d;if(b.preventLinks){var e=h("a",a.container);for(d=0;d<e.length;d++)c(e[d],"click",P)}if(b.releaseFormElements)for(e=h("input, textarea, select",a.container),d=0;d<e.length;d++)c(e[d],a.touchEvents.touchStart,Q,!0);if(b.onSlideClick)for(d=0;d<a.slides.length;d++)c(a.slides[d],
    "click",R);if(b.onSlideTouch)for(d=0;d<a.slides.length;d++)c(a.slides[d],a.touchEvents.touchStart,S)}function s(){var c=a.h.removeEventListener,d;if(b.onSlideClick)for(d=0;d<a.slides.length;d++)c(a.slides[d],"click",R);if(b.onSlideTouch)for(d=0;d<a.slides.length;d++)c(a.slides[d],a.touchEvents.touchStart,S);if(b.releaseFormElements){var e=h("input, textarea, select",a.container);for(d=0;d<e.length;d++)c(e[d],a.touchEvents.touchStart,Q,!0)}if(b.preventLinks)for(e=h("a",a.container),d=0;d<e.length;d++)c(e[d],
    "click",P)}function O(c){var b=c.keyCode||c.charCode;if(37==b||39==b||38==b||40==b){for(var e=!1,f=a.h.getOffset(a.container),v=a.h.windowScroll().left,g=a.h.windowScroll().top,h=a.h.windowWidth(),k=a.h.windowHeight(),f=[[f.left,f.top],[f.left+a.width,f.top],[f.left,f.top+a.height],[f.left+a.width,f.top+a.height]],l=0;l<f.length;l++){var q=f[l];q[0]>=v&&q[0]<=v+h&&q[1]>=g&&q[1]<=g+k&&(e=!0)}if(!e)return}if(m){if(37==b||39==b)c.preventDefault?c.preventDefault():c.returnValue=!1;39==b&&a.swipeNext();
    37==b&&a.swipePrev()}else{if(38==b||40==b)c.preventDefault?c.preventDefault():c.returnValue=!1;40==b&&a.swipeNext();38==b&&a.swipePrev()}}function N(c){var d=a._wheelEvent,e;c.detail?e=-c.detail:"mousewheel"==d?e=c.wheelDelta:"DOMMouseScroll"==d?e=-c.detail:"wheel"==d&&(e=Math.abs(c.deltaX)>Math.abs(c.deltaY)?-c.deltaX:-c.deltaY);b.freeMode?(d=a.getWrapperTranslate()+e,0<d&&(d=0),d<-g()&&(d=-g()),a.setWrapperTransition(0),a.setWrapperTranslate(d),a.updateActiveSlide(d)):0>e?a.swipeNext():a.swipePrev();
    b.autoplay&&a.stopAutoplay(!0);c.preventDefault?c.preventDefault():c.returnValue=!1;return!1}function R(c){a.allowSlideClick&&(T(c),b.onSlideClick(a,c))}function S(c){T(c);b.onSlideTouch(a,c)}function T(c){if(c.currentTarget)a.clickedSlide=c.currentTarget;else{c=c.srcElement;do if(-1<c.className.indexOf(b.slideClass))break;while(c=c.parentNode);a.clickedSlide=c}a.clickedSlideIndex=a.slides.indexOf(a.clickedSlide);a.clickedSlideLoopIndex=a.clickedSlideIndex-(a.loopedSlides||0)}function P(c){if(!a.allowLinks)return c.preventDefault?
    c.preventDefault():c.returnValue=!1,!1}function Q(a){a.stopPropagation?a.stopPropagation():a.returnValue=!1;return!1}function B(c){b.preventLinks&&(a.allowLinks=!0);if(a.isTouched||b.onlyExternal)return!1;var d;if(d=b.noSwiping)if(d=c.target||c.srcElement){d=c.target||c.srcElement;var e=!1;do-1<d.className.indexOf(b.noSwipingClass)&&(e=!0),d=d.parentElement;while(!e&&d.parentElement&&-1==d.className.indexOf(b.wrapperClass));!e&&-1<d.className.indexOf(b.wrapperClass)&&-1<d.className.indexOf(b.noSwipingClass)&&
(e=!0);d=e}if(d)return!1;H=!1;a.isTouched=!0;x="touchstart"==c.type;if(!x||1==c.targetTouches.length){a.callPlugins("onTouchStartBegin");x||(c.preventDefault?c.preventDefault():c.returnValue=!1);d=x?c.targetTouches[0].pageX:c.pageX||c.clientX;c=x?c.targetTouches[0].pageY:c.pageY||c.clientY;a.touches.startX=a.touches.currentX=d;a.touches.startY=a.touches.currentY=c;a.touches.start=a.touches.current=m?d:c;a.setWrapperTransition(0);a.positions.start=a.positions.current=a.getWrapperTranslate();a.setWrapperTranslate(a.positions.start);
    a.times.start=(new Date).getTime();y=void 0;0<b.moveStartThreshold&&(M=!1);if(b.onTouchStart)b.onTouchStart(a);a.callPlugins("onTouchStartEnd")}}function C(c){if(a.isTouched&&!b.onlyExternal&&(!x||"mousemove"!=c.type)){var d=x?c.targetTouches[0].pageX:c.pageX||c.clientX,e=x?c.targetTouches[0].pageY:c.pageY||c.clientY;"undefined"===typeof y&&m&&(y=!!(y||Math.abs(e-a.touches.startY)>Math.abs(d-a.touches.startX)));"undefined"!==typeof y||m||(y=!!(y||Math.abs(e-a.touches.startY)<Math.abs(d-a.touches.startX)));
    if(y)a.isTouched=!1;else if(c.assignedToSwiper)a.isTouched=!1;else if(c.assignedToSwiper=!0,b.preventLinks&&(a.allowLinks=!1),b.onSlideClick&&(a.allowSlideClick=!1),b.autoplay&&a.stopAutoplay(!0),!x||1==c.touches.length){if(!a.isMoved&&(a.callPlugins("onTouchMoveStart"),b.loop&&(a.fixLoop(),a.positions.start=a.getWrapperTranslate()),b.onTouchMoveStart))b.onTouchMoveStart(a);a.isMoved=!0;c.preventDefault?c.preventDefault():c.returnValue=!1;a.touches.current=m?d:e;a.positions.current=(a.touches.current-
        a.touches.start)*b.touchRatio+a.positions.start;if(0<a.positions.current&&b.onResistanceBefore)b.onResistanceBefore(a,a.positions.current);if(a.positions.current<-g()&&b.onResistanceAfter)b.onResistanceAfter(a,Math.abs(a.positions.current+g()));b.resistance&&"100%"!=b.resistance&&(0<a.positions.current&&(c=1-a.positions.current/l/2,a.positions.current=0.5>c?l/2:a.positions.current*c),a.positions.current<-g()&&(d=(a.touches.current-a.touches.start)*b.touchRatio+(g()+a.positions.start),c=(l+d)/l,d=
        a.positions.current-d*(1-c)/2,e=-g()-l/2,a.positions.current=d<e||0>=c?e:d));b.resistance&&"100%"==b.resistance&&(0<a.positions.current&&(!b.freeMode||b.freeModeFluid)&&(a.positions.current=0),a.positions.current<-g()&&(!b.freeMode||b.freeModeFluid)&&(a.positions.current=-g()));if(b.followFinger){b.moveStartThreshold?Math.abs(a.touches.current-a.touches.start)>b.moveStartThreshold||M?(M=!0,a.setWrapperTranslate(a.positions.current)):a.positions.current=a.positions.start:a.setWrapperTranslate(a.positions.current);
        (b.freeMode||b.watchActiveIndex)&&a.updateActiveSlide(a.positions.current);b.grabCursor&&(a.container.style.cursor="move",a.container.style.cursor="grabbing",a.container.style.cursor="-moz-grabbin",a.container.style.cursor="-webkit-grabbing");F||(F=a.touches.current);I||(I=(new Date).getTime());a.velocity=(a.touches.current-F)/((new Date).getTime()-I)/2;2>Math.abs(a.touches.current-F)&&(a.velocity=0);F=a.touches.current;I=(new Date).getTime();a.callPlugins("onTouchMoveEnd");if(b.onTouchMove)b.onTouchMove(a);
        return!1}}}}function D(c){y&&a.swipeReset();if(!b.onlyExternal&&a.isTouched){a.isTouched=!1;b.grabCursor&&(a.container.style.cursor="move",a.container.style.cursor="grab",a.container.style.cursor="-moz-grab",a.container.style.cursor="-webkit-grab");a.positions.current||0===a.positions.current||(a.positions.current=a.positions.start);b.followFinger&&a.setWrapperTranslate(a.positions.current);a.times.end=(new Date).getTime();a.touches.diff=a.touches.current-a.touches.start;a.touches.abs=Math.abs(a.touches.diff);
    a.positions.diff=a.positions.current-a.positions.start;a.positions.abs=Math.abs(a.positions.diff);var d=a.positions.diff,e=a.positions.abs;c=a.times.end-a.times.start;5>e&&300>c&&!1==a.allowLinks&&(b.freeMode||0==e||a.swipeReset(),b.preventLinks&&(a.allowLinks=!0),b.onSlideClick&&(a.allowSlideClick=!0));setTimeout(function(){b.preventLinks&&(a.allowLinks=!0);b.onSlideClick&&(a.allowSlideClick=!0)},100);var f=g();if(!a.isMoved&&b.freeMode)a.isMoved=!1;else if(!a.isMoved||0<a.positions.current||a.positions.current<
        -f)a.swipeReset();else if(a.isMoved=!1,b.freeMode){if(b.freeModeFluid){var e=1E3*b.momentumRatio,d=a.positions.current+a.velocity*e,v=!1,h,k=20*Math.abs(a.velocity)*b.momentumBounceRatio;d<-f&&(b.momentumBounce&&a.support.transitions?(d+f<-k&&(d=-f-k),h=-f,H=v=!0):d=-f);0<d&&(b.momentumBounce&&a.support.transitions?(d>k&&(d=k),h=0,H=v=!0):d=0);0!=a.velocity&&(e=Math.abs((d-a.positions.current)/a.velocity));a.setWrapperTranslate(d);a.setWrapperTransition(e);b.momentumBounce&&v&&a.wrapperTransitionEnd(function(){if(H){if(b.onMomentumBounce)b.onMomentumBounce(a);
        a.setWrapperTranslate(h);a.setWrapperTransition(300)}});a.updateActiveSlide(d)}(!b.freeModeFluid||300<=c)&&a.updateActiveSlide(a.positions.current)}else{G=0>d?"toNext":"toPrev";"toNext"==G&&300>=c&&(30>e||!b.shortSwipes?a.swipeReset():a.swipeNext(!0));"toPrev"==G&&300>=c&&(30>e||!b.shortSwipes?a.swipeReset():a.swipePrev(!0));f=0;if("auto"==b.slidesPerView){for(var d=Math.abs(a.getWrapperTranslate()),n=v=0;n<a.slides.length;n++)if(k=m?a.slides[n].getWidth(!0):a.slides[n].getHeight(!0),v+=k,v>d){f=
        k;break}f>l&&(f=l)}else f=r*b.slidesPerView;"toNext"==G&&300<c&&(e>=0.5*f?a.swipeNext(!0):a.swipeReset());"toPrev"==G&&300<c&&(e>=0.5*f?a.swipePrev(!0):a.swipeReset())}if(b.onTouchEnd)b.onTouchEnd(a);a.callPlugins("onTouchEnd")}}function J(c,d,e){function f(){g+=h;if(l="toNext"==k?g>c:g<c)a.setWrapperTranslate(Math.round(g)),a._DOMAnimating=!0,window.setTimeout(function(){f()},1E3/60);else{if(b.onSlideChangeEnd)b.onSlideChangeEnd(a);a.setWrapperTranslate(c);a._DOMAnimating=!1}}var v="to"==d&&0<=e.speed?
    e.speed:b.speed;if(a.support.transitions||!b.DOMAnimation)a.setWrapperTranslate(c),a.setWrapperTransition(v);else{var g=a.getWrapperTranslate(),h=Math.ceil((c-g)/v*(1E3/60)),k=g>c?"toNext":"toPrev",l="toNext"==k?g>c:g<c;if(a._DOMAnimating)return;f()}a.updateActiveSlide(c);if(b.onSlideNext&&"next"==d)b.onSlideNext(a,c);if(b.onSlidePrev&&"prev"==d)b.onSlidePrev(a,c);if(b.onSlideReset&&"reset"==d)b.onSlideReset(a,c);("next"==d||"prev"==d||"to"==d&&!0==e.runCallbacks)&&W()}function W(){a.callPlugins("onSlideChangeStart");
    if(b.onSlideChangeStart)if(b.queueStartCallbacks&&a.support.transitions){if(a._queueStartCallbacks)return;a._queueStartCallbacks=!0;b.onSlideChangeStart(a);a.wrapperTransitionEnd(function(){a._queueStartCallbacks=!1})}else b.onSlideChangeStart(a);b.onSlideChangeEnd&&(a.support.transitions?b.queueEndCallbacks?a._queueEndCallbacks||(a._queueEndCallbacks=!0,a.wrapperTransitionEnd(b.onSlideChangeEnd)):a.wrapperTransitionEnd(b.onSlideChangeEnd):b.DOMAnimation||setTimeout(function(){b.onSlideChangeEnd(a)},
        10))}function U(){for(var c=a.paginationButtons,b=0;b<c.length;b++)a.h.removeEventListener(c[b],"click",V)}function V(b){var d;b=b.target||b.srcElement;for(var e=a.paginationButtons,f=0;f<e.length;f++)b===e[f]&&(d=f);a.swipeTo(d)}function X(){a.calcSlides();0<b.loader.slides.length&&0==a.slides.length&&a.loadSlides();b.loop&&a.createLoop();a.init();k();b.pagination&&a.createPagination(!0);b.loop||0<b.initialSlide?a.swipeTo(b.initialSlide,0,!1):a.updateActiveSlide(0);b.autoplay&&a.startAutoplay();
    a.centerIndex=a.activeIndex;if(b.onSwiperCreated)b.onSwiperCreated(this);a.callPlugins("onSwiperCreated")}if(document.body.__defineGetter__&&HTMLElement){var t=HTMLElement.prototype;t.__defineGetter__&&t.__defineGetter__("outerHTML",function(){return(new XMLSerializer).serializeToString(this)})}window.getComputedStyle||(window.getComputedStyle=function(a,b){this.el=a;this.getPropertyValue=function(b){var d=/(\-([a-z]){1})/g;"float"===b&&(b="styleFloat");d.test(b)&&(b=b.replace(d,function(a,b,c){return c.toUpperCase()}));
    return a.currentStyle[b]?a.currentStyle[b]:null};return this});Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){for(var e=b||0,f=this.length;e<f;e++)if(this[e]===a)return e;return-1});if((document.querySelectorAll||window.jQuery)&&"undefined"!==typeof f&&(f.nodeType||0!==h(f).length)){var a=this;a.touches={start:0,startX:0,startY:0,current:0,currentX:0,currentY:0,diff:0,abs:0};a.positions={start:0,abs:0,diff:0,current:0};a.times={start:0,end:0};a.id=(new Date).getTime();a.container=
    f.nodeType?f:h(f)[0];a.isTouched=!1;a.isMoved=!1;a.activeIndex=0;a.centerIndex=0;a.activeLoaderIndex=0;a.activeLoopIndex=0;a.previousIndex=null;a.velocity=0;a.snapGrid=[];a.slidesGrid=[];a.imagesToLoad=[];a.imagesLoaded=0;a.wrapperLeft=0;a.wrapperRight=0;a.wrapperTop=0;a.wrapperBottom=0;var K,r,A,G,y,l,t={mode:"horizontal",touchRatio:1,speed:300,freeMode:!1,freeModeFluid:!1,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,slidesPerView:1,slidesPerGroup:1,simulateTouch:!0,followFinger:!0,shortSwipes:!0,
    moveStartThreshold:!1,autoplay:!1,onlyExternal:!1,createPagination:!0,pagination:!1,paginationElement:"span",paginationClickable:!1,paginationAsRange:!0,resistance:!0,scrollContainer:!1,preventLinks:!0,noSwiping:!1,noSwipingClass:"swiper-no-swiping",initialSlide:0,keyboardControl:!1,mousewheelControl:!1,mousewheelDebounce:600,useCSS3Transforms:!0,autoplay:!1,autoplayDisableOnInteraction:!1,loop:!1,loopAdditionalSlides:0,calculateHeight:!1,updateOnImagesReady:!0,releaseFormElements:!0,watchActiveIndex:!1,
    visibilityFullFit:!1,offsetPxBefore:0,offsetPxAfter:0,offsetSlidesBefore:0,offsetSlidesAfter:0,centeredSlides:!1,queueStartCallbacks:!1,queueEndCallbacks:!1,autoResize:!0,resizeReInit:!1,DOMAnimation:!0,loader:{slides:[],slidesHTMLType:"inner",surroundGroups:1,logic:"reload",loadAllSlides:!1},slideElement:"div",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",wrapperClass:"swiper-wrapper",paginationElementClass:"swiper-pagination-switch",paginationActiveClass:"swiper-active-switch",
    paginationVisibleClass:"swiper-visible-switch"};b=b||{};for(var n in t)if(n in b&&"object"===typeof b[n])for(var E in t[n])E in b[n]||(b[n][E]=t[n][E]);else n in b||(b[n]=t[n]);a.params=b;b.scrollContainer&&(b.freeMode=!0,b.freeModeFluid=!0);b.loop&&(b.resistance="100%");var m="horizontal"===b.mode;a.touchEvents={touchStart:a.support.touch||!b.simulateTouch?"touchstart":a.browser.ie10?"MSPointerDown":"mousedown",touchMove:a.support.touch||!b.simulateTouch?"touchmove":a.browser.ie10?"MSPointerMove":
    "mousemove",touchEnd:a.support.touch||!b.simulateTouch?"touchend":a.browser.ie10?"MSPointerUp":"mouseup"};for(n=a.container.childNodes.length-1;0<=n;n--)if(a.container.childNodes[n].className)for(E=a.container.childNodes[n].className.split(" "),t=0;t<E.length;t++)E[t]===b.wrapperClass&&(K=a.container.childNodes[n]);a.wrapper=K;a._extendSwiperSlide=function(c){c.append=function(){b.loop?(c.insertAfter(a.slides.length-a.loopedSlides),a.removeLoopedSlides(),a.calcSlides(),a.createLoop()):a.wrapper.appendChild(c);
    a.reInit();return c};c.prepend=function(){b.loop?(a.wrapper.insertBefore(c,a.slides[a.loopedSlides]),a.removeLoopedSlides(),a.calcSlides(),a.createLoop()):a.wrapper.insertBefore(c,a.wrapper.firstChild);a.reInit();return c};c.insertAfter=function(d){if("undefined"===typeof d)return!1;b.loop?(d=a.slides[d+1+a.loopedSlides],a.wrapper.insertBefore(c,d),a.removeLoopedSlides(),a.calcSlides(),a.createLoop()):(d=a.slides[d+1],a.wrapper.insertBefore(c,d));a.reInit();return c};c.clone=function(){return a._extendSwiperSlide(c.cloneNode(!0))};
    c.remove=function(){a.wrapper.removeChild(c);a.reInit()};c.html=function(a){if("undefined"===typeof a)return c.innerHTML;c.innerHTML=a;return c};c.index=function(){for(var b,e=a.slides.length-1;0<=e;e--)c===a.slides[e]&&(b=e);return b};c.isActive=function(){return c.index()===a.activeIndex?!0:!1};c.swiperSlideDataStorage||(c.swiperSlideDataStorage={});c.getData=function(a){return c.swiperSlideDataStorage[a]};c.setData=function(a,b){c.swiperSlideDataStorage[a]=b;return c};c.data=function(a,b){return b?
        (c.setAttribute("data-"+a,b),c):c.getAttribute("data-"+a)};c.getWidth=function(b){return a.h.getWidth(c,b)};c.getHeight=function(b){return a.h.getHeight(c,b)};c.getOffset=function(){return a.h.getOffset(c)};return c};a.calcSlides=function(c){var d=a.slides?a.slides.length:!1;a.slides=[];a.displaySlides=[];for(var e=0;e<a.wrapper.childNodes.length;e++)if(a.wrapper.childNodes[e].className)for(var f=a.wrapper.childNodes[e].className.split(" "),g=0;g<f.length;g++)f[g]===b.slideClass&&a.slides.push(a.wrapper.childNodes[e]);
    for(e=a.slides.length-1;0<=e;e--)a._extendSwiperSlide(a.slides[e]);!1===d||d===a.slides.length&&!c||(s(),p(),a.updateActiveSlide(),a.params.pagination&&a.createPagination(),a.callPlugins("numberOfSlidesChanged"))};a.createSlide=function(c,d,e){d=d||a.params.slideClass;e=e||b.slideElement;e=document.createElement(e);e.innerHTML=c||"";e.className=d;return a._extendSwiperSlide(e)};a.appendSlide=function(b,d,e){if(b)return b.nodeType?a._extendSwiperSlide(b).append():a.createSlide(b,d,e).append()};a.prependSlide=
    function(b,d,e){if(b)return b.nodeType?a._extendSwiperSlide(b).prepend():a.createSlide(b,d,e).prepend()};a.insertSlideAfter=function(b,d,e,f){return"undefined"===typeof b?!1:d.nodeType?a._extendSwiperSlide(d).insertAfter(b):a.createSlide(d,e,f).insertAfter(b)};a.removeSlide=function(c){if(a.slides[c]){if(b.loop){if(!a.slides[c+a.loopedSlides])return!1;a.slides[c+a.loopedSlides].remove();a.removeLoopedSlides();a.calcSlides();a.createLoop()}else a.slides[c].remove();return!0}return!1};a.removeLastSlide=
    function(){return 0<a.slides.length?(b.loop?(a.slides[a.slides.length-1-a.loopedSlides].remove(),a.removeLoopedSlides(),a.calcSlides(),a.createLoop()):a.slides[a.slides.length-1].remove(),!0):!1};a.removeAllSlides=function(){for(var b=a.slides.length-1;0<=b;b--)a.slides[b].remove()};a.getSlide=function(b){return a.slides[b]};a.getLastSlide=function(){return a.slides[a.slides.length-1]};a.getFirstSlide=function(){return a.slides[0]};a.activeSlide=function(){return a.slides[a.activeIndex]};var L=[],
    z;for(z in a.plugins)b[z]&&(n=a.plugins[z](a,b[z]))&&L.push(n);a.callPlugins=function(a,b){b||(b={});for(var e=0;e<L.length;e++)if(a in L[e])L[e][a](b)};a.browser.ie10&&!b.onlyExternal&&a.wrapper.classList.add("swiper-wp8-"+(m?"horizontal":"vertical"));b.freeMode&&(a.container.className+=" swiper-free-mode");a.initialized=!1;a.init=function(c,d){var e=a.h.getWidth(a.container),f=a.h.getHeight(a.container);if(e!==a.width||f!==a.height||c){a.width=e;a.height=f;l=m?e:f;e=a.wrapper;c&&a.calcSlides(d);
    if("auto"===b.slidesPerView){var g=0,h=0;0<b.slidesOffset&&(e.style.paddingLeft="",e.style.paddingRight="",e.style.paddingTop="",e.style.paddingBottom="");e.style.width="";e.style.height="";0<b.offsetPxBefore&&(m?a.wrapperLeft=b.offsetPxBefore:a.wrapperTop=b.offsetPxBefore);0<b.offsetPxAfter&&(m?a.wrapperRight=b.offsetPxAfter:a.wrapperBottom=b.offsetPxAfter);b.centeredSlides&&(m?(a.wrapperLeft=(l-this.slides[0].getWidth(!0))/2,a.wrapperRight=(l-a.slides[a.slides.length-1].getWidth(!0))/2):(a.wrapperTop=
        (l-a.slides[0].getHeight(!0))/2,a.wrapperBottom=(l-a.slides[a.slides.length-1].getHeight(!0))/2));m?(0<=a.wrapperLeft&&(e.style.paddingLeft=a.wrapperLeft+"px"),0<=a.wrapperRight&&(e.style.paddingRight=a.wrapperRight+"px")):(0<=a.wrapperTop&&(e.style.paddingTop=a.wrapperTop+"px"),0<=a.wrapperBottom&&(e.style.paddingBottom=a.wrapperBottom+"px"));var k=0,n=0;a.snapGrid=[];a.slidesGrid=[];for(var u=0,q=0;q<a.slides.length;q++){var f=a.slides[q].getWidth(!0),p=a.slides[q].getHeight(!0);b.calculateHeight&&
    (u=Math.max(u,p));var s=m?f:p;if(b.centeredSlides){var t=q===a.slides.length-1?0:a.slides[q+1].getWidth(!0),w=q===a.slides.length-1?0:a.slides[q+1].getHeight(!0),t=m?t:w;if(s>l){for(w=0;w<=Math.floor(s/(l+a.wrapperLeft));w++)0===w?a.snapGrid.push(k+a.wrapperLeft):a.snapGrid.push(k+a.wrapperLeft+l*w);a.slidesGrid.push(k+a.wrapperLeft)}else a.snapGrid.push(n),a.slidesGrid.push(n);n+=s/2+t/2}else{if(s>l)for(w=0;w<=Math.floor(s/l);w++)a.snapGrid.push(k+l*w);else a.snapGrid.push(k);a.slidesGrid.push(k)}k+=
        s;g+=f;h+=p}b.calculateHeight&&(a.height=u);m?(A=g+a.wrapperRight+a.wrapperLeft,e.style.width=g+"px",e.style.height=a.height+"px"):(A=h+a.wrapperTop+a.wrapperBottom,e.style.width=a.width+"px",e.style.height=h+"px")}else if(b.scrollContainer)e.style.width="",e.style.height="",u=a.slides[0].getWidth(!0),g=a.slides[0].getHeight(!0),A=m?u:g,e.style.width=u+"px",e.style.height=g+"px",r=m?u:g;else{if(b.calculateHeight){g=u=0;m||(a.container.style.height="");e.style.height="";for(q=0;q<a.slides.length;q++)a.slides[q].style.height=
        "",u=Math.max(a.slides[q].getHeight(!0),u),m||(g+=a.slides[q].getHeight(!0));p=u;a.height=p;m?g=p:(l=p,a.container.style.height=l+"px")}else p=m?a.height:a.height/b.slidesPerView,g=m?a.height:a.slides.length*p;f=m?a.width/b.slidesPerView:a.width;u=m?a.slides.length*f:a.width;r=m?f:p;0<b.offsetSlidesBefore&&(m?a.wrapperLeft=r*b.offsetSlidesBefore:a.wrapperTop=r*b.offsetSlidesBefore);0<b.offsetSlidesAfter&&(m?a.wrapperRight=r*b.offsetSlidesAfter:a.wrapperBottom=r*b.offsetSlidesAfter);0<b.offsetPxBefore&&
    (m?a.wrapperLeft=b.offsetPxBefore:a.wrapperTop=b.offsetPxBefore);0<b.offsetPxAfter&&(m?a.wrapperRight=b.offsetPxAfter:a.wrapperBottom=b.offsetPxAfter);b.centeredSlides&&(m?(a.wrapperLeft=(l-r)/2,a.wrapperRight=(l-r)/2):(a.wrapperTop=(l-r)/2,a.wrapperBottom=(l-r)/2));m?(0<a.wrapperLeft&&(e.style.paddingLeft=a.wrapperLeft+"px"),0<a.wrapperRight&&(e.style.paddingRight=a.wrapperRight+"px")):(0<a.wrapperTop&&(e.style.paddingTop=a.wrapperTop+"px"),0<a.wrapperBottom&&(e.style.paddingBottom=a.wrapperBottom+
        "px"));A=m?u+a.wrapperRight+a.wrapperLeft:g+a.wrapperTop+a.wrapperBottom;e.style.width=u+"px";e.style.height=g+"px";k=0;a.snapGrid=[];a.slidesGrid=[];for(q=0;q<a.slides.length;q++)a.snapGrid.push(k),a.slidesGrid.push(k),k+=r,a.slides[q].style.width=f+"px",a.slides[q].style.height=p+"px"}if(a.initialized){if(a.callPlugins("onInit"),b.onInit)b.onInit(a)}else if(a.callPlugins("onFirstInit"),b.onFirstInit)b.onFirstInit(a);a.initialized=!0}};a.reInit=function(b){a.init(!0,b)};a.resizeFix=function(c){a.callPlugins("beforeResizeFix");
    a.init(b.resizeReInit||c);b.freeMode?a.getWrapperTranslate()<-g()&&(a.setWrapperTransition(0),a.setWrapperTranslate(-g())):a.swipeTo(b.loop?a.activeLoopIndex:a.activeIndex,0,!1);a.callPlugins("afterResizeFix")};a.destroy=function(c){c=a.h.removeEventListener;a.browser.ie10?(c(a.wrapper,a.touchEvents.touchStart,B),c(document,a.touchEvents.touchMove,C),c(document,a.touchEvents.touchEnd,D)):(a.support.touch&&(c(a.wrapper,"touchstart",B),c(a.wrapper,"touchmove",C),c(a.wrapper,"touchend",D)),b.simulateTouch&&
    (c(a.wrapper,"mousedown",B),c(document,"mousemove",C),c(document,"mouseup",D)));b.autoResize&&c(window,"resize",a.resizeFix);s();b.paginationClickable&&U();b.mousewheelControl&&a._wheelEvent&&c(a.container,a._wheelEvent,N);b.keyboardControl&&c(document,"keydown",O);b.autoplay&&a.stopAutoplay();a.callPlugins("onDestroy");a=null};b.grabCursor&&(z=a.container.style,z.cursor="move",z.cursor="grab",z.cursor="-moz-grab",z.cursor="-webkit-grab");a.allowSlideClick=!0;a.allowLinks=!0;var x=!1,M,H=!0,F,I;a.swipeNext=
    function(c){!c&&b.loop&&a.fixLoop();!c&&b.autoplay&&a.stopAutoplay(!0);a.callPlugins("onSwipeNext");var d=c=a.getWrapperTranslate();if("auto"==b.slidesPerView)for(var e=0;e<a.snapGrid.length;e++){if(-c>=a.snapGrid[e]&&-c<a.snapGrid[e+1]){d=-a.snapGrid[e+1];break}}else d=r*b.slidesPerGroup,d=-(Math.floor(Math.abs(c)/Math.floor(d))*d+d);d<-g()&&(d=-g());if(d==c)return!1;J(d,"next");return!0};a.swipePrev=function(c){!c&&b.loop&&a.fixLoop();!c&&b.autoplay&&a.stopAutoplay(!0);a.callPlugins("onSwipePrev");
    c=Math.ceil(a.getWrapperTranslate());var d;if("auto"==b.slidesPerView){d=0;for(var e=1;e<a.snapGrid.length;e++){if(-c==a.snapGrid[e]){d=-a.snapGrid[e-1];break}if(-c>a.snapGrid[e]&&-c<a.snapGrid[e+1]){d=-a.snapGrid[e];break}}}else d=r*b.slidesPerGroup,d*=-(Math.ceil(-c/d)-1);0<d&&(d=0);if(d==c)return!1;J(d,"prev");return!0};a.swipeReset=function(){a.callPlugins("onSwipeReset");var c=a.getWrapperTranslate(),d=r*b.slidesPerGroup;g();if("auto"==b.slidesPerView){for(var e=d=0;e<a.snapGrid.length;e++){if(-c===
    a.snapGrid[e])return;if(-c>=a.snapGrid[e]&&-c<a.snapGrid[e+1]){d=0<a.positions.diff?-a.snapGrid[e+1]:-a.snapGrid[e];break}}-c>=a.snapGrid[a.snapGrid.length-1]&&(d=-a.snapGrid[a.snapGrid.length-1]);c<=-g()&&(d=-g())}else d=0>c?Math.round(c/d)*d:0;b.scrollContainer&&(d=0>c?c:0);d<-g()&&(d=-g());b.scrollContainer&&l>r&&(d=0);if(d==c)return!1;J(d,"reset");return!0};a.swipeTo=function(c,d,e){c=parseInt(c,10);a.callPlugins("onSwipeTo",{index:c,speed:d});b.loop&&(c+=a.loopedSlides);var f=a.getWrapperTranslate();
    if(!(c>a.slides.length-1||0>c)){var h;h="auto"==b.slidesPerView?-a.slidesGrid[c]:-c*r;h<-g()&&(h=-g());if(h==f)return!1;J(h,"to",{index:c,speed:d,runCallbacks:!1===e?!1:!0});return!0}};a._queueStartCallbacks=!1;a._queueEndCallbacks=!1;a.updateActiveSlide=function(c){if(a.initialized&&0!=a.slides.length){a.previousIndex=a.activeIndex;"undefined"==typeof c&&(c=a.getWrapperTranslate());0<c&&(c=0);if("auto"==b.slidesPerView){if(a.activeIndex=a.slidesGrid.indexOf(-c),0>a.activeIndex){for(var d=0;d<a.slidesGrid.length-
    1&&!(-c>a.slidesGrid[d]&&-c<a.slidesGrid[d+1]);d++);var e=Math.abs(a.slidesGrid[d]+c),f=Math.abs(a.slidesGrid[d+1]+c);a.activeIndex=e<=f?d:d+1}}else a.activeIndex=Math[b.visibilityFullFit?"ceil":"round"](-c/r);a.activeIndex==a.slides.length&&(a.activeIndex=a.slides.length-1);0>a.activeIndex&&(a.activeIndex=0);if(a.slides[a.activeIndex]){a.calcVisibleSlides(c);e=RegExp("\\s*"+b.slideActiveClass);f=RegExp("\\s*"+b.slideVisibleClass);for(d=0;d<a.slides.length;d++)a.slides[d].className=a.slides[d].className.replace(e,
    "").replace(f,""),0<=a.visibleSlides.indexOf(a.slides[d])&&(a.slides[d].className+=" "+b.slideVisibleClass);a.slides[a.activeIndex].className+=" "+b.slideActiveClass;b.loop?(d=a.loopedSlides,a.activeLoopIndex=a.activeIndex-d,a.activeLoopIndex>=a.slides.length-2*d&&(a.activeLoopIndex=a.slides.length-2*d-a.activeLoopIndex),0>a.activeLoopIndex&&(a.activeLoopIndex=a.slides.length-2*d+a.activeLoopIndex)):a.activeLoopIndex=a.activeIndex;b.pagination&&a.updatePagination(c)}}};a.createPagination=function(c){b.paginationClickable&&
    a.paginationButtons&&U();a.paginationContainer=b.pagination.nodeType?b.pagination:h(b.pagination)[0];if(b.createPagination){var d="",e=a.slides.length;b.loop&&(e-=2*a.loopedSlides);for(var f=0;f<e;f++)d+="<"+b.paginationElement+' class="'+b.paginationElementClass+'"></'+b.paginationElement+">";a.paginationContainer.innerHTML=d}a.paginationButtons=h("."+b.paginationElementClass,a.paginationContainer);c||a.updatePagination();a.callPlugins("onCreatePagination");if(b.paginationClickable)for(c=a.paginationButtons,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    d=0;d<c.length;d++)a.h.addEventListener(c[d],"click",V)};a.updatePagination=function(c){if(b.pagination&&!(1>a.slides.length)&&h("."+b.paginationActiveClass,a.paginationContainer)){var d=a.paginationButtons;if(0!=d.length){for(var e=0;e<d.length;e++)d[e].className=b.paginationElementClass;var f=b.loop?a.loopedSlides:0;if(b.paginationAsRange){a.visibleSlides||a.calcVisibleSlides(c);c=[];for(e=0;e<a.visibleSlides.length;e++){var g=a.slides.indexOf(a.visibleSlides[e])-f;b.loop&&0>g&&(g=a.slides.length-
    2*a.loopedSlides+g);b.loop&&g>=a.slides.length-2*a.loopedSlides&&(g=a.slides.length-2*a.loopedSlides-g,g=Math.abs(g));c.push(g)}for(e=0;e<c.length;e++)d[c[e]]&&(d[c[e]].className+=" "+b.paginationVisibleClass);b.loop?d[a.activeLoopIndex].className+=" "+b.paginationActiveClass:d[a.activeIndex].className+=" "+b.paginationActiveClass}else b.loop?d[a.activeLoopIndex].className+=" "+b.paginationActiveClass+" "+b.paginationVisibleClass:d[a.activeIndex].className+=" "+b.paginationActiveClass+" "+b.paginationVisibleClass}}};
    a.calcVisibleSlides=function(c){var d=[],e=0,f=0,g=0;m&&0<a.wrapperLeft&&(c+=a.wrapperLeft);!m&&0<a.wrapperTop&&(c+=a.wrapperTop);for(var h=0;h<a.slides.length;h++){var e=e+f,f="auto"==b.slidesPerView?m?a.h.getWidth(a.slides[h],!0):a.h.getHeight(a.slides[h],!0):r,g=e+f,k=!1;b.visibilityFullFit?(e>=-c&&g<=-c+l&&(k=!0),e<=-c&&g>=-c+l&&(k=!0)):(g>-c&&g<=-c+l&&(k=!0),e>=-c&&e<-c+l&&(k=!0),e<-c&&g>-c+l&&(k=!0));k&&d.push(a.slides[h])}0==d.length&&(d=[a.slides[a.activeIndex]]);a.visibleSlides=d};a.autoPlayIntervalId=
        void 0;a.startAutoplay=function(){if("undefined"!==typeof a.autoPlayIntervalId)return!1;b.autoplay&&(a.autoPlayIntervalId=setInterval(function(){b.loop?a.swipeNext():a.swipeNext(!0)||a.swipeTo(0)},b.autoplay),a.callPlugins("onAutoplayStart"))};a.stopAutoplay=function(){a.autoPlayIntervalId&&clearInterval(a.autoPlayIntervalId);a.autoPlayIntervalId=void 0;a.callPlugins("onAutoplayStop")};a.loopCreated=!1;a.removeLoopedSlides=function(){if(a.loopCreated)for(var b=0;b<a.slides.length;b++)!0===a.slides[b].getData("looped")&&
    a.wrapper.removeChild(a.slides[b])};a.createLoop=function(){if(0!=a.slides.length){a.loopedSlides="auto"==b.slidesPerView?b.loopedSlides:b.slidesPerView+b.loopAdditionalSlides;a.loopedSlides>a.slides.length&&(a.loopedSlides=a.slides.length);var c="",d="",e,f="",g=a.slides.length,h=Math.floor(a.loopedSlides/g),k=a.loopedSlides%g;for(e=0;e<h*g;e++){var l=e;e>=g&&(l=e-g*Math.floor(e/g));f+=a.slides[l].outerHTML}for(e=0;e<k;e++)d+=a.slides[e].outerHTML;for(e=g-k;e<g;e++)c+=a.slides[e].outerHTML;K.innerHTML=
        c+f+K.innerHTML+f+d;a.loopCreated=!0;a.calcSlides();for(e=0;e<a.slides.length;e++)(e<a.loopedSlides||e>=a.slides.length-a.loopedSlides)&&a.slides[e].setData("looped",!0);a.callPlugins("onCreateLoop")}};a.fixLoop=function(){var c;a.activeIndex<a.loopedSlides?(c=a.slides.length-3*a.loopedSlides+a.activeIndex,a.swipeTo(c,0,!1)):a.activeIndex>a.slides.length-2*b.slidesPerView&&(c=-a.slides.length+a.activeIndex+a.loopedSlides,a.swipeTo(c,0,!1))};a.loadSlides=function(){var c="";a.activeLoaderIndex=0;for(var d=
        b.loader.slides,e=b.loader.loadAllSlides?d.length:b.slidesPerView*(1+b.loader.surroundGroups),f=0;f<e;f++)c="outer"==b.loader.slidesHTMLType?c+d[f]:c+("<"+b.slideElement+' class="'+b.slideClass+'" data-swiperindex="'+f+'">'+d[f]+"</"+b.slideElement+">");a.wrapper.innerHTML=c;a.calcSlides(!0);b.loader.loadAllSlides||a.wrapperTransitionEnd(a.reloadSlides,!0)};a.reloadSlides=function(){var c=b.loader.slides,d=parseInt(a.activeSlide().data("swiperindex"),10);if(!(0>d||d>c.length-1)){a.activeLoaderIndex=
        d;var e=Math.max(0,d-b.slidesPerView*b.loader.surroundGroups),f=Math.min(d+b.slidesPerView*(1+b.loader.surroundGroups)-1,c.length-1);0<d&&(a.setWrapperTranslate(-r*(d-e)),a.setWrapperTransition(0));if("reload"===b.loader.logic){for(var g=a.wrapper.innerHTML="",d=e;d<=f;d++)g+="outer"==b.loader.slidesHTMLType?c[d]:"<"+b.slideElement+' class="'+b.slideClass+'" data-swiperindex="'+d+'">'+c[d]+"</"+b.slideElement+">";a.wrapper.innerHTML=g}else{for(var g=1E3,h=0,d=0;d<a.slides.length;d++){var k=a.slides[d].data("swiperindex");
        k<e||k>f?a.wrapper.removeChild(a.slides[d]):(g=Math.min(k,g),h=Math.max(k,h))}for(d=e;d<=f;d++)d<g&&(e=document.createElement(b.slideElement),e.className=b.slideClass,e.setAttribute("data-swiperindex",d),e.innerHTML=c[d],a.wrapper.insertBefore(e,a.wrapper.firstChild)),d>h&&(e=document.createElement(b.slideElement),e.className=b.slideClass,e.setAttribute("data-swiperindex",d),e.innerHTML=c[d],a.wrapper.appendChild(e))}a.reInit(!0)}};X()}};
Swiper.prototype={plugins:{},wrapperTransitionEnd:function(f,b){function h(){f(g);g.params.queueEndCallbacks&&(g._queueEndCallbacks=!1);if(!b)for(s=0;s<p.length;s++)g.h.removeEventListener(k,p[s],h)}var g=this,k=g.wrapper,p=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],s;if(f)for(s=0;s<p.length;s++)g.h.addEventListener(k,p[s],h)},getWrapperTranslate:function(f){var b=this.wrapper,h,g,k;"undefined"==typeof f&&(f="horizontal"==this.params.mode?"x":"y");
    k=window.getComputedStyle(b,null);window.WebKitCSSMatrix?k=new WebKitCSSMatrix(k.webkitTransform):(k=k.MozTransform||k.OTransform||k.MsTransform||k.msTransform||k.transform||k.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),h=k.toString().split(","));this.support.transforms&&this.params.useCSS3Transforms?("x"==f&&(g=window.WebKitCSSMatrix?k.m41:16==h.length?parseFloat(h[12]):parseFloat(h[4])),"y"==f&&(g=window.WebKitCSSMatrix?k.m42:16==h.length?parseFloat(h[13]):parseFloat(h[5]))):
        ("x"==f&&(g=parseFloat(b.style.left,10)||0),"y"==f&&(g=parseFloat(b.style.top,10)||0));return g||0},setWrapperTranslate:function(f,b,h){var g=this.wrapper.style,k={x:0,y:0,z:0},p;3==arguments.length?(k.x=f,k.y=b,k.z=h):("undefined"==typeof b&&(b="horizontal"==this.params.mode?"x":"y"),k[b]=f);this.support.transforms&&this.params.useCSS3Transforms?(p=this.support.transforms3d?"translate3d("+k.x+"px, "+k.y+"px, "+k.z+"px)":"translate("+k.x+"px, "+k.y+"px)",g.webkitTransform=g.MsTransform=g.msTransform=
    g.MozTransform=g.OTransform=g.transform=p):(g.left=k.x+"px",g.top=k.y+"px");this.callPlugins("onSetWrapperTransform",k);if(this.params.onSetWrapperTransform)this.params.onSetWrapperTransform(this,k)},setWrapperTransition:function(f){var b=this.wrapper.style;b.webkitTransitionDuration=b.MsTransitionDuration=b.msTransitionDuration=b.MozTransitionDuration=b.OTransitionDuration=b.transitionDuration=f/1E3+"s";this.callPlugins("onSetWrapperTransition",{duration:f});if(this.params.onSetWrapperTransition)this.params.onSetWrapperTransition(this)},
    h:{getWidth:function(f,b){var h=window.getComputedStyle(f,null).getPropertyValue("width"),g=parseFloat(h);if(isNaN(g)||0<h.indexOf("%"))g=f.offsetWidth-parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-left"))-parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-right"));b&&(g+=parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-left"))+parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-right")));return g},getHeight:function(f,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       b){if(b)return f.offsetHeight;var h=window.getComputedStyle(f,null).getPropertyValue("height"),g=parseFloat(h);if(isNaN(g)||0<h.indexOf("%"))g=f.offsetHeight-parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-top"))-parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-bottom"));b&&(g+=parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-top"))+parseFloat(window.getComputedStyle(f,null).getPropertyValue("padding-bottom")));return g},getOffset:function(f){var b=
        f.getBoundingClientRect(),h=document.body,g=f.clientTop||h.clientTop||0,h=f.clientLeft||h.clientLeft||0,k=window.pageYOffset||f.scrollTop;f=window.pageXOffset||f.scrollLeft;document.documentElement&&!window.pageYOffset&&(k=document.documentElement.scrollTop,f=document.documentElement.scrollLeft);return{top:b.top+k-g,left:b.left+f-h}},windowWidth:function(){if(window.innerWidth)return window.innerWidth;if(document.documentElement&&document.documentElement.clientWidth)return document.documentElement.clientWidth},
        windowHeight:function(){if(window.innerHeight)return window.innerHeight;if(document.documentElement&&document.documentElement.clientHeight)return document.documentElement.clientHeight},windowScroll:function(){if("undefined"!=typeof pageYOffset)return{left:window.pageXOffset,top:window.pageYOffset};if(document.documentElement)return{left:document.documentElement.scrollLeft,top:document.documentElement.scrollTop}},addEventListener:function(f,b,h,g){"undefined"==typeof g&&(g=!1);f.addEventListener?f.addEventListener(b,
            h,g):f.attachEvent&&f.attachEvent("on"+b,h)},removeEventListener:function(f,b,h,g){"undefined"==typeof g&&(g=!1);f.removeEventListener?f.removeEventListener(b,h,g):f.detachEvent&&f.detachEvent("on"+b,h)}},setTransform:function(f,b){var h=f.style;h.webkitTransform=h.MsTransform=h.msTransform=h.MozTransform=h.OTransform=h.transform=b},setTranslate:function(f,b){var h=f.style,g=b.x||0,k=b.y||0,p=b.z||0;h.webkitTransform=h.MsTransform=h.msTransform=h.MozTransform=h.OTransform=h.transform=this.support.transforms3d?
        "translate3d("+g+"px,"+k+"px,"+p+"px)":"translate("+g+"px,"+k+"px)";this.support.transforms||(h.left=g+"px",h.top=k+"px")},setTransition:function(f,b){var h=f.style;h.webkitTransitionDuration=h.MsTransitionDuration=h.msTransitionDuration=h.MozTransitionDuration=h.OTransitionDuration=h.transitionDuration=b+"ms"},support:{touch:window.Modernizr&&!0===Modernizr.touch||function(){return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&
        !0===Modernizr.csstransforms3d||function(){var f=document.createElement("div").style;return"webkitPerspective"in f||"MozPerspective"in f||"OPerspective"in f||"MsPerspective"in f||"perspective"in f}(),transforms:window.Modernizr&&!0===Modernizr.csstransforms||function(){var f=document.createElement("div").style;return"transform"in f||"WebkitTransform"in f||"MozTransform"in f||"msTransform"in f||"MsTransform"in f||"OTransform"in f}(),transitions:window.Modernizr&&!0===Modernizr.csstransitions||function(){var f=
        document.createElement("div").style;return"transition"in f||"WebkitTransition"in f||"MozTransition"in f||"msTransition"in f||"MsTransition"in f||"OTransition"in f}()},browser:{ie8:function(){var f=-1;"Microsoft Internet Explorer"==navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(f=parseFloat(RegExp.$1));return-1!=f&&9>f}(),ie10:window.navigator.msPointerEnabled}};
(window.jQuery||window.Zepto)&&function(f){f.fn.swiper=function(b){b=new Swiper(f(this)[0],b);f(this).data("swiper",b);return b}}(window.jQuery||window.Zepto);"undefined"!==typeof module&&(module.exports=Swiper);