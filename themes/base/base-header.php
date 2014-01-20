<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="initial-scale=1" />
	<title><?php echo wps_get_option( 'site_title' ) ?></title>

	<?php wps_enqueue_header(); wp_head(); ?>

	<script type="text/javascript">var $wpsmart = jQuery.noConflict();</script>
    <script type="text/javascript" src="<?php echo wps_get_base_theme_uri(); ?>/base-js/wps-ads.js"></script>
</head>

<body>