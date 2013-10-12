<!-- Analytics code -->
<?php if( wps_get_option( 'analytics_type' ) == 'google_analytics' ) : wps_google_analytics_script( wps_get_option( 'google_analytics_code' ) );  ?>
<?php elseif( wps_get_option( 'analytics_type' ) == 'custom_analytics' ) : echo wps_html_unclean( wps_get_option( 'custom_analytics_code' ) ); ?>
<?php endif; ?>

</body>
</html>