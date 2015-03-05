define(['marionette'], function (Marionette) {
    loginView = Marionette.LayoutView.extend({
        regions: {
        },

        events:{
            'click #btn-login-user' : 'loginUser',
            'click #switch-signup' : 'showSignup'
        },

        initialize : function(options){
            $(this.el).bind('show',function(){
                $(".auth-alert").hide();
                $("#email",this.el).val('');
                $("#password",this.el).val('');
            });
        },

        loginUser: function(event){
            var email= $("#email",this.el).val();
            var password = $("#password",this.el).val();

            if(email != null && email != "" && password != null && password != ""){
                var model = new Backbone.Model();
                //test20@gmail.com
                model.set({email:email,password:password,csrf_token:AppServer.session});
                model.url = "user/login";
                var promise = model.save();
                if (promise != null) {
                    $("#login-progress").show();
                    promise.done(function(resp){
                        $("#login-progress").hide();
                        $('#login-modal').modal('hide');
                        //var data = jQuery.parseJSON(resp);
                        Backbone.trigger('showLoggedIn', resp);
                    }).fail(function(resp){
                        $("#login-progress").hide();
                        $(".auth-alert").show();
                        //MainApplication.viewManager.showAlert("Login failed!")
                    });
                }
            }
            else{
                $(".auth-alert").show();
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

