/* jshint esnext:true, strict:false*/
/* globals define */
// ES6 module loader
// Since ember mixes ES6 modules with ES5 AMD were faking the async module load.
// this code will loads required necessary modules and defines them to be used with Loader.js code
// defined in main.js

import rsvp from "./rsvp_loader";
import router from "/ember-lib/router";
import { Transition, logAbort, TransitionAborted } from "/ember-lib/router/transition";

var modules = {
	rsvp : rsvp,
	router: {'default': router},
	'router/transition': {
		Transition: Transition,
		logAbort: logAbort,
		TransitionAborted: TransitionAborted
	}
};

Object.keys(modules).forEach(function (key){
	define(key, [], function () {
		return modules[key];
	});
});

//this looks like an ugly hack but it works for now
import "/ember";

export default modules;