var zazlConfig;

var config = function(cfg) {
	zazlConfig = cfg;
};

var go = function(dependencies, callback) {
	var cfg = zazlConfig ? zazlConfig : {};
	var pathname = window.location.pathname;
	pathname = pathname.substring(1);
	pathname = pathname.substring(pathname.indexOf('/'));
	pathname = pathname.substring(0, pathname.lastIndexOf('/')) + "/./";
	cfg.baseUrl = pathname;
	cfg.directInject = true;
	cfg.injectUrl = "/_javascript";
	cfg.scanCJSRequires = true;
	zazl(cfg, dependencies, callback);
};
var implemented = {
		basic: true,
		anon: true,
		funcString: true,
        namedWrapped: true,
		require: true,
		plugins: true,
        pathsConfig: true,
        packagesConfig: true,
        mapConfig: true,
        moduleConfig: true,
        shimConfig: true
		//pluginDynamic: true
    };
require = undefined;
