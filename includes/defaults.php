<?php
// default sttings
global $wps_default_options;
$wps_default_options = array(
	'license_key' => '',
	'current_theme' => 'classic',
	'enable_comments' => true,
	'enable_menu' => false,
	'enable_search' => true,
	'analytics_type' => 'none',
	'advertising_type' => 'none',
	'show_thumbnails' => true,
	'show_post_tags' => false,
	'show_post_categories' => false,
	'site_title' => get_bloginfo( 'name' ),
	'site_logo' => '',
	'site_font' => 'Helvetica',
	'site_background_color' => '#EFEFEF',
	'header_background_color' => '#E1E1E1',
	'header_trim_color' => '#50BCB6',
	'header_text_color' => '#777777',
	'header_top_bar_color' => '#50BCB6',
	'google_analytics_code' => '',
	'custom_analytics_code' => '',
	'adsense_client_id' => '',
	'custom_advertising_code' => '',
	'pin_header' => true,
	'pin_ad' => false,
	'menu_links' => array(),
	'touch_icon' => array( '57' => '/wp-content/plugins/wpsmart-mobile/themes/base/base-images/touch_icon_57.png', '114' => '/wp-content/plugins/wpsmart-mobile/themes/base/base-images/touch_icon_114.png' )
);

// fonts available
global $wps_fonts;
$wps_fonts = array( 
	'Arial', 
	'Courier',
	'Georgia', 
	'Helvetica',
	'Times New Roman', 
	'Verdana'
);

// device user agents
global $wps_user_agents;
$wps_user_agents = array(
	'iPhone',
	'iPod',
	'Android',
	'Windows Phone',
	'Windows Mobile',
	'BlackBerry'
);
?>