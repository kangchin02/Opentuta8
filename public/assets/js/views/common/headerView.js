define(['marionette'], function (Marionette) {
    headerView = Marionette.LayoutView.extend({

        regions: {
        },

        events: {
            'click #btn-login' : 'showLogin'
        },

        initialize : function(options){
            Backbone.on('showLoggedIn', this.showLoggedIn, this);
        },

        onRender: function(){
        },

        showLogin: function(event){
            $('#login-modal').modal('show');
        },

        hideLoggedIn: function(event){
            $("#login-signup-container").show();
            $("#logged-in-container").hide();
        },

        showLoggedIn: function(data){
            $("#login-signup-container").hide();
            $("#logged-in-container").show();
        }
    });

    return headerView;
});
