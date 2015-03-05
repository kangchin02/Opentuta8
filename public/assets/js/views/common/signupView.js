define(['marionette'], function (Marionette) {
    signView = Marionette.LayoutView.extend({
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

    return signView;
});

