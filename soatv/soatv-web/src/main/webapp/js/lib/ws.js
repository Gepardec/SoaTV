function constructWsUrlFromRelativeUrl(path) {
	var loc = window.location, new_uri;
	if (loc.protocol === "https:") {
		new_uri = "wss:";
	} else {
		new_uri = "ws:";
	}
	new_uri += "//" + loc.host;
	new_uri += loc.pathname + path;
	return new_uri;
}

var wsMessage = {
	create : function(action, data) {
		return JSON.stringify({
			action : action,
			data : data
		});
	},

	parse : function(msg) {
		var messageObject = JSON.parse(msg.data);
		try{
			return {
				action : messageObject.action,
				data : JSON.parse(messageObject.data)
			};
		} catch(err) {
			return {
				action : messageObject.action,
				data : messageObject.data
			};
		}
	}
};

var webSocket = {

	listeners : [],

	/**
	 * Adds customer listener of websocket events
	 * @param listener
	 */
	addListener : function(listener) {
		webSocket.listeners.push(listener);
	},

	/**
	 * Connects to the websocket endpoint
	 * @param url
	 */
	connect : function(url) {
		if (webSocket.ws != null)
			return;
		webSocket.ws = new WebSocket(constructWsUrlFromRelativeUrl(url));
		webSocket.ws.onopen = webSocket.onopen;
		webSocket.ws.onmessage = webSocket.onmessage;
		webSocket.ws.onclose = webSocket.onclose;

		if (webSocket.sync === true) {
			webSocket.buffer = [];
		}
	},

	/**
	 * Closes active connection
	 */
	close : function() {
		if (webSocket.opened) {
			webSocket.ws.close();
		}
	},
	
	onopen : function() {
		console.log("Websocket connection established");
		webSocket.opened = true;
		webSocket.listeners.forEach(function(listener) {
			listener.onopen();
		});
	},
	
	/**
	 * Sends text message to the endpoint
	 * @param msg
	 */
	send : function(msg) {
		webSocket.ws.send(msg);
		console.log('Sent message', msg);
	},
	onmessage : function(msg) {
		console.log('Received message', msg);
		webSocket.listeners.forEach(function(listener) {
			listener.onmessage(wsMessage.parse(msg));
		});
	},
	
	onclose : function(msg) {
		webSocket.ws = null;
		webSocket.opened = false;
		webSocket.listeners.forEach(function(listener) {
			listener.onclose();
		});
		webSocket.listeners = [];
		console.log("Websocket closed.");
	},
	
	ws : null,
	opened : false
};