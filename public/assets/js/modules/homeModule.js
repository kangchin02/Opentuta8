/**
 * Created by pchin on 2/26/15.
 */
MainApplication.module("HomeModule", function(HomeModule, Application, Backbone, Marionette, $, _){
    HomeModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "contacts(/filter/criterion::criterion)": "listContacts",
            "contacts/:id": "showContact",
            "contacts/:id/edit": "editContact"
        }
    });

    var API = {
        listContacts: function(criterion){
            HomeModule.List.Controller.listContacts(criterion);
            Application.execute("set:active:header", "contacts");
        },

        showContact: function(id){
            HomeModule.Show.Controller.showContact(id);
            Application.execute("set:active:header", "contacts");
        },

        editContact: function(id){
            HomeModule.Edit.Controller.editContact(id);
            Application.execute("set:active:header", "contacts");
        }
    };

    Application.addInitializer(function(){
        new HomeModule.Router({
            controller: API
        });
    });
});
