define([
    'views/common/loginView',
    'views/common/signupView',
    'views/common/headerView',
    'views/viewManager'
], function (LoginView, SignupView, HeaderView, ViewManager) {
    MainApplication.module("CommonModule", function(CommonModule, Application, Backbone, Marionette, $, _){

        Application.viewManager = new ViewManager();

        CommonModule.on("start", function(){
            var headerView = new HeaderView({el: $("#main-navbar")});
            var loginView = new LoginView({el: $("#login-modal")});
            var signupView = new SignupView({el: $("#signup-modal")});
        });
    });
});
