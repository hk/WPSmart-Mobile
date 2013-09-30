<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="initial-scale=1" />
	
	<meta name="apple-mobile-web-app-title" content="<?php echo wps_get_option( 'site-name' ) ?>">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<link rel="apple-touch-icon-precomposed" href="<?php echo get_bloginfo( 'url' ) . wps_get_option( 'touch_icon', '57' ); ?>">
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo get_bloginfo( 'url' ) . wps_get_option( 'touch_icon', '114' ); ?>">
	
	<title><?php echo wps_get_option( 'site_title' ) ?></title>
	
	<script type="text/javascript">
	var addToHomeConfig = {
		animationIn: 'bubble',
		animationOut: 'drop',
		lifespan:10000,
		expire:0,
		returningVisitor: true,
		touchIcon:true,
	};
	</script>

	<?php wps_enqueue_header(); wp_head(); ?>
	
	<script type='text/javascript'>
	var $wpsmart = jQuery.noConflict();
	
	$wpsmart(document).bind("mobileinit", function(){
		$wpsmart.extend($wpsmart.mobile , {
			ajaxEnabled:false,
			hashListeningEnabled:false,
			pushStateEnabled:false
		});
		
		// fix anchor hash issue
		if(window.location.hash) {
			setTimeout(function() {
				var offset = $wpsmart(window.location.hash).offset();
				$wpsmart.mobile.silentScroll(offset.top);
			}, 500); 
		}
	});
	
	// stay inside web-app mode
	(function(document,navigator,standalone) {
        if ((standalone in navigator) && navigator[standalone]) {
            var curnode, location=document.location, stop=/^(a|html)$/i;
            document.addEventListener('click', function(e) {
                curnode=e.target;
                while (!(stop).test(curnode.nodeName)) {
                    curnode=curnode.parentNode;
                }
                if('href' in curnode && ( curnode.href.indexOf('http') || ~curnode.href.indexOf(location.host) ) ) {
                    e.preventDefault();
                    location.href = curnode.href;
                }
            },false);
        }
    })(document,window.navigator,'standalone');
	</script>
</head>

<body>