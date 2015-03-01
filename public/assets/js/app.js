var MainApplication = new Marionette.Application();

MainApplication.addRegions({
    headerRegion: "#header-region",
    mainRegion: "#main-body",
    footerRegion: "#footer-region"
});

MainApplication.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

MainApplication.getCurrentRoute = function(){
  return Backbone.history.fragment
};

/*
MainApplication.StaticView = Marionette.ItemView.extend({
    tagName: 'div',
    id: 'HomeLayoutView',
    className: 'contentLayout',
    template: "#static-template"
});
*/

MainApplication.on("start", function(){
    var mod = AppServer.module == null ? "homeModule" : AppServer.module;
    var modMain = "modules/" + mod;
    var modCommon = "modules/commonModule";
    var self = this;

    /*
    var staticView = new MainApplication.StaticView();
    MainApplication.mainRegion.show(staticView);
    */

    //Start up main module
    require([modMain, modCommon], function (modMain, modCommon) {
      if(Backbone.history){
          Backbone.history.start();
      }
    });

    /*
    if(this.getCurrentRoute() === ""){
        MainApplication.trigger("contacts:list");
    }
    */
});
