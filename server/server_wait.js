var http = require('http');

var waitForServer = function() {
	var req = http.request("http://localhost:4000/", function(res) {
		if (res.statusCode !== 200) {
			setTimeout(waitForServer, 1000);
		}
	});
	req.on('error', function(e) {
		setTimeout(waitForServer, 1000);
	});	
}

waitForServer();