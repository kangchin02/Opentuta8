<!DOCTYPE html>
<html lang="en" class="{{{$page['router']}}}">

@include('includes.head')

<!--[if lt IE 7 ]> <body class="no-js ie6 lt-ie7 ie" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <body class="no-js ie7 lt-ie8 ie" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <body class="no-js ie8 lt-ie9 ie" lang="en"> <![endif]-->
<!--[if IE 9 ]>    <body class="no-js ie9 lt-ie10 ie" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <body class="no-js has-short-background" lang="en"> <!--<![endif]-->

<div id="mobile-page-loader" class="hide"></div>

<div id="page" class="wrapper" data-role="page" data-theme="a">
    <!--[if lt IE 7]>
    <p class=chromeframe>Your browser is <em>ancient!</em><a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p>
    <![endif]-->

    @include('includes.header')

    <div id="main-body" style="padding-top: 52px;">
        <div class="flat-grid" style="background-image: url(/assets/img/home.jpg);margin-bottom: 20px;height: 230px;">
            <div id="home-search" class="section index-hgroup">
                <div id="try-it-now"></div>
                <input type="radio" name="lesson-type" class="hidden-content" value="on-demand" checked="">
                <div class="align-mid">
                    <div class="section align-mid-contents">
                        <span class="home-search-label mobile-only">What subject do you want help with?</span>
                        <form id="subject-search-form" method="POST" action="" _lpchecked="1">

                            <div class="input-group search">
                            <span>
                                <label for="subject" class="large" style="cursor: text; opacity: 1;">
                                    <span class="no-mobile">What subject can we help you with? </span>
                                    <span>Try 'Algebra'...</span>
                                </label>
                                <span role="status" aria-live="polite" class="ui-helper-hidden-accessible"></span><input name="subject" id="subject" class="large ui-autocomplete-input" type="text" autocomplete="off">
                            </span>
                            </div>
                            <button id="subject-search-btn" href="#" class="btn btn-convert" data-loading-text="Loading...">See Tutors!</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div id="sub-head-spacer" class="hidden-phone hidden" style="height: 250px;overflow: auto;height:250px;background: url('/assets/img/home.jpg')no-repeat center center fixed;">
            <a href="http://www.medstudy.com" target="_blank" class="pull-left" style="display:none"><imgsrc="https://a248.e.akamai.net/static.chegg.com/assets/site/images/img-header-sihp-1400x300.jpg" width="184" height="48"></a>
            <h3 id="page-title" class="pull-right" style="display:">Flash Cards</h3>
        </div>

        <div id="viewport-main"></div>
        @yield('content')
    </div>

    <div class="push hidden-phone"></div>
</div>

<!-- Modal -->
<div id="login-modal" class="modal-small hide slide" tabindex="-1" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-header">
        <span aria-hidden="true" data-dismiss="modal" style="float: right;cursor: pointer;">×</span>
        <div class="auth_inner_header">
            <h4 class="modal-title" style="float: left;">Login</h4>
            <span class="register_header_link" style="margin-top: 15px;float: left;border-bottom: 1px solid #fff;margin-left: 55px;cursor: pointer;">Signup</span>
        </div>
    </div>

    <div class="modal-body">
        <div class="auth_inner_container">
            <div class="auth-alert" role="alert">
                <span class="auth-alert-message">This is a test!</span>
            </div>
            <form action="#" id="auth_form_register" name="auth_form_register">
                <div class="form-group"><input type="text" name="email" id="email" value="" placeholder="Email"></div>
                <div class="form-group"><input type="password" name="password" id="password" value="" placeholder="Password"></div>
                <a href="/auth/forgotpassword/" class="forgotpassword_link">I forgot my password</a>
                <div class="no-feedback">
                    <button class="btn btn-sm btn-primary btn-signup btn-embossed" style="width: 100%;margin-top: 5px;">
                        <span class="fui-facebook" style="display: none;margin-right: 20px;"><img src="assets/img/ajax-loader.gif" alt="checking"></span> Login</button>
                </div>
            </form>

            <div class="fb_container" title="Facebook">
                <div class="divider" style="margin-bottom:20px;"><span style="padding: 0px 10px;background: #fff;">or</span></div>
                <button style="width: 100%;" class="btn btn-sm btn-primary btn-social-facebook btn-embossed"><i class="icon-facebook-sign"></i> Login with Facebook</button>
                <button id="google-login-button" style="width:100%;margin-top: 5px;" class="btn btn-sm btn-primary btn-social-googleplus btn-embossed"><i class="icon-google-plus"></i> Login with Google</button>
            </div>
        </div>
    </div>

</div>

<div id="signup-modal" class="modal-small hide slide" tabindex="-1" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-header">
        <span aria-hidden="true" data-dismiss="modal" style="float: right;cursor: pointer;">×</span>
        <div class="auth_inner_header">
            <h4 class="modal-title" style="
    float: left;
">Sign Up</h4><span class="register_header_link" style="
    margin-top: 15px;
    float: left;
    border-bottom: 1px solid #fff;
    margin-left: 55px;
    cursor: pointer;
">Login</span>
        </div>
    </div>

    <div class="modal-body">
        <div class="auth_inner_container">
            <div class="auth-alert" role="alert">
                <span class="auth-alert-message">This is a test!</span>
            </div>
            <form action="#" id="auth_form_register" name="auth_form_register">
                <div style="display: inline-block;width:100%;" align="center">
                    <span style="display: inline-block;margin-right: 15px;">I am a ... </span>
                    <label style="display: inline-block;margin-right: 15px;"><input style="vertical-align: top;" name="sampleinlineradio" value="option1" type="radio" checked> Student</label>
                    <label style="display: inline-block;"><input style="vertical-align: top;" name="sampleinlineradio" value="option2" type="radio"> Parent</label>
                </div>

                <div class="form-group"><input type="text" name="fullname" id="fullname" value="" placeholder="Full Name"></div>
                <div class="form-group"><input type="text" name="email" id="email" value="" placeholder="Email"></div>
                <div class="form-group"><input type="password" name="password" id="password" value="" placeholder="Password"></div>
                <div class="no-feedback">
                    <button class="btn btn-sm btn-primary btn-signup btn-embossed" style="width: 100%;">
                        <span class="fui-facebook" style="display: none;margin-right: 20px;"><img src="assets/img/ajax-loader.gif" alt="checking"></span> Sign Up</button>
                </div>
            </form>

            <div class="fb_container" title="Facebook">
                <div class="divider" style="margin-bottom:20px;"><span style="padding: 0px 10px;background: #fff;">or</span></div>
                <button style="width: 100%;" class="btn btn-sm btn-primary btn-social-facebook btn-embossed"><i class="icon-facebook-sign"></i> Login with Facebook</button>
                <button id="google-login-button" style="width:100%;margin-top: 5px;" class="btn btn-sm btn-primary btn-social-googleplus btn-embossed"><i class="icon-google-plus"></i> Login with Google</button>
            </div>

            <div class="post-footer" align="center" style="margin-top: 10px;">
                <small style="font-size: 60%;">
                    By clicking "Sign up", you agree to our
                    <a href="/tutors/tos/basic/" title="Read our Terms of Use" bb-event="show-popup">
                        Terms
                    </a> and
                    <a href="/tutors/privacy/basic/" title="Read our Privacy Policy" bb-event="show-popup">
                        Privacy Policy
                    </a>
                </small>
                <div class="apply-tutor-text">
                    <a href="/tutors/become-a-tutor/" title="Apply to become a tutor!"><b>Apply to become a tutor</b></a>
                </div>
            </div>
        </div>
    </div>

</div>

@include('includes.footer')

</body>
</html>