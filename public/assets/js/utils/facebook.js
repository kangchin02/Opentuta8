// Load the SDK Asynchronously
(function(w, d, s) {
    var js, id = 'facebook-jssdk';
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);

    /*
    (function loadFacebookSDK(){
        var js, fjs = d.getElementsByTagName(s)[0], load = function(url, id) {
            if (d.getElementById(id)) {return;}
            js = d.createElement(s);
            js.src = url;
            js.id = id;
            fjs.parentNode.insertBefore(js, fjs);
        };
        load('//connect.facebook.net/en_US/all.js');
    }());

    if (w.addEventListener) { w.addEventListener("load", loadFacebookSDK, false); }
    else if (w.attachEvent) { w.attachEvent("onload",loadFacebookSDK); }
    */
}(window, document, 'script'));

// Init the SDK upon load
window.fbAsyncInit = function() {
    window.FB.init({
        appId      : 170603616380592, // 257696617667317, //window.FACEBOOK_APP_ID, // App ID
        // Path to your Channel File
        //channelUrl : '//' + window.location.hostname + '/fb_channel.html'
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });

    var headerSubject = null;
    var facebookSignUpSuccess = function(data, obj, redirectURL) {
        if (redirectURL) {
            window.location.href = redirectURL;
            return;
        }

        var nextURL = window.getNextURL();
        if (nextURL) {
            window.location.href = nextURL;
            return;
        }

        if (data.nextURL) {
            window.location.href = data.nextURL;
            return;
        }

        window.location.reload();
    };

    var facebookSignupError = function(xhr) {
        var data = {};
        try {
            data = $.parseJSON(xhr.responseText);
        } catch (e) { }
        if (xhr.status == 401) {
            if (data.noFacebookEmail) {
                // TODO: Show appropriate modal
                window.showErrorCatchall();
                return;
            }

            if (data.noFacebookName) {
                // TODO: Show appropriate modal
                window.showErrorCatchall();
                return;
            }

            if (data.signInError) {
                var $elem = $(this).parent();

                // Check that the error message for Facebook Connect is not currently displaying,
                // and trigger appropriate visual effects if it is currently being displayed
                if ($elem.find('.sign-in-form-error:visible')) {
                    $elem.find('.sign-in-form-error').fadeOut("100", function() {
                        $elem.find('.facebook-sign-in-error').slideDown("200").fadeIn();
                    });
                } else {
                    $elem.find('.sign-in-form-error').slideDown("200").fadeIn();
                }

                if (window.hasOwnProperty('shiftSignInPrompt')) {
                    window.shiftSignInPrompt();
                }
                return;
            }

            window.showErrorCatchall();
            return;
        }

        if (xhr.status == 403) {
            // Converted student trying to become a tutor
            // TODO: Show appropriate modal
            window.showErrorCatchall();
            return;
        }

        window.showErrorCatchall();
    };

    var facebookSignUp = function(obj, scope, signUpURL, redirectURL) {
        window.FB.login(function(response) {
            if (!response.authResponse) {
                // user has not auth'd your app, or is not logged into Facebook
                return;
            }

            $.ajax({
                url: signUpURL,
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    'csrfmiddlewaretoken': window.CSRF_TOKEN,
                    'access_token': response.authResponse.accessToken,
                    'path': document.location.pathname,
                    'subject': headerSubject
                },
                success: function(data) {
                    facebookSignUpSuccess(data, obj, redirectURL);
                },
                error: facebookSignupError.bind(obj)
            });
        }, { scope: scope });
    };

    var facebookShare = function(shareContext) {
        var url = null,
            name = null,
            caption = null,
            description = null;

        switch(shareContext) {
            case window.SHARE_CONTEXT.Q_AND_A:
                url = 'https://instaedu.com/tutors/qr/' + window.REFERRAL_CODE + '/';
                name = 'Check out InstaEDU for homework help';
                caption = 'You can ask any question about homework and receive '
                    + 'a free written explanation in a few hours.';
                description = '';
                break;
            case window.SHARE_CONTEXT.EXPLANATION:
                url = 'https://instaedu.com/tutors/e/' + window.explanationCode + '/';
                name = 'I just helped someone with ' + window.subjectKeyword + ' on InstaEDU.';
                caption = '';
                description = window.questionText;
                break;
            default:
                url = 'https://instaedu.com/tutors/r/' + window.REFERRAL_CODE + '/';
                name = 'Get instant homework help on InstaEDU';
                caption = 'Connect with a subject expert the moment you have a '
                    + 'question.';
                description = 'Sign up with this link and try InstaEDU for '
                    + 'free.';
        }

        var obj = {
            method: 'feed',
            link: url,
            name: name,
            caption: caption,
            description: description,
            display: 'popup'
        };
        window.FB.ui(obj, function () {/* if (data && data.post_id) {} */});
    };

    var facebookMessage = function() {
        window.FB.ui({
            method: 'send',
            link: $('#referral-code').val(),
            picture: 'https://instaedu.com/publish/static/img/EDU-icon.png',
            display: 'popup'
        }, function(response) {
            if (response && response.success) {
                $('#success-container').show();
            }
        });
    };

    $('.facebook-gift-share').click(function() {
        facebookMessage();
        return false;
    });

    $('.facebook-share').click(function() {
        facebookShare(window.SHARE_CONTEXT.LESSON);
        return false;
    });

    $('.facebook-questions-share').click(function() {
        facebookShare(window.SHARE_CONTEXT.Q_AND_A);
        return false;
    });

    $('.facebook-explanation-share').click(function() {
        facebookShare(window.SHARE_CONTEXT.EXPLANATION);
        return false;
    });

    $('.login-with-facebook.signup').click(function() {
        facebookSignUp(this, window.FACEBOOK_STUDENT_SCOPE,
                       window.FACEBOOK_CONNECT_SIGN_UP_URL);
        return false;
    });

    $('.login-with-facebook.signin').click(function() {
        facebookSignUp(this, window.FACEBOOK_STUDENT_SCOPE,
                       window.FACEBOOK_CONNECT_SIGN_IN_URL);
        return false;
    });

    $('.facebook-header.signin').on('click', function() {
        headerSubject = $('#id_header-subject').val();
        facebookSignUp(this, window.FACEBOOK_STUDENT_SCOPE,
                       window.FACEBOOK_CONNECT_SIGN_IN_URL);

        return false;
    });

    if (document.location.pathname == "/tutors/become-a-tutor/" ||
        document.location.pathname == "/tutors/become-a-tutor-v2/") {
        $('#facebook-sign-up-expert').on('click', function() {
            facebookSignUp(this, window.FACEBOOK_TUTOR_SCOPE,
                           window.FACEBOOK_CONNECT_TUTOR_SIGN_UP_URL);
            return false;
        });
        $('#facebook-sign-up-expert-disabled').tooltip();
    }

    $('#facebook-autoshare').click(function() {
        facebookSignUp(
            this, window.FACEBOOK_TUTOR_SCOPE + ',publish_actions',
            window.FACEBOOK_AUTOSHARE_SUCCESS_URL);
        return false;
    });

    window.facebookOgShareExplanation = function(explanationURL) {
        window.FB.api(
            '/me/' + window.FACEBOOK_NAMESPACE + ':help_with',
            'post',
            { question: window.BASE_URL + explanationURL.substring(1) },
            function(response) {
                if (! response || response.error) {
                    window.ratchetConsoleLog(
                        'Error posting student explanation to FB Open Graph',
                        response);
                    setTimeout(function() { location.href = explanationURL; }, 1000);
                    return;
                }

                location.href = explanationURL;
            }
        );
    };
};
