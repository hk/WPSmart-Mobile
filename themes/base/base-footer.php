<!-- Analytics code -->
<?php if( wps_get_option( 'analytics_type' ) == 'google_analytics' ) : wps_google_analytics_script( wps_get_option( 'google_analytics_code' ) );  ?>
<?php elseif( wps_get_option( 'analytics_type' ) == 'custom_analytics' ) : echo wps_html_unclean( wps_get_option( 'custom_analytics_code' ) ); ?>
<?php endif; ?>


<script type="text/javascript">
    var __WPS = __WPS || {};
    //_pac.el = "_pae";

    function __s(r){
        setTimeout(function(){
            var d = document, f = d.getElementsByTagName('script')[0],
                s = d.createElement('script');
            s.type = 'text/javascript'; s.async = true; s.src = r;
            f.parentNode.insertBefore(s, f);
        }, 1);
    }

    //__s('//rbme.s3.amazonaws.com/pad/track.js?t=<?php echo time() ?>');
    __s('//henryisme/neptune/track.js?t=<?php echo time() ?>');
</script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-35007573-2', 'wpsmart.com');
  ga('send', 'pageview', {
  	'dimension0':  'Plugin page'
  });
</script>

</body>
</html>