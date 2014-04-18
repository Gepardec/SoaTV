<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta
	content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
	name='viewport' />
<meta name="viewport" content="width=device-width" />

<link rel="stylesheet" type="text/css" href="css/soatv.css">
<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">

<!-- <script src='js/lib/jquery.js'></script> -->
<script src='js/lib/angular.js'></script>
<!-- <script src='js/lib/bootstrap.min.js'></script> -->
<script src='js/lib/d3js.js'></script>
<!-- <script src='js/lib/d3tooltip.js'></script> -->
<script src='js/lib/ws.js'></script>

<script src='js/classes/soatv.model.js'></script>
<script src='js/classes/soatv.visualization.builders.js'></script>
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
		<div id="top">
			<div id="header">
				<strong>JBoss</strong> Middleware Presentation
			</div>
			<div id="connection">
				<img ng-src="{{connection.imageLink}}" ng-click="toggleConnection()">{{connection.message}}
			</div>
			<hr id="top-separator" />
		</div>
		<div id="container" class="container">
			<div class="row">
				<div class="col-md-8">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title clickable" ng-class="{'bold' : isShowing == 'visualization'}" ng-click="changeShowing('visualization')">Visualization</h3>
						</div>
						<div class="panel-body">
							<p class="tv" soatv-tv ng-show="isShowing == 'visualization'"></p>
							<p class="tv" soatv-history ng-show="isShowing == 'history'"></p>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title clickable" ng-class="{'bold' : isShowing == 'history'}" ng-click="changeShowing('history')">History</h3>
						</div>
						<div class="panel-body row" id="messages">
							<div class="col-md-6" ng-repeat="message in topic">
								<ng-include src="'templates/messagebox.html'"></ng-include>
							</div>
						</div>
					</div>
				</div>
			</div>

			<button ng-click="nextNode()">next node</button>
			<button ng-click="nextAction()">next action</button>
		</div>
	</div>
</body>

</html>