				<div class="navbar navbar-fixed-bottom">
	              <div class="navbar-inner footer">
	                <div class="container">

		                <a class="btn btn-navbar" data-toggle="collapse" data-target=".navbar-responsive-collapse">
		                    <span class="icon-bar"></span>
		                    <span class="icon-bar"></span>
		                    <span class="icon-bar"></span>
		                </a>
		                <?php /* ?>
	                    <form class="navbar-form pull-left" action="">
	                    	<div class="input-prepend input-append">
		                    	<span class="add-on"><i class="icon-bubbles"></i></span>
		                        <input type="text" class="span3" placeholder="what do you think?">
		                        <button class="btn" type="button">share</button>
		                    </div>
	                    </form>
	                    <?phpm */ ?>

	                    <ul class="nav pull-left hidden-phone">
			                	<li><a id="video_status"></a></li>
	                    </ul>

	                    <ul class="nav pull-right">

	                    	<li><a class="video_title info thin-right"><?php echo $video['title']['$t']; ?></a></li>
	                    	<li><a class="info thin-left"><i class="icon-info"></i></a></li>
	                    	<li><a class="video_channel"><?php echo $video['author'][0]['name']['$t']; ?></a></li>

	                    </ul>

	                </div>
	              </div><!-- /navbar-inner -->
	            </div>