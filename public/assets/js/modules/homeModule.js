/**
 * Created by pchin on 2/26/15.
 */
MainApplication.module("HomeModule", function(HomeModule, MainApplication, Backbone, Marionette, $, _){
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
            MainApplication.execute("set:active:header", "contacts");
        },

        showContact: function(id){
            HomeModule.Show.Controller.showContact(id);
            MainApplication.execute("set:active:header", "contacts");
        },

        editContact: function(id){
            HomeModule.Edit.Controller.editContact(id);
            MainApplication.execute("set:active:header", "contacts");
        }
    };

    MainApplication.on("contacts:list", function(){
        MainApplication.navigate("contacts");
        API.listContacts();
    });

    MainApplication.on("contacts:filter", function(criterion){
        if(criterion){
            MainApplication.navigate("contacts/filter/criterion:" + criterion);
        }
        else{
            MainApplication.navigate("contacts");
        }
    });

    MainApplication.on("contact:show", function(id){
        MainApplication.navigate("contacts/" + id);
        API.showContact(id);
    });

    MainApplication.on("contact:edit", function(id){
        MainApplication.navigate("contacts/" + id + "/edit");
        API.editContact(id);
    });

    MainApplication.addInitializer(function(){
        new HomeModule.Router({
            controller: API
        });
    });
});
