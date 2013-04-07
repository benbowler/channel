<!DOCTYPE html>
<html xmlns:fb="http://ogp.me/ns/fb#" lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />

		<title><?php echo $title_tag; ?></title>

		<!-- jQuery -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>

		<link rel="stylesheet" href="assets/stylesheets/styles.css?cache=<?php echo filemtime('assets/stylesheets/styles.css') ?>" type="text/css" />

		<script type="text/javascript" src="assets/javascript/tubeplayer/jQuery.tubeplayer.min.js"></script>
		<script type="text/javascript" src="assets/javascript/history.js/scripts/bundled/html4+html5/jquery.history.js"></script>

		<!--[if lte IE 7]>
		<script type="text/javascript" src="assets/icomoon/lte-ie7.js"></script>
		<![endif]-->

		<?php foreach ($meta_tags as $property => $content) { ?>
			<meta property="<?php echo $property; ?>" content="<?php echo $content; ?>" />
		<?php } ?>

		<!--[if IE]>
			<script type="text/javascript">
				var tags = ['header', 'section'];
				while(tags.length)
					document.createElement(tags.pop());
			</script>
		<![endif]-->
	</head>
	<body class="<?php foreach (explode(':', $_GET['slug']) as $class) { echo $class . ' '; } ?>">