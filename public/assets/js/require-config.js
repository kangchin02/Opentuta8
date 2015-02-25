require.config({
    paths: {
        'jquery'            :  "libs/jquery/jquery.min",
        'underscore'        : 'libs/lodash/lodash.min',
        'backbone'          : 'libs/backbone/backbone.min',
        'backboneAssoc'     : 'libs/backbone/backbone-associations.min',
        'backboneExtended'  : 'libs/backbone/backboneExtended',
        'bootstrap'         : 'libs/bootstrap/bootstrap.min',
        'jquerymobile'      : 'libs/jquerymobile/jquery.mobile.min',
        'modernizr'         : 'libs/modernizr/modernizr.min',

        'jqueryui'          : 'libs/jquery/jquery-ui.min',
        'fancytree'         : 'libs/fancytree/jquery.fancytree',
        'fancytreedd'       : "libs/fancytree/jquery.fancytree.dnd",
        'fancytreemenu'     : "libs/fancytree/jquery.fancytree.menu",
        'fabric'            : 'libs/fabric/fabric',

        'handlebars'        : 'libs/handlebars/handlebars',
        'json2'             : 'libs/json2',
        'ckeditor'          : 'libs/ckeditor/ckeditor',
        'aloha'             : 'libs/alohaeditor/lib/aloha',
        'd3'                : 'libs/d3/d3.min',
        'dimple'            : 'libs/d3/dimple.min',
        'backgrid'          : 'libs/backgrid/backgrid.min',
        'backgrid-filter'   : 'libs/backgrid/extensions/filter/backgrid-filter.min',
        'backgrid-select-filter'    : 'libs/backgrid/extensions/backgrid-select-filter/backgrid-select-filter',
        'backgrid-paginator'        : 'libs/backgrid/extensions/paginator/backgrid-paginator.min',
        'backbone.paginator'        : 'libs/backgrid/extensions/paginator/backbone.paginator.min',
        'backgridutils'        : 'utils/backgridutils',
        'bootstrap-multiselect'     : 'libs/bootstrap/bootstrap-multiselect/bootstrap-multiselect',
        'sidr'              : 'libs/sidr/jquery.sidr.min',
        'waituntilexists'   : 'libs/jquery/plugins/jquery.waituntilexists',
        'jqueryutil'        : 'utils/jqueryutil',
        'utilsjs'           : 'utils/utils',
        'securitymanager'   : 'security/SecurityManager',
        'templates'         : '../templates',
        'styles'            : '../css',
        'libs'              : 'libs',
        'app'               : 'app',
        'data'              : 'data/Data',
        'setup'             : 'setup',
        'requireLib'        : 'libs/require/require',
        'dateformat'        : 'libs/date.format',
        'handlebarshelpers' : 'utils/HandlebarsHelpers',
        'headerview'        : 'views/HeaderView'
    },

    map:  {
        '*': {
            'css': 'libs/require/plugins/css',
            'text': 'libs/require/plugins/text',
            'normalize': 'libs/require/plugins/normalize',
            'is': 'libs/require/plugins/is'
        }
    },

    shim: {

        underscore: {
            exports: "_"
        },

        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },

        backboneExtended: {
            deps: ["backbone"]
        },

        backboneAssoc: {
            deps: ["backbone"]
        },

        jquerymobile: {
            deps: ["jquery"]
        },

        bootstrap: {
            deps: ["jquery"]
        },

        backgrid: {
            deps: ["css!libs/backgrid/backgrid.css"],
            exports: "Backgrid"
        },


        "backgrid-filter": {
            deps: ["backgrid", "css!libs/backgrid/extensions/filter/backgrid-filter.min.css"]
        },

        "backgrid-select-filter": {
            deps: ["backgrid"]
        },

        "backgrid-paginator": {
            deps: ["backgrid", "css!libs/backgrid/extensions/paginator/backgrid-paginator.min.css"]
        },

        backgridutils: {
            deps: ["backgrid"]
        },

        "bootstrap-multiselect": {
            deps: ["bootstrap", "css!libs/bootstrap/bootstrap-multiselect/bootstrap-multiselect.css"]
        },

        dimple: {
            deps: ["d3"]
        },

        jqueryutil: {
            deps: ["jquery"]
        },

        sidr: {
            deps: ["jquery"]
        },

        securitymanager: {
            deps: ["backbone"]
        },

        data: {
            deps: ["backboneExtended", "setup"]
        },

        jqueryui: {
            deps: ['jquery']
        },

        fancytree: {
            deps: ["jqueryui"]
        },


        fancytreedd: {
            deps: ["fancytree"]
        },


        fancytreemenu: {
            deps: ["fancytree"]
        },


        setup: {
            deps: ["bootstrap"]
        },

        app: {
            deps: [
                "setup",
                "data",
                "handlebars",
                "json2",
                "jquery",
                "underscore",
                "backbone",
                "backboneExtended",
                "bootstrap",
                "jqueryutil",
                "securitymanager",
                "modernizr"
            ]
        }
    },

    waitSeconds: 15,
    enforceDefine: false
});

