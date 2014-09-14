/* jshint esnext:true */
import { Ember } from "/js/module_loader_es6";

var App = Ember.Application.create({
	Resolver: Ember.DefaultResolver.extend({
		resolveTemplate: function(parsedName) {
			var template = this._super.apply(this, arguments);
			if (!template) {
				var result = Ember.$.ajax('/js/templates/'+parsedName.name +'.hbs', {async: false});
				if (result.status === 200 && result.responseText) {
					template = Ember.Handlebars.compile(result.responseText);
				}
			}
			return template;
		}
	}),
	LOG_TRANSITIONS: true
});