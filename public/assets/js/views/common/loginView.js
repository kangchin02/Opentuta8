define(['marionette','utils/facebook','googleplus'], function (Marionette) {
    view = Marionette.LayoutView.extend({
        regions: {
        },

        events:{
            'click #btn-login-user' : 'loginUser',
            'click #switch-signup' : 'showSignup',
            'click #switch-password' : 'showPassword',
            'click .btn-social-facebook' : 'showFBLogin',
            'click #google-login-button' : 'showGoogleLogin'
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

        showPassword: function(event){
            $('#login-modal').modal('hide');
            $('#password-modal').modal('show');
        },

        showFBLogin: function(event){
            var self = this;
            FB.getLoginStatus(function(response) {
                if (response.authResponse) {
                    self.loginFBUser(response.authResponse);
                }
                else {
                    FB.login(function(response) {
                        if (!response.authResponse) {
                            // user has not auth'd your app, or is not logged into Facebook
                            return;
                        }
                        else{
                            self.loginFBUser(response.authResponse);
                        }
                    }, {scope: 'email,user_birthday,user_education_history'});
                }
            });
        },

        loginFBUser: function(authResponse){
            var model = new Backbone.Model();
            model.set({response:authResponse,csrf_token:AppServer.session});
            model.url = "user/login/facebook";
            var promise = model.save();
            if (promise != null) {
                $("#login-progress").show();
                promise.done(function(resp){
                    $("#login-progress").hide();
                    $('#login-modal').modal('hide');
                    Backbone.trigger('showLoggedIn', resp);
                }).fail(function(resp){
                    $("#login-progress").hide();
                    $(".auth-alert").show();
                });
            }
            console.log("Facebook logged in");
        },

        showGoogleLogin: function(event){
            gapi.client.load('plus', 'v1',function(){});
            var options = {
                'approvalprompt' : 'force',
                'callback' : this.loginGoogle,
                'cookiepolicy' : 'single_host_origin',
                'clientid' : '409449806602-ptfo1q2r523g7942an0toso95i4lirck.apps.googleusercontent.com',
                'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
            };
            gapi.auth.signIn(options);
        },

        loginGoogle: function(authResult){
            if (authResult['status']['signed_in']) {
                var request = gapi.client.plus.people.get({'userId': 'me'});
                request.execute(function (resp)
                {
                    var model = new Backbone.Model();
                    var data ={
                        'access_token' : authResult.access_token,
                        'id' : resp.id,
                        'code' : authResult.code
                    };
                    model.set({response:data, csrf_token:AppServer.session});
                    model.url = "user/login/google";
                    var promise = model.save();
                    if (promise != null) {
                        $("#login-progress").show();
                        promise.done(function(resp){
                            $("#login-progress").hide();
                            $('#login-modal').modal('hide');
                            Backbone.trigger('showLoggedIn', resp);
                        }).fail(function(resp){
                            $("#login-progress").hide();
                            $(".auth-alert").show();
                        });
                    }
                    console.log('Google logged in: ');
                });
            } else {
                // Update the app to reflect a signed out user
                // Possible error values:
                //   "user_signed_out" - User is signed-out
                //   "access_denied" - User denied access to your app
                //   "immediate_failed" - Could not automatically log in the user
                console.log('Sign-in state: ' + authResult['error']);
            }
        }
    });

    return view;
});

