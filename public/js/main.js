require.config({
	hbs: {
		templateExtension: 'html',
		disableI18n: true,
		disableHelpers: true
	},

	shim: {
		'jQuery': {
			exports: '$'
		},

		'Underscore': {
			exports: '_'
		},

		'Backbone': {
			deps: ['Underscore', 'jQuery'],
			exports: 'Backbone'
		},

		'Handlebars': {
			deps: ['handlebars'],
			exports: 'Handlebars'
		}
	},

	paths: {
		jQuery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
		Underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
		underscore: './lib/underscore',
		Backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
		handlebars: './lib/Handlebars',
		hbs: './lib/hbs',
		i18nprecompile: './lib/i18nprecompile',
		json2: './lib/json2',
		bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.2/js/bootstrap.min',
		bootstrapSwitch: './lib/bootstrap-switch.min'
	}
});