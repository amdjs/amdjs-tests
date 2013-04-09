var npm = require('npm');
var path = require('path');
var fs = require('fs');
var util = require('util');

function startZazl(zazloptimizer, app) {
	var testsdir = fs.realpathSync(path.join(__dirname, "../../tests"));
	var optimizer = zazloptimizer.createConnectOptimizer(testsdir, false);
	app.use("/zazl/_javascript", optimizer);
	app.get('/framework/zazl.js', function(req, res) {
	  	fs.readFile(zazloptimizer.getLoaderDir()+"/loader/amd/zazl.js", function(err, data) {
			res.setHeader('Content-Type', 'text/javascript');
			res.end(data.toString());
	  	});
	});
}

exports.install = function(app, cb) {
	npm.load([], function(err, npm) {
		if (err) {
			cb("zazl", false);
			return;
		}
		var zazloptimizer;
		try {
			zazloptimizer = require('zazloptimizer');
			util.log("zazloptimizer is already installed");
			startZazl(zazloptimizer, app);
			cb("zazl", true);
		} catch (e) {
			npm.commands.install(['zazloptimizer'], function() {
				util.log("zazloptimizer has been installed");
				zazloptimizer = require('zazloptimizer');
				startZazl(zazloptimizer, app);
				cb("zazl", true);
			});
		}
	});
}