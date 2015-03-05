//---------------------------------------------------------
//
//  MAPS MODEL METHODS TO HTTP METHODS
//
//---------------------------------------------------------

Backbone.methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
};


//---------------------------------------------------------
//
//  BACKBONE MODEL EXTEND
//
//---------------------------------------------------------

_.extend(Backbone.Model.prototype, {

    fetched : false,
    fetching : false,
    promise : null,

    fetchCustomUrl:function (url, nocache) {
        var origUrl = this.url;
        this.url = url;

        var promise;
        if (nocache === true){
            promise = this.fetch({nocache:true});
        }else{
            promise = this.fetch();
        }

        if (this.hasCache == true && nocache !== true){
            var self = this;
            promise.always(function(){
                self.url = origUrl;
            });
        }else{
            this.url = origUrl;
        }
        return promise;
    },

    saveWithCustomUrl:function (url) {
        var origUrl = this.url;
        this.url = url;
        var promise = this.save();
        this.url = origUrl;
        return promise;
    },

    destroyWithCustomUrl: function(url, options) {
        var origUrl = this.url;
        this.url = url;
        var promise = this.destroy(options);
        this.url = origUrl;
        return promise;
    },

    getPromise : function(){
        return this.promise;
    },

    isNew : function(){
        return this.id == "" || this.id == null || this.id <= 0 || this.id == "00000000-0000-0000-0000-000000000000";
    },

    urlUnique : function(){
        return new Date().getTime();
    },

    statics: function() {
        return this.constructor;
    }
});


//---------------------------------------------------------
//
//  BACKBONE COLLECTION EXTEND
//
//---------------------------------------------------------

_.extend(Backbone.Collection.prototype, {
    fetched : false,
    fetching : false,

    fetchCustomUrl:function (url, nocache, reset, add) {
        var origUrl = this.url;
        this.url = url;

        var promise;

        var options = {};
        if (reset == true) {
            options.reset = true;
        }
        if (nocache == true) {
            options.nocache = true;
        }
        if (add == true) {
            options.remove = false;
        }

        promise = this.fetch(options);

        if (this.hasCache == true && nocache !== true){
            var self = this;
            promise.always(function(){
                 self.url = origUrl;
            });
        }else{
            this.url = origUrl;
        }
        return promise;
    },

    getPromise : function(){
        return this.promise;
    },

    urlUnique : function(){
        return new Date().getTime();
    }
});


//---------------------------------------------------------
//
//  BACKBONE VIEW RENDER & CLOSE METHODS
//
//---------------------------------------------------------

_.extend(Backbone.View.prototype, {

    /**
     * @close
     *
     * Extends all Backbone Views to implement a close function.  As well,
     * ever instance of a view may implement an additional onClose method, to be
     * overridden and include tasks such as unbinding from model objects.
     *
     * Only called when view is removed by ViewManager.
     *
     * NOTE: Do not override this method, override onPreClose and onClose methods, instead
     *
     */
    close : function(){
        this.onPreClose();

        this.closeSubviews();

        this.remove();
        this.unbind();
        this.onClose();
        this.trigger("close");
    },

    /**
     * @onPreClose
     *
     * Called before removal, by close method
     */
    onPreClose : function(){

    },

    /**
     * @onClose
     *
     * Called on close, by close method.
     */
    onClose : function(){

    },

    /**
     * @postRender
     *
     * Adds a hookin that can be called every time a view is rendered; literally after
     * the call to render().
     *
     * Note that it is not guaranteed that postRender() will be called after the view
     * has been loaded into the DOM. For example, if calls to fetch data from the server
     * are made from within render() and the rendering of said data  must be  deferred
     * until the completion of that fetch, postRender() may fire before that data is
     * finished rendering.
     *
     * Only called when View is rendered by ViewManager
     */
    postRender : function(){

        this.postRenderMobile();

        // Because of the above, FOUC occurs on page load (espeically mobile
        // page load, but also on the sticky footer in desktop/tablet unless
        // the main elements are hidden (done in site_mobile.less) and
        // then revealed after JQM does it's magic.
        //
        if (viewutils.isMobileLayout()) {
            $('.hide-during-page-load')
                .fadeIn("slow", function() {
                    $(this).css("display", "");
                })
                .removeClass("hide-during-page-load");
        } else {
            $('.hide-during-page-load').removeClass('hide-during-page-load');
        }

    },

    postRenderMobile : function(){

        // View content is dynamically generated, so we must inform JQM
        // that new content has been created so that it can apply it's styling
        //
        if (viewutils.isMobileLayout()) {
            this.$el.trigger("create");
        }
    },

    /**
     * @hasUnsaved
     *
     * Adds a hook-in to all views to respond if they have unsaved data or not
     */
    hasUnsaved : function(){
        return false;
    },

    /**
     * @discardChanged
     *
     * Adds a hook-in to alert a view to clear its current changes
     * before navigating away to a new page.
     */
    discardChanges : function(){

    },


    addSubView: function(view) {
        if (this.subviews == null) {
            this.subviews = [];
        }

        this.subviews.push(view);

        return view;
    },


    removeSubView: function(view) {
        if (this.subviews == null) {
            return;
        }

        var i = this.subviews.indexOf(view);

        try {
            view.close();
        }catch(exception) {

        }

        if (i > -1) {
            this.subviews.splice(i, 1);
        }
    },


    closeSubviews: function() {
        if (this.subviews != null) {
            for(var i = 0; i < this.subviews.length; i++) {
                this.subviews[i].close();
            }
            this.subviews = null;
        }
    },


    show: function(html) {
        $(this.el).html(html);
    },


    /**
     * Fetches a Backbone Collection or Model only once. Basically a wrapper for fetch() that is
     * useful for situations where different functions within the same view require the same data,
     * but when can't be predicted in advance which of these will execute first--or at all--such as
     * is sometimes the case with render() and postRender().
     *
     * For example, sometimes a postRender() method that performs a fetch is sometimes mixed in to
     * several views, some of whose render() * methods perform the same fetch, and some of whose don't.
     *
     * These utility functions thus replace multiple instances within a fully-mixed view of the following pattern:
     *
     * if (obj == null)
     *      obj.fetch()
     *
     * For convenience, this function is jank-curried by fetchModelOnce() and fetchCollectionOnce(), below.
     *
     * @param {Object} obj - The object (model or collection) to be fetched
     * @param {Function} fetchFunc - A function that handles the fetching
     * @param {Function} returnDataFunc - A function that transforms the returned data into JSON.
     * @returns {jQuery Promise}
     */
    fetchOnce: function (obj, fetchFunc, returnDataFunc) {

        if (obj == null) {
            return $.proxy(fetchFunc, this)();
        }
        else {
            var deferred = $.Deferred();
            deferred.promise();
            deferred.resolve(returnDataFunc());

            return deferred;
        }
    },


    /**
     * Fetches a Backbone Model only once.
     *
     * @param {Object} obj - The object (model or collection) to be fetched
     * @param {Function} fetchFunc - A function that handles the fetching
     * @returns {jQuery Promise}
     */
    fetchModelOnce: function (obj, fetchFunc) {

        return this.fetchOnce(obj, fetchFunc, function() { return obj.attributes} );
    },


    /**
     * Fetches a Backbone Collection only once.
     *
     * @param {Object} obj - The object (model or collection) to be fetched
     * @param {Function} fetchFunc - A function that handles the fetching
     * @returns {jQuery Promise}
     */
    fetchCollectionOnce: function (obj, fetchFunc) {

        return this.fetchOnce(obj, fetchFunc, function() { return obj.toJSON()} );
    },


    /**
     * Return the constructor, which loosely resembles the static values on the view
     */
    statics : function() {
        return this.constructor;
    }
});



//---------------------------------------------------------
//
//  PASS IN METHOD TO URL FUNCTIONS
//
//---------------------------------------------------------

/**
 * Override backbone.sync so we can pass in the 
 * HTTP Method to the getURL function, as this affects
 * our REST service call.  
 * 
 * For instance, the default implementation makes a PUT call
 * similar to /classType/:id
 * 
 * We don't want that, we may just want to PUT to /classType, and 
 * its inferred that we pull the Id of the object out of the content, 
 * instead of passing it through the URL.
 */
Backbone.sync = function(method, model, options) {
    var type = Backbone.methodMap[method];

    
    //See if we can retrieve from Cache, first
    if (type == "GET"){
        if (model.hasCache && options.nocache != true){
            var resp = model.getFromCache();
            if (resp != null){
                model.preventCacheClear();
                options.success(resp, "success", null);
                model.resumeCacheClear();
                return model.getPromise();
            }else if(model.isInProgress()){
                var tmpPromise = new $.Deferred();
                var promise = model.getPromise()
                    .done(function(resp){
                        model.preventCacheClear();
                        options.success(resp, "success", null);
                        model.resumeCacheClear();
                        tmpPromise.resolve();
                    })
                    .fail(function(resp, error, message){
                        tmpPromise.rejectWith(promise, arguments);
                    });
                return tmpPromise;
            }
        }
    }
    
    //Trap success to cache on way back in:
    if (type == "GET"){
        var success = options.success;
        if (model.hasCache && options.nocache != true){
            model.setInProgress();
        }
        options.success = function(resp, status, xhr){
            if (model.hasCache && options.nocache != true){
                model.setToCache(resp);
                model.preventCacheClear();
            }

            if (success){
                success(resp, status, xhr);
            }

            if (model.hasCache && options.nocache != true){
                model.resumeCacheClear();
            }
        }
    }


    //Added Fetching Property
    model.fetching = true;
    var _success = options.success;
    var _error = options.error;

    options.success = function(){
        model.fetching = false;
        model.fetched = true;
        if (_success) _success.apply(null, arguments);
    }

    options.error = function(){
        model.fetching = false;
        if (_error) _error.apply(null, arguments);
    }
    //end Added Fetching Property
    
    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json'
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
      params.url = Backbone.getUrlForSync(model, type) || Backbone.urlError();
    }
    
    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request. //Return the promise;
    model.promise = $.ajax(params);
    if (model.hasCache && options.nocache != true){
        model.setPromiseToCache(model.promise);
    }
    return model.promise;
    //return $.ajax(params);
};


//---------------------------------------------------------
//  GET URL FOR SYNC METHODS
//---------------------------------------------------------

/**
 * New method to accept the HTTP method 
 * and get the URL from a parameter, or a function where
 * we pass in the method type
 */
Backbone.getUrlForSync = function(object, method) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url(method) : object.url;
};


//---------------------------------------------------------
//
//  ALLOW FOR MULTIPLE ROUTERS ON A PAGE
//
//---------------------------------------------------------

/**
 * Override the route() method of default router
 * to pass in the routerName, this allows us to maintain
 * default routing logic for any single router, but to
 * include multiple routers on a page.
 */
_.extend(Backbone.Router.prototype, {
    /*
    route : function(route, name, callback) {
        Backbone.history || (Backbone.history = new Backbone.History);
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        Backbone.history.route(route, _.bind(function(fragment) {
            var args = this._extractParameters(route, fragment);
            callback.apply(this, args);
            this.trigger.apply(this, ['route:' + name].concat(args));
        }, this), this.name);
    },

    //OLD
    route: function(route, name, callback) {
        Backbone.history || (Backbone.history = new History);
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (!callback) callback = this[name];
        Backbone.history.route(route, _.bind(function(fragment) {
            var args = this._extractParameters(route, fragment);
            callback && callback.apply(this, args);
            this.trigger.apply(this, ['route:' + name].concat(args));
            Backbone.history.trigger('route', this, name, args);
        }, this));
        return this;
    },

    //NEW
    route: function(route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];
        var router = this;
        Backbone.history.route(route, function(fragment) {
            var args = router._extractParameters(route, fragment);
            callback && callback.apply(router, args);
            router.trigger.apply(router, ['route:' + name].concat(args));
            router.trigger('route', name, args);
            Backbone.history.trigger('route', router, name, args);
        });
        return this;
    },
*/
});



/**
 * Override Backbone History functions.
 *
 * We override loadURL() to test to be sure we have not already called a
 * matching route handler for this specific router, based on the routerName
 * stored on the handler object
 *
 * We override route() to accept the routerName and attach it to the hander.
 */
/*
_.extend(Backbone.History.prototype, {
    loadUrl : function() {
        var fragment = this.fragment = this.getFragment();
        var matched = false;
        var invoked = [];
        _.each(this.handlers, function(handler) {
            if (handler.route.test(fragment)) {
                if (!handler.routerName || handler.routerName == "" || _.indexOf(invoked, handler.routerName) == -1){
                    invoked.push(handler.routerName);
                    handler.callback(fragment);
                    matched = true;
                }
            }
        });
        return matched;
    },


    loadUrlForRouter : function(routerName) {
        var fragment = this.fragment = this.getFragment();
        var matched = false;
        var invoked = [];
        _.each(this.handlers, function(handler) {
            if (handler.route.test(fragment)) {
                if (handler.routerName == routerName){
                    invoked.push(handler.routerName);
                    handler.callback(fragment);
                    matched = true;
                }
            }
        });
        return matched;
    },


    route : function(route, callback, routerName) {
        this.handlers.unshift({route : route, callback : callback, routerName : routerName});
    }

});
*/

var o_checkUrl = Backbone.History.prototype.checkUrl;
var checkUrl = function(e) {
    if (this.hashChangeCallback != null) {
        var result = this.hashChangeCallback();
        if (result === false) {
            return false;
        }
    }
    this.vent.trigger("onHashChange");
    o_checkUrl.apply(this, arguments);
};

Backbone.history.checkUrl = $.proxy(checkUrl, Backbone.history);


_.extend(Backbone.History.prototype, {

    hashChangeCallback: null,

    vent :_.clone(Backbone.Events),

    setHashChangeCallback: function(cb) {
        this.hashChangeCallback = cb;
    }
});


//---------------------------------------------------------
//
//  BACKBONE MIXINS
//
//---------------------------------------------------------
Backbone.utils = Backbone.utils || {};


 // Helper method to extend an already existing method
Backbone.utils.extendMethod = function(to, from, methodName) {
// if the method is defined on from ...
    if (to == null || from == null) {
        return;
    }
    if (!_.isUndefined(from[methodName])) {
        var old = to[methodName];

        // ... we create a new function on to
        to[methodName] = function() {
            // wherein we first call the method which exists on `to`
            var oldReturn = old.apply(this, arguments);

            // and then call the method on `from`
            from[methodName].apply(this, arguments);

            // and then return the expected result, // i.e. what the method on `to` returns
            return oldReturn;
        };
    }
};


Backbone.utils.extendMethods = function(to, from, methods){
    if (methods && methods.length > 0) {
        for(var i = 0; i < methods.length; i++){
            Backbone.utils.extendMethod(to, from, methods[i]);
        }
    }
};


Backbone.Collection.mixin = Backbone.Model.mixin = function(from) {
    var to = this.prototype;
    _.defaults(to, from);
    Backbone.utils.extendMethods(to, from, ["initialize"]);

    var methodOverrides = ["getPromise","urlUnique"];

    for(var i = 0; i < methodOverrides.length; i++){
        var method = methodOverrides[i];
        if (!_.isUndefined(from[method])){
            to[method] = from[method];
        }
    }
};


Backbone.View.mixin = function(from) {
    var to = this.prototype;

    // we add those methods which exists on `from` but not on `to` to the latter
    _.defaults(to, from);

    try {
        if (to.events != null && from.events != null) {
            // … and we do the same for events
            _.defaults(to.events, from.events);
        }
    }catch(exception){}



    // we then extend `to`'s `initialize`
    var viewMethods = ["initialize", "render", "postRender", "close", "onClose", "hasUnsaved", "discardChanges"];

    Backbone.utils.extendMethods(to, from, viewMethods);
};


Backbone.Router.mixin = function(from) {
    var to = this.prototype;

    // we add those methods which exists on `from` but not on `to` to the latter
    _.defaults(to, from);

    // … and we do the same for routes
    _.defaults(to.routes, from.routes);

    // we then extend `to`'s `initialize`
    var methods = ["initialize", "navigate"];

    Backbone.utils.extendMethods(to, from, methods);
};

//---------------------------------------------------------
//
//  VIEW MANAGER
//
//---------------------------------------------------------

// The self-propagating extend function that Backbone classes use.
var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
};


/**
 * Create a ViewManager class that can be extended. This has some shortcuts
 * for properly handling adding and removing of views, to ensure all bindings
 * are removed.  
 */ 
Backbone.ViewManager = function()
{
    
};

_.extend(Backbone.ViewManager.prototype, Backbone.Events, {

    views : {},

    oldViews : {},


    /**
     * @public
     * 
     * Pass in a non-rendered Backbone View, along with the selector
     * of the element it should be inserted into.  This method will remove
     * any old view already sitting in the selected element, calling the #close()
     * method on it.  It will then call the #render() method on the new view, 
     * add the el property of the new view to the selected element, and finally, 
     * call the #afterRender() method on the view, if it exists.
     */
    show : function(view, selector)
    {
        this._show(view, selector)
    },


    /**
     * @public
     *
     * @param selector
     * @return {*}
     */
    showHtml : function(html, selector, context)
    {
        var oldView = this._getView(selector);
        if(oldView != null){
            oldView.close();
        }

        var container = null;
        if (context != null)
        {
            container = $(selector, context)[0];
        }else{
            container = $(selector)[0];
        }

        if (container == null){
            return false;
        }

        var $container = (context != null)
            ? $(container, context)
            : $(container)
        ;

        $container.html(html);

        if (viewutils.isMobileLayout()) {
            $container.trigger("create");
        }

        return true;
    },


    /**
     * @public
     *
     * Closes the view with necessary selector
     */
    close : function(selector)
    {
        this._clearView(selector);
    },

    
    /**
     * @public
     * 
     * Retrieves the current view sitting in a given container
     */
    get : function(selector)
    {
        return this._getView(selector);
    },

    
    /**
     * @protected
     */
    _show : function(view, selector, beforeAddToDOM, closeOldFunction)
    {
        var oldView = this._getView(selector);
        if (oldView != null && closeOldFunction != null){
            closeOldFunction(this);
        }else if(oldView != null){
            oldView.close();
        }


        var container = $(selector)[0];
        if (container == null){
            return false;
        }

        this.views[selector] = view;

        if (view != null){
            view.render();
        }

        if (beforeAddToDOM != null){
            beforeAddToDOM();
        }

        if (view != null){
            $(container).html(view.el);
            view.postRender();
        }else{
            $(container).html("");
        }
        return true;
    },


    /**
     * @protected
     */
    _showAfter : function(viewToShow, afterView, customSelector, beforeAddToDOM, closeOldFunction)
    {
        var oldView = this._getView(customSelector);
        if (oldView != null && closeOldFunction != null){
            closeOldFunction(this);
        }else if(oldView != null){
            oldView.close();
        }

        this.views[customSelector] = viewToShow;
        this.views[customSelector].render();

        if (beforeAddToDOM != null){
            beforeAddToDOM();
        }
        $(afterView).after(this.views[customSelector].el);

        this.views[customSelector].postRender();
    },


    _getView : function(selector)
    {
        return this.views[selector];
    },


    _clearView : function(selector)
    {
        if (this.views[selector] != null){
            this.views[selector].close();
        }

        $(selector).html("");
    }

});

Backbone.ViewManager.extend = extend;


//---------------------------------------------------------
//
//  GLOBAL EVENT AGGREGATOR - Not good, but sometimes
//  useful
//
//---------------------------------------------------------

Backbone.vent = _.clone(Backbone.Events);


//---------------------------------------------------------
//
//  REQUIRED UTILITY METHODS FOR CREATING EXTENDABLE 
//  CLASSES
//
//---------------------------------------------------------


// Shared empty constructor function to aid in prototype-chain creation.
var ctor = function(){};
var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function(){parent.apply(this, arguments);};
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
};
