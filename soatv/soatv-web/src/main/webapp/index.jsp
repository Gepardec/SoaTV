<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta
	content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
	name='viewport' />
<meta name="viewport" content="width=device-width" />

<link rel="stylesheet" type="text/css" href="css/soatv.css">

<script src='js/lib/angular.js'></script>
<script src='js/lib/d3js.js'></script>
<script src='js/lib/ws.js'></script>

<script src='js/classes/soatv.model.js'></script>
<script src='js/classes/soatv.visualization.js'></script>

<script src='js/modules/soatv.model.module.js'></script>
<script src='js/modules/soatv.properties.module.js'></script>
<script src='js/modules/soatv.visualization.module.js'></script>
<script src='js/modules/soatv.main.module.js'></script>

<script src='js/soatv.app.js'></script>

<title>SOA TV</title>
</head>
<body ng-app="soatvApp">
	<div ng-controller="MainCtrl">
		<div id = "top">
			<div id="connection"><img ng-src="{{connection.imageLink}}" ng-click="toggleConnection()">{{connection.message}}</div>
			<hr id="top-separator"/>
		</div>
		<div id = "container">
			<p class="tv" soatv-tv align="center"></p>
			<button ng-click="nextNode()">next node</button>
			<button ng-click="nextAction()">next action</button>
		</div>
	</div>
</body>

</html>