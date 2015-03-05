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

MainApplication.on("start", function(){
    var mod = AppServer.module == null ? "homeModule" : AppServer.module;
    var modMain = "modules/" + mod;
    var modCommon = "modules/commonModule";

    //Start up main module
    require([modCommon, modMain], function (modCommon, modMain) {
      if(Backbone.history){
          Backbone.history.start();
      }
    });
});
