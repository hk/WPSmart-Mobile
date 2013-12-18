var $wpsmart = jQuery.noConflict();

$wpsmart(document).ready(function() {

    /*
    var mySwiper = $wpsmart('#slider').swiper({
        mode:'horizontal',
        loop: false,
        duration:500
    });
*/

    function bindScroll(){
        if($wpsmart(window).scrollTop() + $wpsmart(window).height() > ($wpsmart(document).height() * .67)) {
            $wpsmart(window).unbind('scroll');
            openPanel();
        }
    }

    //$wpsmart(window).scroll(bindScroll);


    var panel = $wpsmart("#_wps-ad-post").swipe( {
        triggerOnTouchEnd: false,
        triggerOnTouchLeave: true,
        threshold: 75,
        allowPageScroll: "none",
        maxTimeThreshold:2500,
        swipeStatus:function(event, phase, direction, distance, duration, fingerCount)
        {
            var panelHeight = 200;

            if( phase=="move" && ( direction=="down" /*|| direction == "up"*/ ) ) {

                //console.log(panelHeight, panelMaxHeight, distance);


                if (direction == "down")
                    scrollImages(distance * (-1));
                else if (direction == "up")
                    scrollImages(distance-130);


            } else if ( phase == "cancel") {
                //console.log('cancel');

                if (direction == "down") {
                    scrollImages(0);
                    //$wpsmart('#wps-ad-handle').removeClass("close").addClass("open");
                } /*else if (direction == "up") {
                    scrollImages(0);
                    //$wpsmart('#wps-ad-handle').removeClass("open");
                }*/

            } else if ( phase =="end" ) {
                //console.log("DONE");
                if (direction == "down") {
                    //closePanel(panelHeight);
                    scrollImages(panelHeight * (-1));//previousImage()
                    //$wpsmart('#wps-ad-handle').removeClass("close").addClass("open");
                }
                /*else if (direction == "up") {
                    //console.log('test');
                    $wpsmart('#wps-ad-handle').removeClass("open");
                    //console.log($wpsmart('#wps-ad-handle'));
                    scrollImages(0);
                }*/
                    //nextImage()
            }

            /*
            var closePanel = function() {

            };*/
            //Here we can check the:
            //phase : 'start', 'move', 'end', 'cancel'
            //direction : 'left', 'right', 'up', 'down'
            //distance : Distance finger is from initial touch point in px
            //duration : Length of swipe in MS
            //fingerCount : the number of fingers used
        }
        /*
        threshold:0,
        maxTimeThreshold:2500,
        */
    });

    /*
    var panelKnob = $wpsmart('#wps-ad-handle').swipe( {
        tap:function(event, target) {
            //console.log(event, target);
            if($wpsmart(this).hasClass('open') === true) {
                scrollImages(0);
                $wpsmart('#wps-ad-handle').removeClass("open").addClass("close");
            } else {
                scrollImages(-130);
                $wpsmart('#wps-ad-handle').removeClass("close").addClass("open");
            }

        }
    });
    */
    function openPanel() {
        //panelKnob.removeClass("close").addClass("open");
        //panel.addClass("open");
        //panel.css("bottom","0px");
        panel.css("-webkit-transform", "translate3d(0px, 0px, 0px)");
        panel.addClass('wps-card-open');
        //panel.css("-webkit-transition-duration", "0ms");
        //scrollImages(panelHeight * (-1));
    }

    function closePanel(panelHeight) {
        //panelKnob.removeClass("close").addClass("open");
        //panel.removeClass('open').addClass("close");
        panel.removeClass('wps-card-open');
        //scrollImages(panelHeight * (-1));
    }

    /**
     * Manually update the position of the imgs on drag
     */
    function scrollImages(position)
    {
        //console.log("position:" + position);
        //panel.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
        /*
        if(distance < 0)
            distance = 0;

        if(distance > 150)
            distance = 150;
            */
        //inverse the number we set in the css
        var value = (position > 0 ? "-" : "") + Math.abs(position).toString();
        //var value = Math.abs(position).toString();
        //var currHeight = $wpsmart("#wps-ad-post").height();
        //panel.css("-webkit-transition-duration", "0ms");
        panel.css("-webkit-transition-duration", "0ms");
        panel.css("-webkit-transform", "translate3d(0px,"+value +"px,0px)");
        //panel.css("bottom", value +"px");
        //console.log(currHeight);
        /*
        if(distance >= 0 && distance <= 150) {
            //console.log("still moving");
            var value = Math.abs(distance).toString();
            //panel.css("-webkit-transform", "translate3d(0px,"+value +"px,0px)");
            //panel.css("height", value +"px");
        }
        */
    }

    /*
    var hideSwiper = $wpsmart('#slider2').swiper({
        //Your options here:
        mode:'vertical',
        loop: true,
    });
    */
    //window.mySwipe = Swipe(document.getElementById('slider'), {continuous: false});

	$wpsmart('#view_full_site').on('click',function(event) {
		event.preventDefault();
		
		document.cookie = 'wpsmart_view_full_site=1';
		window.location.reload();
		
		return false;
	});

	$wpsmart('#view-menu').on('click', function(event) {
		event.preventDefault();
		
		$wpsmart('.menu-bar').toggleClass('shown');
		
		return false;
	});
	
	$wpsmart('#view-search').on('click',function(event) {
		event.preventDefault();
		
		$wpsmart('.search-bar').toggleClass('shown');
		
		return false;
	});
	
	$wpsmart('.input-wrap input').keyup(function(event) {
    	if($wpsmart(this).val() != '') {
    		$wpsmart(this).closest('.input-wrap').find('label').hide();
    	} else {
	    	$wpsmart(this).closest('.input-wrap').find('label').show();
    	}
    });
    
    $wpsmart('.input-wrap input').keyup(function(event) {
		event.stopImmediatePropagation();
		
		if($wpsmart(this).val() == '') {
			$wpsmart(this).closest('.input-wrap').find('label').show();
		}		 
		
		return false;
    });
    
    $wpsmart('#main').on('click', '#load-more a', function(event) {
    	event.preventDefault();
    	     	
    	var object = $wpsmart(this);
    	object.text('Loading...');
    	
    	var data = {action: 'wpsmart_load_more'};
    	    	
    	$wpsmart.post(object.parent().data('url'), function(response) {
    		setTimeout(function() { $wpsmart('#load-more').replaceWith(response); }, 1000);
    	});
    	
    	return false;
    });

    /*
    $wpsmart(function() {
    	if(window.location.search.indexOf(('wps_preview=1')) != -1) {
			$wpsmart("a").attr('href', function(i, h) {
				return h + (h.indexOf('?') != -1 ? "&wps_preview=1" : "?wps_preview=1");
			});
		}
    });
    */
    
    $wpsmart("#page").fitVids();
});


function firePixel() {

    pixel.attr('src', 'http://henryis.me/debug/test.php?a=LONGASS64BIT ENCODED STRING');
}
  
