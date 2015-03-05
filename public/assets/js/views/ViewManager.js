define(function () {

    var ViewManager = Backbone.ViewManager.extend({

        replaceMain : function(view) {
            this.hideAlert(null, true);
            this.show(view, "#viewport-main");
        },

        replaceMainHtml : function(html){
            this.showHtml(html, "#viewport-main");
        },

        hideMain : function(){
            $("#viewport-main").hide();
        },

        showMain : function(){
            $("#viewport-main").show();
        },

        hasUnsavedInMain : function() {
            var view = this.views["#viewport-main"];
            if (view != null)
            {
                try{
                    return view.hasUnsaved();
                }catch(Exception){
                    return false;
                }
            }

            return false;
        },

        progressEventsSet: false,
        progressState: null,
        progressQueue: [],
        progressStateTimerId: null,

        queueShowProgress: function(title, label) {
            this.progressQueue.push({title:title, label:label});
        },

        showFromQueue: function() {
            if (this.progressQueue.length > 0) {
                var obj = this.progressQueue.shift();

                this.showProgress(obj.title, obj.label);
            }
        },


        showProgress : function(title, label){
            if (!this.progressEventsSet) {
                this._setUpProgressEventHandlers();
                this.progressEventsSet = true;
            }

            if (this.progressState == "showing") {
                this.queueShowProgress(title, label);
                return;
            } else if(this.progressState == "hiding") {
                this.queueShowProgress(title, label);
                return;
            }

            //remove existing modal if we're trying to show it again.
            if (this.progressState == "shown") {
                this._removeExistingProgress();
            }

            this._showProgress(title, label);
        },


        _getProgressContainer : function(){
            return $("#common-progress");
        },


        _setUpProgressEventHandlers : function(){
            var $progressContainer = this._getProgressContainer();

            $progressContainer.on("show", _.bind(this._handleShowEvent, this));
            $progressContainer.on("shown", _.bind(this._handleShownEvent, this));
            $progressContainer.on("hide", _.bind(this._handleHideEvent, this));
            $progressContainer.on("hidden", _.bind(this._handleHiddenEvent, this));
        },


        _handleShowEvent : function(){
            this.progressState = "showing";

            var self = this;
            this._startProgressTimer(function() {
                 self._handleShownEvent();
            });
        },


        _handleShownEvent : function(){
            this._stopProgressTimer();
            this.progressState = "shown";
            this.showFromQueue();
        },


        _handleHideEvent : function(){
            this.progressState = "hiding";

            var self = this;
            this._startProgressTimer(function() {
                self._handleHiddenEvent();
            });
        },


        _handleHiddenEvent : function(){
            this._stopProgressTimer();
            this.progressState = null;
            this.showFromQueue();
        },


        _stopProgressTimer: function() {
            if (this.progressStateTimerId != null) {
                window.clearTimeout(this.progressStateTimerId);
            }
        },


        _startProgressTimer: function(fn) {
            if (this.progressStateTimerId != null) {
                window.clearTimeout(this.progressStateTimerId);
            }

            this.progressStateTimerId = window.setTimeout(fn, 500);
        },


        _showProgress : function(title, label){
            var $commonProgress = $("#common-progress");

            $commonProgress.modal({
                show : true, keyboard:false, backdrop:"static"
            });

            if (label == null){
                label = ""
            }

            if (title == null){
                title = "Processing...";
            }

            $("#common-progress-title", $commonProgress).html(title);
            $("#common-progress-label", $commonProgress).html(label);
        },


        _removeExistingProgress : function(){
            var $commonProgress = $("#common-progress");

            $commonProgress.removeClass('fade');
            $commonProgress.modal('hide');
            $commonProgress.addClass('fade');
        },


        hideProgress : function(){
            if (this.progressState == "hiding") {
                this.progressQueue.pop();
                return;
            } else if(this.progressState == "showing") {
                //we want to hide it immediately
                this._removeExistingProgress();
                this.progressQueue.pop();
                return;
            }

            if (this.progressState == "shown") {
                this.progressQueue = [];
                this._hideProgress();
            }
        },


        _hideProgress : function(){
            $(".modal-backdrop").remove();
            $("#common-progress").modal('hide');
        },


        showModal : function(html) {
            $("#common-modal").html(html).modal();
        },


        hideModal : function() {
            $("#common-modal").html(html).modal('hide');
        },


        showModalConfirm: function(title, label, okCb, okParam, cancelCb, okLabel, cancelLabel) {
            var self = this;
            var data = {
                title: title,
                label: label,
                okLabel: okLabel || "Ok",
                cancelLabel: cancelLabel || null
            };

            require(['text!templates/Alert.html'], function(template){
                cmutils.templateManager.setUpTemplatesInFile(template, "Alert");
                var templ = cmutils.templateManager.getNow("modal-confirm", "Alert");
                var html = templ(data);
                self.showModal(html);

                $("#common-modal #btn-ok,#btn-cancel").on("click", function(event){
                    $("#common-modal #btn-ok,#btn-cancel").off();
                    if ($(event.currentTarget).data("value") == "ok" && okCb != null) {
                        okCb(okParam);
                    } else if ($(event.currentTarget).data("value") == "cancel" && cancelCb != null) {
                        cancelCb();
                    }
                    self.hideModal();
                });
            });
        },

        alertTimerId : null,

        showAlert : function(content, heading, alertType, selector, duration) {
            var self = this;
            require(['text!templates/Alert.html'], function(template){
                cmutils.templateManager.setUpTemplatesInFile(template, "Alert");
                var data = {};
                data.content = content;
                if (stringutils.isNullOrempty(heading) == false){
                    data.heading = heading;
                }
                if (stringutils.isNullOrempty(alertType) == true) {
                    alertType = "alert-success";
                }

                data.alertType = alertType;

                var templ = cmutils.templateManager.getNow("alert", "Alert");
                var html = templ(data);

                if (selector == null || selector == ""){
                    selector = "#container-alert";
                }
                $(selector).html(html);
                $(selector).show();

                if (alertType == "alert-success" || duration != null){
                    if (duration != null) {
                        duration = duration * 1000;
                    } else {
                        duration = 5000;
                    }

                    if (self.alertTimerId != null){
                        clearTimeout(this.alertTimerId);
                    }

                    console.log("SETTING TIMER FOR: " + duration)
                    self.alertTimerId = setTimeout(function(){
                        $(selector).fadeOut();
                    }, duration);
                }
            });
        },


        showProgressAlert : function(heading, alertType, selector) {
            require(['text!templates/Alert.html'], function(template){
                cmutils.templateManager.setUpTemplatesInFile(template, "Alert");
                var data = {};
                if (stringutils.isNullOrempty(heading) == false){
                    data.heading = heading;
                }
                if (stringutils.isNullOrempty(alertType) == true) {
                    alertType = "alert-success";
                }
                data.alertType = alertType;

                var templ = cmutils.templateManager.getNow("alert-progress", "Alert");
                var html = templ(data);

                if (selector == null || selector == ""){
                    selector = "#container-alert";
                }
                $(selector).html(html);
                $(selector).show();
            });
        },


        renderError : function(message, back) {
            var templ = cmutils.templateManager.getNow("error-page", "MainNav");
            var html = templ({"message": message, "back": back});
            this.replaceMainHtml(html);
            throw new Error(message);
        },

        hideAlert:function (selector, immediate) {
            if (selector == null || selector == ""){
                selector = "#container-alert";
            }

            if (this.alertTimerId != null) {
                clearTimeout(this.alertTimerId);
            }
            if (immediate == true) {
                $(selector).hide();
            } else {
                $(selector).fadeOut();
            }
        }
    });

    return ViewManager;
});
