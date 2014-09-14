// Loader.js
// this files load the App and gives a global interface to support ES5 AMD modules inside ember
// this is a modified version of Loader.js taken directly from ember code but you can find
// original source at https://github.com/stefanpenner/loader.js

(function() {
	var define, requireModule,
		Ember = this.Ember = this.Ember || {};
	if (typeof Ember === 'undefined') {
		Ember = {};
	}

	if (typeof Ember.__loader === 'undefined') {
		var registry = {},
			seen = {};

		this.define = define = function(name, deps, callback) {
			registry[name] = {
				deps: deps,
				callback: callback
			};
		};

		this.requireModule = requireModule = function(name) {
			if (seen.hasOwnProperty(name)) {
				return seen[name];
			}
			seen[name] = {};

			if (!registry[name]) {
				// since by the time this code is actually suppose to run Ember code is already loaded
				// This hack will return loaded modules that are loaded as ES6 module
				if (name.indexOf('ember-') === 0) {
					name = name.substring(6, name.length);
					if (name == "views/views/view") {
						return {'default': Ember.View};
					}
					if (Ember[name]) {
						return Ember[name];
					}
					name =  name[0].toUpperCase() + name.substring(1, name.length);
					if (Ember[name]) {
						return Ember[name];
					}
					console.log(name);
				}
				throw new Error("Could not find module " + name);
			}

			var mod = registry[name];
			var deps = mod.deps;
			var callback = mod.callback;
			var reified = [];
			var exports;

			for (var i = 0, l = deps.length; i < l; i++) {
				if (deps[i] === 'exports') {
					reified.push(exports = {});
				} else {
					reified.push(requireModule(resolve(deps[i])));
				}
			}

			var value = callback.apply(this, reified);
			return seen[name] = exports || value;

			function resolve(child) {
				if (child.charAt(0) !== '.') {
					return child;
				}
				var parts = child.split("/");
				var parentBase = name.split("/").slice(0, -1);

				for (var i = 0, l = parts.length; i < l; i++) {
					var part = parts[i];

					if (part === '..') {
						parentBase.pop();
					} else if (part === '.') {
						continue;
					} else {
						parentBase.push(part);
					}
				}

				return parentBase.join("/");
			}
		};
		// requirejs._eak_seen = registry;

		Ember.__loader = {
			define: define,
			require: requireModule,
			registry: registry
		};
	} else {
		this.define = Ember.__loader.define;
		this.requireModule = Ember.__loader.require;
	}
})();