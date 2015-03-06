define(['marionette'], function (Marionette) {
    signView = Marionette.LayoutView.extend({
        regions: {
        },

        events:{
            'click #btn-signup-user' : 'signupUser',
            'click #switch-login' : 'showLogin'
        },

        initialize : function(options){
            $(this.el).bind('show',function(){
                $(".auth-alert").hide();
                $("#email",this.el).val('');
                $("#password",this.el).val('');
            });
        },

        showLogin: function(event){
            $('#signup-modal').modal('hide');
            $('#login-modal').modal('show');
        },

        signupUser: function(event){
            var role = "student";
            var username= $("#username",this.el).val();
            var email= $("#email",this.el).val();
            var password = $("#password",this.el).val();

            var model = new Backbone.Model();
            model.set({username:username,email:email,password:password,role:role,csrf_token:AppServer.session});
            model.url = "user";
            var promise = model.save();
            if (promise != null) {
                //$$m.v.viewManager.showAlert("Deleting topic...");
                $("#signup-progress").show();
                promise.done(function(resp){
                    //$$m.v.viewManager.showAlert("Topic deleted Successfully!");
                    $("#signup-progress").hide();
                    $('#signup-modal').modal('hide');
                    //var data = jQuery.parseJSON(resp);
                    Backbone.trigger('showLoggedIn', resp);
                }).fail(function(resp){
                    $("#signup-progress").hide();
                    $(".auth-alert").show();
                });
            }
        },

        onRender: function(){
        }
    });

    return signView;
});

