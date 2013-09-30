<?php 
global $is_ajax;
$is_ajax = isset( $_SERVER['HTTP_X_REQUESTED_WITH'] );


if( ! $is_ajax ) : get_header(); // if not an ajax request
?>

<div id="main-content" class="home-content">

<?php endif; ?>

	<?php wps_page_head() ?>

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    	
    	<?php $post_image_src = wps_get_post_image( $post->ID ); ?>
    	
    	<article id="post-<?php the_ID(); ?>" class="swipe">
    		<div class="entry-wrapper" style="<?php echo $post_image_src == '' ? "padding-right:0" : null ?>">
    			<a href="<?php the_permalink(); ?>" target="_self" rel="bookmark" style="display:block;">
    				<div class="entry-image" style="<?php if( $post_image_src != '' ): ?>background-image:url(<?php echo $post_image_src ?>);<?php endif; echo ! wps_get_option( 'show_thumbnails' ) ? 'display:none' : null ?>"></div>
		    		<div class="entry-header">
		    			<h1 class="entry-title"><?php the_title(); ?></h1>
				    	<div class="entry-meta"><?php echo wps_posted_on( false ); ?></div>
				    </div>
    			</a>
    			
			    <div class="clear"></div>
    		</div>
    		
    		<div class="share"><img src="<?php echo get_template_directory_uri(); ?>/images/convo_bubble.png" width="32"/></div>	
		</article>

    <?php endwhile; endif; ?>

    <?php if(get_next_posts_link() != ''): ?>
    
    	<div id="load-more" class="load-more" data-url="<?php echo get_next_posts_page_link(); ?>">Tap to load more articles</div>
    	
    <?php else: ?>
    	
    	<div class="load-more">Showing all articles</div>
    	
    <?php endif; ?>

<?php if( ! $is_ajax ) : // if not an ajax request ?>

</div><!-- #main-content -->

<script type='text/javascript'>
$wpsmart(document).bind("pageinit", function() {
    $wpsmart('#load-more').live('tap', function(event) {    	
    	var object = $wpsmart(this);
    	object.text('Loading...');
    	
    	var data = {action: 'wpsmart_load_more'};
    	    	
    	$wpsmart.post(object.data('url'), function(response) {
    		setTimeout(function() { $wpsmart('#load-more').replaceWith(response); }, 1000);
    	});
    	
    	event.stopImmediatePropagation();
    });
    
});
</script>

<?php get_footer(); endif; ?>