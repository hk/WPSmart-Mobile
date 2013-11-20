<?php 
global $is_ajax;
$is_ajax = isset( $_SERVER['HTTP_X_REQUESTED_WITH'] );

if( ! $is_ajax ) { get_header(); }
?>

<div class="single-content">

	<?php while ( have_posts() ) : the_post(); ?>

		<article id="post-<?php the_ID(); ?>">
			<div class="entry-wrapper">
				<div class="entry-header">
					<h1 class="entry-title"><?php the_title(); ?></h1>
					<div class="entry-meta">
						<?php echo wps_posted_on(); ?>
						<?php if( wps_get_option( 'show_post_categories' ) && $category = wps_get_category() ) : ?><span class="entry-taxonomy"><strong>Category</strong>: <?php echo $category ?></span><?php endif; ?>
						<?php if( wps_get_option( 'show_post_tags' ) && $tags = wps_get_tags() ) : ?><span class="entry-taxonomy"><strong>Tags</strong>: <?php echo $tags ?></span><?php endif; ?>
					</div>
				</div>
		
				<div class="entry-content"><?php the_content(); ?></div>
			</div>
		</article>

	<?php comments_template( '', true ); ?>

	<?php endwhile; ?>

</div><!-- .single-content -->

<?php if( ! $is_ajax ) { get_footer(); } ?>