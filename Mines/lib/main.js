require.config({
	deps : ["main"],
	baseUrl : "lib",
	paths : {
		
	},
	shim : {
		"backbone" : {
			"deps" : ["underscore", "jquery"],
			"exports" : "Backbone"
		},
		"Bacon" : {
			"deps" : ["jquery"],
			"exports" : "Bacon"
		}
	}
});

require(["jsx!code/app", "react"], function(App, React) {
	
});

