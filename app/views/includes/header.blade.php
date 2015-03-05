<div id="main-navbar" class="navbar">
    <div class="navbar-inner" style="padding-left:0px; padding-right:0px;">
        <div class="container" style="padding:9px 10px;width:100%;">
            <div class="pull-right">
                <ul id="login-signup-container" class="inline nav nav-pills hidden-tablet hidden-phone" @if(Auth::check())style="display: none;"@endif>
                    <li class="li-nav-main nav-main dropdown" name="more">
                        <a id="btn-login">Login</a>
                    </li>

                    <li class="li-nav-main nav-main dropdown" name="more">
                        <a data-toggle="modal" data-target="#signup-modal">Sign Up</a>
                    </li>
                </ul>


                <ul id="logged-in-container" class="inline nav nav-pills hidden-tablet hidden-phone"  @if(!Auth::check())style="display: none;"@endif>
                    <li class="li-nav-main nav-main dropdown" name="more" style="padding-top: 10px; padding-right: 15px;">
                        <i id="notifications-icon" class="icon-bell-alt" style="color: white;font-size: large;cursor: pointer;" title="Notifications"></i>
                    </li>

                    <li class="li-nav-main nav-main dropdown" name="more" style="padding-top: 10px; padding-right: 15px;">
                        <i id="notifications-icon" class="icon-comments" style="color: white;cursor: pointer;font-size: large;" title="Messages"></i>
                    </li>

                    <li class="li-nav-main nav-main dropdown" name="more">
                        <a id="btn-login" style="font-size: small;
                        padding: 0;
                        margin-top: 13px;margin-right: 10px;">My Lessons</a>
                    </li>

                    <li class="li-nav-main nav-main dropdown" name="more" style="margin-right: 15px;">
                        <a id="btn-header-user" class="dropdown-toggle" data-toggle="dropdown" href="#" style="padding: 0;margin-top: 5px;" title="@if(Auth::check()){{{ Auth::user()->username }}}@endif">
                            <img class="profile-pic" src="/assets/img/portrait.png" style="width: 28px;height: 28px;border: 1px solid #ccc;border-radius: 5px;">
                            <b class="caret" style="margin-top: 15px;"> </b>
                        </a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="dlabel" style="right: 10px;">
                            <li class="li-nav-main nav-main" name="account">
                                <a href="/home#account" adminuserpostfix="/">
                                    Messages
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    Lessons
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    Billing
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    My Account
                                </a>
                            </li>

                            <li class="separator"></li>

                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    About Opentuta
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    Feedback
                                </a>
                            </li>

                            <li class="separator"></li>

                            <li class="li-nav-main nav-main" name="downloads">
                                <a id="btn-logout" href="javascript:void(0)">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>


<!-- -->

            <div class="pull-left">

                <a href="/home#home" class="pull-left" style="margin-top: 4px;margin-right: 15px;">
                    <img style="height:30px;" src="assets/img/opentuta.png">
                </a>

                <!--
                <a class="brand" href="/home#home"  target="_self">myMedStudy</a>
                -->

                <ul id="tab-nav-main" class="inline nav nav-pills hidden-tablet hidden-phone">

                    <li class="li-nav-main nav-main dropdown" name="more">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            Courses
                            <b class="caret"> </b>
                        </a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="dlabel">
                            <li class="li-nav-main nav-main" name="account">
                                <a href="/courses#k12">
                                    K-12
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/courses#college" adminuserpostfix="/account/">
                                    College
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/courses#pro" adminuserpostfix="/account/">
                                    Professional
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/courses#create" adminuserpostfix="/account/">
                                    Create a course
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="li-nav-main nav-main dropdown" name="more">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            Tutors
                            <b class="caret"> </b>
                        </a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="dlabel">
                            <li class="li-nav-main nav-main" name="account">
                                <a href="/home#account" adminuserpostfix="/">
                                    Find a tutor
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    Request a tutor
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="li-nav-main nav-main dropdown" name="more">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            Instahelp
                        </a>
                    </li>

                    <li class="li-nav-main nav-main dropdown" name="more">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            Examulator
                        </a>
                    </li>
                </ul>



            </div>

            <div class="pull-left hidden">
                <input type="text" id="header-search" placeholder="Search for tutors by subject... (Try “Algebra”)" value="" class="ui-autocomplete-input" autocomplete="off">
            </div>

            <div class="pull-left" style="margin-left: 10px;">
<span style="
float: left;
margin: 3px 0px;
border-top: 1px solid #fff;
padding: 4px 8px 4px 8px;
border-bottom: 1px solid #fff;
border-left: 1px solid #fff;
border-bottom-left-radius: 5px;
border-top-left-radius: 5px;
color: #fff;
display: none;
">Search</span>
                <ul id="tab-nav-main" class="inline nav nav-pills hidden-tablet hidden-phone" style="
border-bottom-left-radius: 5px;
border-top-left-radius: 5px;
margin: 3px 0px 0px;
border: 1px solid #fff;
padding: 2px;
">
                    <li class="li-nav-main nav-main dropdown" name="more" style="
padding-bottom: 1px;
">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#" style="padding: 5px 5px 5px 5px;">
                            Courses
                            <b class="caret"> </b>
                        </a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="dlabel">
                            <li class="li-nav-main nav-main" name="account">
                                <a href="/home#account" adminuserpostfix="/">
                                    K-12
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    College
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    Professional
                                </a>
                            </li>
                            <li class="li-nav-main nav-main" name="downloads">
                                <a href="/home#downloads" adminuserpostfix="/account/">
                                    Create a course
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>

                <input type="text" style="
/* border-bottom-left-radius: 3px; */
/* border-top-left-radius: 3px; */
/* border-bottom-right-radius: 0px; */
/* border-top-right-radius: 0px; */
width: 250px;
border: 1px solid #DDD8D8;
border-radius: 0px;
margin-bottom: 0px;
margin-top: 3px;
padding: 4px 6px;" placeholder="Search for...">

                <button class="btn" style="border: 1px solid #ccc;
padding: 4px 7px 4px 7px;
vertical-align: top;
margin-left: -3px;
border-bottom-right-radius: 5px;
border-top-right-radius: 5px;
border-bottom-left-radius: 0px;
border-top-left-radius: 0px;margin-top: 3px;" type="button">Go!</button>
            </div>

            <div class="clearfix"></div>

        </div>
    </div>
</div>




