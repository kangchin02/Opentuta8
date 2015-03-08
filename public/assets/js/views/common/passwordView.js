define(['marionette'], function (Marionette) {
    view = Marionette.LayoutView.extend({
        regions: {
        },

        events:{
            'click #btn-reset' : 'resetPassword',
            'click #switch-login' : 'showLogin'
        },

        initialize : function(options){
            $(this.el).bind('show',function(){
                $(".auth-alert").hide();
                $("#email",this.el).val('');
            });
        },

        resetPassword: function(event){
            var email= $("#email",this.el).val();

            if(email != null && email != ""){
                var model = new Backbone.Model();
                model.set({email:email,csrf_token:AppServer.session});
                model.url = "user/forgot-password";
                var promise = model.save();
                if (promise != null) {
                    promise.done(function(resp){
                        $('#password-modal').modal('hide');
                    }).fail(function(resp){
                        $(".auth-alert").show();
                    });
                }
            }
            else{
                $(".auth-alert").show();
            }
        },

        showLogin: function(event){
            $('#login-modal').modal('show');
            $('#password-modal').modal('hide');
        },

        onRender: function(){
        }
    });

    return view;
});

