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
		funcString: false,
		namedWrapped: false,
		plugins: false,
		pluginDynamic: false
	};

require = undefined;
