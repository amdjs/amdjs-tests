/*
 * needs.js v0.9.4
 * http://minion.org
 *
 * (c) 2012, Taka Kojima (taka@gigafied.com)
 * Licensed under the MIT License
 *
 * Date: Thu Feb 23 23:55:32 2012 -0800
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
		_baseUrl = "",
		_fileSuffix = "",
		_paths = {},

		// If this is node, set root to module.exports
		_root = (window) ? window : module.exports;

	function _isArray (a) {
		return a instanceof Array;
	}

	function _normalize (path, prevPath) {

		// Replace any references to ./ with ""
		path = path.replace(/(?:^|[^\.])(\.\/)/g, "/");

		// Replace any references to some/path/../ with "some/"
		while (prevPath !== path) {
			prevPath = path;
			path = path.replace(/([\w,\-]*[\/]{1,})([\.]{2,}\/)/g, "/");
		}

		// Replace any references to "//" or "////" with a single "/"
		path = path.replace(/(\/{2,})/g, "/");
		return path.charAt(0) === "/" ? path.substr(1) : path;
	}

	function _dirname (path) {
		if (!path) {return path;}
		return path.substr(0, path.lastIndexOf("/"));
	}

	function _resolve (path, basePath) {
		return _normalize((basePath || _baseUrl) + "/" + path);
	}

	function _checkLoadQ (i, j, q, ready) {
		
		for (i = _loadQ.length-1; i >= 0; i --) {

			ready = 1;
			q = _loadQ[i];

			if (q) {

				for (j = q.m.length-1; j >= 0; j --) {
					if (!require(q.m[j])) {
						ready = 0;
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
			return (!r || r == "complete" || r == "loaded");
		}

		// Bind to load events
		script.onreadystatechange = script.onload = function () {
			if (isReady()) {
				script.onload = script.onreadystatechange = script.onerror = null;
				if (_defineQ.length > 0) {
					q = _defineQ.splice(0,1)[0];
					if (q) {
						q.splice(0,0, m); // set id to the module id before calling define()
						q.splice(q.length,0, true); // set alreadyQed to true, before calling define()
						define.apply(_root, q);
					}
				}
			}
		};

		// TODO: Need to add support for load timeouts...
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
		// Always return the require func back for "require" and the string back for "module" and "exports"
		if (id === "require"){
			return require;
		}
		if (id === "module" || id === "exports") {
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
		for(var p in _paths) {
			id = id.replace(new RegExp("(^" + p + ")", "g"), _paths[p]);
		}
		return id + ".js" + _fileSuffix;
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
	function _getDependencies (id, deps, circularDeps, i, j, d, subDeps, sd) {

		deps = _dependencies[id] || [];
		circularDeps = [];

		for (i = 0; i < deps.length; i ++) {
			d = deps[i];
			subDeps = _dependencies[d];
			if (subDeps) {
				for (j = 0; j < subDeps.length; j ++) {
					sd = subDeps[j];
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

	function _setDependencies (id, dependencies, circulars, i, cid) {
		
		_dependencies[id] = dependencies.slice(0);
		circulars = _getDependencies(id)[1];

		// Define circular modules as empty modules to be defined later
		for(i = 0; i < circulars.length; i ++) {
			cid = circulars[i];
			_module(cid, {
				id: 0,
				url: 0,
				exports : {}
			});
		}
	}
	
	// Define a module
	var define = function (id, dependencies, factory, alreadyQed, depsLoaded, module, facArgs) {

        if (typeof id !== 'string') {
            factory = dependencies;
            dependencies = id;
            id = null;

			_defineQ.push([dependencies, factory]);
			return;
        }

		if (!_isArray(dependencies)) {
			factory = dependencies;
			dependencies = [];
		}

		if (!alreadyQed) {
			_defineQ.push(null); // Add an empty queue here to be cleaned up by onLoad
		}

		_currentModuleID = id;
		
		if (!dependencies.length && factory.length && typeof factory === "function") {

			// Check for CommonJS-style requires, and add them to the deps array
			factory.toString()
				.replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, "") // Remove any comments first
				.replace(/(?:require)\(\s*["']([^'"\s]+)["']\s*\)/g, // Now let's check for any sync style require("module") calls

					function ($0, $1) {
						if (dependencies.indexOf($1) < 0) {
							dependencies.push($1);
						}
					}
				);

			dependencies = (factory.length > 1 ? ["require", "exports", "module"] : ["require"]).concat(dependencies);
		}

		if (dependencies.length && !depsLoaded) {

			_setDependencies(id, dependencies);

			require(dependencies, function () {
				define(id, Array.prototype.slice.call(arguments, 0), factory, true, true);
			}, _dirname(id));

			_currentModuleID = null;

			return;
		}

		module = _module(id, null, true);
		module = module || {exports: {}};

		module.id = id;
		module.url = _getURL(id);

		if (typeof factory === "function") {
			// Swap "require", "module" and "factory" with actual objects
			facArgs =_swapArgs(
				dependencies.length ? dependencies : (factory.length > 1 ? [require, "exports", "module"] : [require]),
				{
					"module" : module,
					"exports" : module.exports
				}
			);

			module.exports = factory.apply(factory, facArgs) || module.exports;
		}
		else{
			module.exports = factory;
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
				return require.config(ids);
			}
			return _get(ids);
		}

		ids = (!_isArray(ids)) ? [ids] : ids;

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
				cb : callback
			});
			return;
		}
		callback.apply(_root, modules);
	};

	require.config = function (obj) {
		obj = obj || {};
		_baseUrl = obj.baseUrl || _baseUrl;
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
