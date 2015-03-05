define(['marionette'], function (Marionette) {
    loginView = Marionette.LayoutView.extend({
        regions: {
        },

        events:{
            'click #btn-login-user' : 'loginUser',
            'click #switch-signup' : 'showSignup'
        },

        loginUser: function(event){
            var model = new Backbone.Model();
            model.set({email:"test20@gmail.com",password:"password",csrf_token:AppServer.session});
            model.url = "user/login";
            var promise = model.save();
            if (promise != null) {
                promise.done(function(resp){
                    $('#login-modal').modal('hide');
                    //var data = jQuery.parseJSON(resp);
                    Backbone.trigger('showLoggedIn', resp);
                }).fail(function(resp){
                    $('#login-modal').modal('hide');
                    Backbone.trigger('showLoggedIn');
                    //MainApplication.viewManager.showAlert("Login failed!")
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

    return loginView;
});

