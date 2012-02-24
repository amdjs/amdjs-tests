function config (o) {
	if (o.baseUrl) {
		go.configure({rootPath: o.baseUrl});
	}
	else{
		go.configure(o);
	}
}

var go = require,
	implemented = {
		basic: true,
		anon: true,
		require: true,
		funcString: true,
		namedWrapped: true,
		plugins: false,
		pluginDynamic: false
	};

require = undefined;
