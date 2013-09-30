var $wpsmart = jQuery.noConflict();

$wpsmart(document).bind('pageinit', function() {
	
	$wpsmart('#view_full_site').tap(function(event) {
		event.stopImmediatePropagation();
		
		document.cookie = 'wpsmart_view_full_site=1';
		window.location.reload();
		
		return false;
	});

	$wpsmart('#view-menu').tap(function(event) {
		event.stopImmediatePropagation();
		
		$wpsmart('.menu-bar').toggleClass('shown');
		
		return false;
	});
	
	$wpsmart('#view-search').tap(function(event) {
		event.stopImmediatePropagation();
		
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
    
    $wpsmart(function() {
    	if(window.location.search.indexOf(('wps_preview=1')) != -1) {
			$wpsmart("a").attr('href', function(i, h) {
				return h + (h.indexOf('?') != -1 ? "&wps_preview=1" : "?wps_preview=1");
			});
		}
    });
    
    $wpsmart("#page").fitVids();
});



  
