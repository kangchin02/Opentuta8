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
            var model = new Backbone.Model();
            model.set({email:"test20@gmail.com",password:"password2",csrf_token:AppServer.session});
            model.url = "user/login";
            var promise = model.save();
            if (promise != null) {
                //$$m.v.viewManager.showAlert("Deleting topic...");
                promise.done(function(resp){
                    //$$m.v.viewManager.showAlert("Topic deleted Successfully!");
                    console.log("success");
                }).fail(function(resp){
                    console.log("failed");
                });
            }
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
            'click #btn-signup-user' : 'signupUser',
            'click #switch-login' : 'showLogin'
        },

        showLogin: function(event){
            $('#signup-modal').modal('hide');
            $('#login-modal').modal('show');
        },

        signupUser: function(event){
            var model = new Backbone.Model();
            model.set({username:"test20",email:"test20@gmail.com",password:"password",password_confirmation:"password",csrf_token:AppServer.session});
            model.url = "user";
            var promise = model.save();
            if (promise != null) {
                //$$m.v.viewManager.showAlert("Deleting topic...");
                promise.done(function(resp){
                    //$$m.v.viewManager.showAlert("Topic deleted Successfully!");
                    console.log("success");
                }).fail(function(resp){
                    console.log("failed");
                });
            }
        },

        onRender: function(){
        }
    });


    CommonModule.on("start", function(){
        var headerView = new CommonModule.HeaderView({el: $("#main-navbar")});
        var footerView = new CommonModule.HeaderView({el: $("#footer-region-content")});
        var loginView = new CommonModule.LoginView({el: $("#login-modal")});
        var signupView = new CommonModule.SignupView({el: $("#signup-modal")});
     });
});