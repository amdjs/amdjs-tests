var http = require('http');

var waitForServer = function() {
	console.log("Waiting for amdjs-tests server to start");
	var req = http.request("http://localhost:4000/", function(res) {
		if (res.statusCode === 200) {
			console.log("amdjs-tests server has started");
		} else {
			setTimeout(waitForServer, 1000);
		}		
	});
	req.on('error', function(e) {
		setTimeout(waitForServer, 1000);
	});	
}

waitForServer();