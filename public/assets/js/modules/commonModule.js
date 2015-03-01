MainApplication.module("CommonModule", function(CommonModule, MainApplication, Backbone, Marionette, $, _){
    "use strict";

    CommonModule.HeaderView = Marionette.LayoutView.extend({
        regions: {
        },

        events: {
            'click #btn-login' : 'showLogin',
            'click #nav-info' : 'onNavInfoClicked'
        },

        onRender: function(){
        },

        showLogin: function(event){
            $('#login-modal').modal('show');
        },

        submitLogin: function(event){
            alert("dfsfdjlk");
        }
    });


    CommonModule.FooterView = Marionette.LayoutView.extend({
        regions: {
        },

        onRender: function(){
        }
    });


    CommonModule.LoginView = Marionette.LayoutView.extend({
        regions: {
        },

        events:{
            'click #btn-login-user' : 'loginUser',
            'click #switch-signup' : 'showSignup'
        },

        loginUser: function(event){
            console.log("login");
        },

        showSignup: function(event){
            $('#login-modal').modal('hide');
            $('#signup-modal').modal('show');
        },

        onRender: function(){
        }
    });


    CommonModule.SignupView = Marionette.LayoutView.extend({
        regions: {
        },

        events:{
            'click #btn-login-user' : 'signupUser',
            'click #switch-login' : 'showLogin'
        },

        showLogin: function(event){
            $('#signup-modal').modal('hide');
            $('#login-modal').modal('show');
        },

        onRender: function(){
        }
    });


    CommonModule.on("start", function(){
        var headerView = new CommonModule.HeaderView({el: $("#main-navbar")});
        var footerView = new CommonModule.HeaderView({el: $("#footer-region-content")});
        var loginView = new CommonModule.LoginView({el: $("#login-modal")});
        var signupView = new CommonModule.SignupView({el: $("#signup-modal")});
        /*
        MainApplication.headerRegion.attachView(headerView);
        MainApplication.footerRegion.attachView(footerView);
        MainApplication.loginRegion.attachView(loginView);
        MainApplication.signupRegion.attachView(signupView);
        */
     });
});