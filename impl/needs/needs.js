/*
 * needs.js v0.9.2
 * http://minion.org
 *
 * (c) 2012, Taka Kojima (taka@gigafied.com)
 * Licensed under the MIT License
 *
 * Date: Thu Feb 23 15:41:22 2012 -0800
 */
 (function () {

	"use strict";

	Array.prototype.indexOf = Array.prototype.indexOf || function (a, b, c, r) {
		for (b = this, c = b.length, r = -1; ~c; r = b[--c] === a ? c : r);
		return r;
	};

	var _loadQ = [],
		_defineQ = [],
		_loadedFiles = {},
		_modules = {},
		_head,
		_currentModuleID = null,
		_dependencies = {}, // Used for checking circular dependencies.

		// Configurable properties...
		_rootPath = "",
		_fileSuffix = "",
		_paths = {},

		// If this is node, set root to module.exports
		_root = (typeof window !== "undefined") ? window : module.exports;

	function _isArray (a) {
		return a instanceof Array;
	}

	function _strToArray (s) {
		return (!_isArray(s)) ? [s] : s;
	}

	function _normalize (path) {

		// Replace any references to ./ with ""
		path = path.replace(/(?:^|[^\.])(\.\/)/g, "/");

		// Replace any references to some/path/../ with "some/"
		var prevPath = "";
		while (prevPath !== path) {
			prevPath = path;
			path = path.replace(/([\w,\-]*[\/]{1,})([\.]{2,}\/)/g, "/");
		}

		// Replace any references to "//" or "////" with a single "/"
		path = path.replace(/(\/{2,})/g, "/");
		path = path.charAt(0) === "/" ? path.substr(1) : path;
		return path;
	}

	function _dirname (path) {
		if (!path) {return path;}
		return path.substr(0, path.lastIndexOf("/"));
	}

	function _resolve (path, basePath) {
		return _normalize((basePath || _rootPath) + "/" + path);
	}

	function _checkLoadQ (i, j, l, q, ready) {
		
		for (i = _loadQ.length-1; i >= 0; i --) {

			ready = true;
			q = _loadQ[i];

			if (q) {

				for (j = q.m.length-1; j >= 0; j --) {
					if (!require(q.m[j])) {
						ready = false;
						break;
					}
				}
				if (ready) {
					_loadQ.splice(i, 1);
					if (q.cb) {
						q.cb.apply(_root, require(q.m));
					}
				}
			}
		}
	}

	// Injects a script tag into the DOM
	function _inject (f, m, script, q) {
		
		if(!_head) {
			_head = document.head || document.getElementsByTagName('head')[0];
		}

		script = document.createElement("script");
		script.async = true;
		script.src = f;

		function isReady (r) {
			r = script.readyState;
			return (
				!r ||
				r == "complete" ||
				r == "loaded"
			);
		}

		// Bind to load events
		script.onreadystatechange = script.onload = function () {
			if (isReady()) {
				script.onload = script.onreadystatechange = script.onerror = null;
				if (_defineQ.length > 0) {
					q = _defineQ.splice(0,1)[0];
					q.splice(0,0, m);
					define.apply(_root, q);
				}
			}
		};

		script.onerror = function (e) {
			script.onload = script.onreadystatechange = script.onerror = null;
			throw new Error(f + " failed to load.");
		};

		// Prepend the script to document.head
		_head.insertBefore(script, _head.firstChild);
	}

	// Does all the loading of JS files
	function _load (q, i, f, m) {

		_loadQ.push(q);

		for (i = 0; i < q.f.length; i ++) {
			f = q.f[i];
			m = q.m[i];
			if (f && !_loadedFiles[f]) {
				_loadedFiles[f] = 1;
				_inject(f, m);
			}
		}
	}

	/*
		Used by _get() and define().
		Gets the module by `id`, otherwise if `def` is specified, define a new module.
	*/
	function _module (id, def, module, ns, i, l, parts, pi) {

		// Always return the string back for require, module and exports
		if (id === "require" || id === "module" || id === "exports") {
			return id;
		}

		ns = _modules;
		parts = id.split("/");

		for (i = 0, l = parts.length; i < l; i ++) {
			pi = parts[i];
			if (!ns[pi]) {
				if (!def) {
					return false;
				}
				ns[pi] = {};
			}
			ns = def ? ns[pi] = def : ns[pi];
		}

		return module ? ns : ns.exports || ns;
	}

	// Gets the object by it's fully qualified identifier.
	function _get (id, i) {
		if (!_isArray(id)) {
			return _module(id);
		}
		var modules = [];
		for (i = 0; i < id.length; i ++) {
			modules[i] = _get(id[i]);
		}
		return modules;
	}

	// Gets the URL for a given moduleID.
	function _getURL (id) {		
		if(!id) {return "";}
		id = id.indexOf("*") > -1 ? id.replace("/*", "") : id + ".js" + _fileSuffix;
		for(var p in _paths) {
			id = id.replace(new RegExp("(^" + p + ")", "g"), _paths[p]);
		}
		return id;
	}

	function _swapArgs (a, s, j) {
		for (var i in s) {
			j = a.indexOf(i);
			if (j > -1) {
				a[j] = s[i];
			}
		}
		return a;
	}

	/*
	Given a moduleID, will return all recursive dependencies in the format of :
		[
			0 : [normal dependencies]
			1 : [dependencies that have circular references back to this module]
		]
	*/
	function _getDependencies (id) {

		var deps = _dependencies[id] || [];
		var circularDeps = [];

		for (var i = 0; i < deps.length; i ++) {
			var d = deps[i];
			var subDeps = _dependencies[d];
			if (subDeps) {
				for (var j = 0; j < subDeps.length; j ++) {
					var sd = subDeps[j];
					if (sd != id && deps.indexOf(sd) < 0) {
						deps.push(sd);
					}
					else if(sd === id){
						circularDeps.push(d);
					}
				}
			}
		}
		return [deps, circularDeps];
	}

	function _setDependencies (id, dependencies) {
		
		_dependencies[id] = dependencies.slice(0);
		var circulars = _getDependencies(id)[1];

		// Define circular modules as empty modules to be defined later
		for(var i = 0; i < circulars.length; i ++) {
			var cid = circulars[i];
			_module(cid, {
				id: cid,
				url: _getURL(cid),
				exports : {}
			});
		}
	}
	
	// Define a module
	var define = function () {

		var i, j, id, dependencies, exports, modulePath, module, o, eArgs;

		var args = Array.prototype.slice.call(arguments, 0);

		// If only one argument is provided, it's the definition
		if (args.length === 1) {
			exports = args[0];
		}
		// Otherwise, if two arguments were passed in, id and exports were passed in with no dependencies
		else if (args.length === 2 || args[2] === null) {
			exports = args[1];

			// If args[0] is an array, it's a list of dependencies
			if (_isArray(args[0])) {
				dependencies = args[0];
			}
			// Otherwise, args[0] is the identifier and args[1] is the exports object
			else{
				id = args[0];
				exports = args[1];
			}
		}
		else if (args.length === 3) {
			id = args[0];
			dependencies = args[1];
			exports = args[2];
		}
		else{
			throw new Error("Invalid call to define()");
		}
		if (!id) {
			_defineQ.push(args);
			return;
		}

		_currentModuleID = id;

		dependencies = dependencies || [];

		if (dependencies.length > 0) {

			_setDependencies(id, dependencies);
			require(dependencies, function () {
				define(id, exports, null, arguments);
			}, _dirname(id));

			_currentModuleID = null;

			return;
		}

		module = _module(id, null, true);
		module = module || {exports: {}};

		module.id = id;
		module.url = _getURL(id);

		if (typeof exports === "function") {

			eArgs = args[3] ? Array.prototype.slice.call(args[3], 0) : exports.length > 0 ? [require, module, module.exports] : [];

			// Swap "require", "module" and "exports" with actual objects
			eArgs =_swapArgs(
				eArgs,
				{
					"require" : require,
					"module" : module,
					"exports" : module.exports
				}
			);

			module.exports = exports.apply(exports, eArgs) || module.exports;
		}
		else{
			module.exports = exports;
		}

		_module(id, module);

		_currentModuleID = null;
		_checkLoadQ();
	};

	// Let people know our define() function is an AMD implementation
	define.amd = {};

	/**
		Asynchronously loads in js files for the modules specified.
		If the modules have already been loaded, or are already defined,
		the callback function is invoked immediately.
	*/
	var require = function (ids, callback, dirname) {

		if(!callback) {
			if (typeof ids === "object" && !_isArray(ids)) {
				return require.configure(ids);
			}
			return _get(ids);
		}

		ids = _strToArray(ids);

		function cb (a) {
			a = Array.prototype.slice.call(arguments, 0) || [];
			return callback.apply(null, _swapArgs(a, {"require" : require}));
		}

		var i, id, module, file, q,
			fileList = [],
			moduleList = [],
			modules = [];

		for (i = 0; i < ids.length; i ++) {
			id = _resolve(ids[i], dirname);
			module = require(id);
			if (module) {
				modules.push(module);
				fileList.push("");
			}
			else{
				file = _getURL(id);
				fileList.push(file);
			}
			moduleList.push(id);
		}

		if (fileList.length > modules.length) {
			_load({
				f: fileList,
				m: moduleList,
				cb : cb
			});
			return;
		}

		cb.apply(_root, modules);
	};

	require.configure = function (obj) {
		obj = obj || {};
		_rootPath = obj.rootPath || _rootPath;
		_fileSuffix = obj.fileSuffix ? "?" + obj.fileSuffix : _fileSuffix;
		for (var p in obj.paths) {
			_paths[p] = obj.paths[p];
		}
	};

	require.toUrl = function (s) {
		return _resolve(s, _currentModuleID);
	};

	if(_root.require) {
		require.config(_root.require);
	}

	// Define global define/require methods, unless they are already defined.
	_root.define = _root.define || define;
	_root.require = _root.require || require;

})();
