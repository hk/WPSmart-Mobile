<div class="wps-admin-option-group" id="wps-admin-feedback">	
	<div class="wps-admin-section">
		<div class="wps-admin-section-title">
			<span>Advertising</span>
		</div>
		<div class="wps-admin-section-input-group">
			<div class="wps-admin-input-checkbox">
				<input type="hidden" name="enable_adsense" value="0"/>
				<input type="checkbox" name="enable_adsense" id="enable_adsense" value="1" <?php echo wps_checkbox_text( 'enable_adsense' ) ?>/><label for="enable_adsense">Enable Google AdSense</label>
			</div>
			
			<div class="wps-admin-section-input wps-adsense-setting <?php echo ! wps_checkbox_text( 'enable_adsense' ) ? "hidden" : null ?>">
				<label>Google AdSense Client ID</label>
				<input type="text" class="text" name="adsense_client_id" value="<?php echo wps_get_option( 'adsense_client_id' ) ?>"/>
			</div>
		</div>
		
		<div class="wps-admin-section-title">
			<span>Question or Feedback</span>
		</div>
		<div class="wps-admin-section-input-group">
			<div class="wps-admin-section-input">
				<label>Paste your Google Analytics code here</label>
				<textarea id="" name="" rows="5"></textarea>
			</div>
		</div>
	</div>
</div>