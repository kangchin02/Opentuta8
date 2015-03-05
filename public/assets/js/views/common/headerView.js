define(['marionette'], function (Marionette) {
    headerView = Marionette.LayoutView.extend({

        regions: {
        },

        events: {
            'click #btn-login' : 'showLogin',
            'click #btn-logout' : 'showLogout'
        },

        initialize : function(options){
            Backbone.on('showLoggedIn', this.showLoggedIn, this);
        },

        onRender: function(){
        },

        showLogin: function(event){
            $('#login-modal').modal('show');
        },

        showLogout: function(event){
            var self = this;
            var promise = $.get("user/logout");
            $.when(promise).done(function () {
                self.showLoggedOut();
            }).fail(function () {
                //
            }).always(function () {
                //
            });
        },

        showLoggedOut: function(event){
            $("#login-signup-container").show();
            $("#logged-in-container").hide();
        },

        showLoggedIn: function(data){
            $("#login-signup-container").hide();
            $("#logged-in-container").show();

            $("#btn-header-user").attr("title", data.username);
        }
    });

    return headerView;
});
