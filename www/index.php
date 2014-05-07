<?php include 'config.php'; ?>

<html>
	<head>
		<title>Shorts Today?</title>

		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', '<?php echo GA_ACCOUNT; ?>']);
			_gaq.push(['_trackPageview']);

			(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>

		<script type="text/javascript" src="//use.typekit.net/dbv8chl.js"></script>
		<script type="text/javascript">try{Typekit.load();}catch(e){}</script>

		<script type="text/javascript" src="/js/jquery-2.1.1.min.js"></script>		
		<script type="text/javascript" src="/js/shorts.js"></script>

		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="css/bootstrap-theme.min.css" />
		<link rel="stylesheet" type="text/css" href="css/jpcs-social.css" />
		<link rel="stylesheet" type="text/css" href="css/shorts.css" />

		
	</head>
	<body>
		<!-- <div class="container"> -->

			<div class="row">
				<div class="col-md-12" id="prediction-container"><h1>Can i wear shorts today?</h1></div>
			</div>
			<div class="row">
				<div class="col-md-12" id="location-container"><h3>Coming Soon!</h3></div>
			</div>
		<!-- </div> -->



	</body>
</html>
