<?php include('shared/head.php'); ?>
		<script type="text/javascript" src="assets/javascript/app.js?cache=<?php echo filemtime('assets/javascript/app.js') ?>"></script>

		<div id="fb-root"></div>
		<script type="text/javascript">
		$(function () {

		    window.fbAsyncInit = function() {
			FB.init({
			  appId      : '<?php echo $appID; ?>', // App ID
			  channelUrl : '//<?php echo $_SERVER["HTTP_HOST"]; ?>/assets/channel.html', // Channel File
			  status     : true, // check login status
			  cookie     : true, // enable cookies to allow the server to access the session
			  xfbml      : true // parse XFBML
			});

			// @todo: remove this??
			FB.Event.subscribe('auth.login', function(response) {
			  window.location = window.location; //+'/<?php echo $video['slug']; ?>';
			});

			FB.getLoginStatus(function(response) {

				// Setup video and user objects
				$.site = { 
					title : "<?php echo $site_title; ?>",
					description : "<?php echo $site_description; ?>",
				};

				<?php if (isset($basic)) { ?>

					$.user = { 
						_id : "<?php echo $user['_id']; ?>",
						email: "<?php echo $user['email']; ?>",
						logged_in : <?php echo ($user) ? 'true' : 'false' ; ?>,
						subscribed : <?php echo ($user['subscribed']) ? 'true' : 'false' ; ?>,
						newuser : <?php echo ($user['newuser'] == '' || $user['newuser'] == 'first') ? "'first'" : $user['newuser'] ; ?>,
						opengraph : <?php echo ($user['opengraph'] == '' || $user['opengraph'] == 'first') ? "'first'" : $user['opengraph'] ; ?>,
						emailfrequency : "<?php echo ($user['emailfrequency'] == '' || $user['emailfrequency'] == 'first') ? 'first' : $user['emailfrequency'] ; ?>"
					};

				<?php } else { ?>

					$.user = false;

				<?php } ?>

				if (response.status === 'connected') {
				    // the user is logged in and has authenticated your
				    // app, and response.authResponse supplies
				    // the user's ID, a valid access token, a signed
				    // request, and the time the access token 
				    // and signed request each expire
				    var uid = response.authResponse.userID;
				    var accessToken = response.authResponse.accessToken;

				    $.user.accesstoken = accessToken;

					if(!$.user.logged_in) {
						// @todo: need to double up??
					    FB.login(function(response) {
			                var url = [location.protocol, '//', location.host, '/', $.video.slug].join(''); // , location.pathname
			                window.location = url;
			            }, {scope: 'email,user_likes'});
					}

				    //console.log('I am logged in and connected '+uid);
				} else if (response.status === 'not_authorized') {
				    // the user is logged in to Facebook, 
				    // but has not authenticated your app
				    console.log('I am logged in but not authorised');
				} else {
				    // the user isn't logged in to Facebook.
				    console.log('I am logged out completely');
				}

				// Start app
				app();

	 		});

			FB.Canvas.setAutoGrow();
		  
		};

		// Load the SDK Asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		});
	  </script>

		<?php //include('shared/header.php'); ?>

		<?php //include('shared/footer.php'); ?>

		<!--
		<section id="video_info">
			
			<h1 class="video_title"><?php echo $video['title']['$t']; ?></h1>
			<?php /* @todo: channel pages   <a href="/channel:<?php echo $video['title']['$t']; ?>" class="channel"><h1 id="video_title"><?php echo $video['title']['$t']; ?></h1></a>  */ ?>
			<a href="http://youtube.com/user/<?php echo $video['author'][0]['name']['$t']; ?>" target="_blank"><h2 class="video_channel"><?php echo $video['author'][0]['name']['$t']; ?></h2></a>
			<div class="video_description"><?php echo $video['html_description']; ?></div>

		</section>
		-->

	<?php
	if (isset($basic)) {
		// Include profile view
		include('shared/create_channel.php');

		?>
		<section id="player">
			<div>
				<h3 class="guide"><span class="selected-channel"></span> / <span class="reason-selected"></span> / <span class="video-title"></span></h3>
				<a class="previous-video">previous</a>
				<div id="player-yt"></div>
				<a class="next-video">next</a>

				<img src="/assets/images/singleguide.png" />
				<!--<p class="video-description"></p>-->
			</div>
		</section>

		<section id="guide">
			<img src="/assets/images/channelguide.png" />
		</section>
		<?php

		//include('shared/profile.php');

	} else { ?>

		<section id="login">
			<div>

				<h1>Channel<em>Beta</em></h1>

				<a href="#" class="fb-login btn">Login with <span>facebook</span></a>
				<br />
				
				<a href="https://twitter.com/search?q=%23SeamlessViewing" class="seamlessviewing" target="_blank">#SeamlessViewing</a>

			</div>
		</section>

	<?php } ?>

<?php include('shared/foot.php'); ?>
