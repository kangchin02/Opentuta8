<?php

use Facebook\FacebookSession;
use Facebook\FacebookRequest;
use Facebook\GraphUser;
use Facebook\FacebookRequestException;
use Facebook\FacebookRedirectLoginHelper;


class UserController extends BaseController {

    /**
     * User Model
     * @var User
     */
    protected $user;

    /**
     * @var UserRepository
     */
    protected $userRepo;

    /**
     * Inject the models.
     * @param User $user
     * @param UserRepository $userRepo
     */
    public function __construct(User $user, UserRepository $userRepo)
    {
        parent::__construct();
        $this->user = $user;
        $this->userRepo = $userRepo;
    }

    /**
     * Users settings page
     *
     * @return View
     */
    public function getIndex()
    {
        list($user,$redirect) = $this->user->checkAuthAndRedirect('user');
        if($redirect){return $redirect;}

        // Show the page
        return View::make('site/user/index', compact('user'));
    }

    /**
     * Stores new user
     *
     */
    public function postIndex()
    {
        $user = $this->userRepo->signup(Input::all());

        if ($user->id) {
            /*
            if (Config::get('confide::signup_email')) {
                Mail::queueOn(
                    Config::get('confide::email_queue'),
                    Config::get('confide::email_account_confirmation'),
                    compact('user'),
                    function ($message) use ($user) {
                        $message
                            ->to($user->email, $user->username)
                            ->subject(Lang::get('confide::confide.email.account_confirmation.subject'));
                    }
                );
            }
            */

            //return Response::make("OK", 200);
            return Response::json($user,200); // This returns the whole user object


            /*
            return Redirect::to('user/login')
                ->with('success', Lang::get('user/user.user_account_created'));
            */
        } else {
            /*
            if (Config::get('confide::signup_email')) {
                Mail::queueOn(
                    Config::get('confide::email_queue'),
                    Config::get('confide::email_account_confirmation'),
                    compact('user'),
                    function ($message) use ($user) {
                        $message
                            ->to($user->email, $user->username)
                            ->subject(Lang::get('confide::confide.email.account_confirmation.subject'));
                    }
                );
            }
            */

            $error = $user->errors()->all(':message');

            //return Response::json(array('status' => $error),400);

            return Response::json($error,400);

            /*
            return Redirect::to('user/create')
                ->withInput(Input::except('password'))
                ->with('error', $error);
            */
        }
    }

    /**
     * Edits a user
     * @var User
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postEdit(User $user)
    {
        $oldUser = clone $user;

        $user->username = Input::get('username');
        $user->email = Input::get('email');

        $password = Input::get('password');
        $passwordConfirmation = Input::get('password_confirmation');

        if (!empty($password)) {
            if ($password != $passwordConfirmation) {
                // Redirect to the new user page
                $error = Lang::get('admin/users/messages.password_does_not_match');
                return Redirect::to('user')
                    ->with('error', $error);
            } else {
                $user->password = $password;
                $user->password_confirmation = $passwordConfirmation;
            }
        }

        if ($this->userRepo->save($user)) {
            return Redirect::to('user')
                ->with( 'success', Lang::get('user/user.user_account_updated') );
        } else {
            $error = $user->errors()->all(':message');
            return Redirect::to('user')
                ->withInput(Input::except('password', 'password_confirmation'))
                ->with('error', $error);
        }

    }

    /**
     * Displays the form for user creation
     *
     */
    public function getCreate()
    {
        return View::make('site/user/create');
    }


    /**
     * Displays the form for user creation
     *
     */
    public function signup()
    {
        $username = Input::get('username');

        $email = Input::get('email');

    }


    /**
     * Displays the login form
     *
     */
    public function getLogin()
    {
        $user = Auth::user();
        if(!empty($user->id)){
            return Redirect::to('/');
        }

        return View::make('site/user/login');
    }

    /**
     * Attempt to do login
     *
     */
    public function postLogin()
    {
        $repo = App::make('UserRepository');
        $input = Input::all();

        if ($this->userRepo->login($input)) {
            $user = Auth::user();
            return Response::json($user,200); // This returns the whole user object
            //return Response::json(array('username' => $user->username),200);
        } else {

            if ($this->userRepo->isThrottled($input)) {
                $err_msg = Lang::get('confide::confide.alerts.too_many_attempts');
            } elseif ($this->userRepo->existsButNotConfirmed($input)) {
                $err_msg = Lang::get('confide::confide.alerts.not_confirmed');
            } else {
                $err_msg = Lang::get('confide::confide.alerts.wrong_credentials');
            }

            return Response::json(array('status' => $err_msg),400);

            /*
            return Redirect::to('user/login')
                ->withInput(Input::except('password'))
                ->with('error', $err_msg);
            */
        }

    }

    public function postLoginOld()
    {
        $repo = App::make('UserRepository');
        $input = Input::all();

        if ($this->userRepo->login($input)) {
            return Redirect::intended('/');
        } else {
            if ($this->userRepo->isThrottled($input)) {
                $err_msg = Lang::get('confide::confide.alerts.too_many_attempts');
            } elseif ($this->userRepo->existsButNotConfirmed($input)) {
                $err_msg = Lang::get('confide::confide.alerts.not_confirmed');
            } else {
                $err_msg = Lang::get('confide::confide.alerts.wrong_credentials');
            }

            return Redirect::to('user/login')
                ->withInput(Input::except('password'))
                ->with('error', $err_msg);
        }

    }

    /**
     * Attempt to confirm account with code
     *
     * @param  string $code
     * @return \Illuminate\Http\RedirectResponse
     */
    public function getConfirm($code)
    {
        if ( Confide::confirm( $code ) )
        {
            return Redirect::to('user/login')
                ->with( 'notice', Lang::get('confide::confide.alerts.confirmation') );
        }
        else
        {
            return Redirect::to('user/login')
                ->with( 'error', Lang::get('confide::confide.alerts.wrong_confirmation') );
        }
    }

    /**
     * Displays the forgot password form
     *
     */
    public function getForgot()
    {
        return View::make('site/user/forgot');
    }

    /**
     * Attempt to reset password with given email
     *
     */
    public function postForgotPassword()
    {
        if (Confide::forgotPassword(Input::get('email'))) {
            return Response::json('ok',200);

            /*
            $notice_msg = Lang::get('confide::confide.alerts.password_forgot');
            return Redirect::to('user/forgot')->with('notice', $notice_msg);
            */
        } else {
            return Response::json('invalid email',400);

            /*
            $error_msg = Lang::get('confide::confide.alerts.wrong_password_forgot');
            return Redirect::to('user/login')->withInput()->with('error', $error_msg);
            */
        }
    }

    /**
     * Attempt to login with facebook token
     *
     */
    public function postLoginFacebook()
    {
        $response = Input::get('response');
        $config = Config::get('facebook');

        if ($response && $config) {
            try {
                FacebookSession::setDefaultApplication($config['appId'], $config['secret']);
                $session = new FacebookSession($response['accessToken']);
                $request = new FacebookRequest($session, 'GET', '/me');
                $response = $request->execute();
                $userInfo = $response->getGraphObject()->asArray();;
            }
            catch (Exception $e) {
                $err_msg = $e->getMessage();
                return Response::json(array('status' => $err_msg),400);
            }

            $input = Input::all();
            $input['email'] = $userInfo["email"];
            $input['username'] = $userInfo["first_name"].' '.$userInfo['last_name'];
            $input['password'] = substr(md5(rand()),0,10);
            $input['facebook_uid']  = $userInfo['id'];
            $input['avatar']  = "https://graph.facebook.com/".$input['facebook_uid']."/picture?type=large";

            return $this->loginSocialUser($input);
        }

        return Response::json(array('status' => "error"),400);
    }

    /**
     * Attempt to login with google token
     *
     */
    public function postLoginGoogle()
    {
        $response = Input::get('response');
        $config = Config::get('google');

        if ($response && $config) {
            $client = new Google_Client();
            $client->setClientId($config['clientId']);
            $client->setClientSecret($config['secret']);
            $client->setRedirectUri("postmessage");
            $client->addScope("https://www.googleapis.com/auth/plus.login");
            $client->addScope("email");

            $client->authenticate($response['code']);
            $accessToken = $client->getAccessToken();

            $client->setAccessToken($accessToken);
            $PlusService = new Google_Service_Plus($client);
            $me = $PlusService->people->get('me');
            $PlusPersonEMails = $me->getEmails();
            $me->getDisplayName();
            foreach($PlusPersonEMails as $em) {
                if($em->type == "account") {
                    $user_email = $em->value;
                }
            }

            $input = Input::all();
            $input['email'] = $user_email;
            $input['username'] = $me['displayName'];
            $input['password'] = substr(md5(rand()),0,10);
            $input['google_uid']  = $me['id'];
            $input['avatar']  = $me['image']['url'];

            return $this->loginSocialUser($input);
        }

        return Response::json(array('status' => "error"),400);
    }

    public function loginSocialUser($input)
    {
        if ($this->userRepo->loginSocial($input)) {
            $user = Auth::user();
            return Response::json($user,200); // This returns the whole user object
        } else {

            if ($this->userRepo->isThrottled($input)) {
                $err_msg = Lang::get('confide::confide.alerts.too_many_attempts');
            } elseif ($this->userRepo->existsButNotConfirmed($input)) {
                $err_msg = Lang::get('confide::confide.alerts.not_confirmed');
            } else {
                $err_msg = Lang::get('confide::confide.alerts.wrong_credentials');
            }

            return Response::json(array('status' => $err_msg),400);
        }
    }

    public function postLoginGoogle1()
    {
        $response = Input::get('response');
        $config = Config::get('google');

        if ($response && $config) {
            $client = new Google_Client();
            $client->setClientId($config['clientId']);
            $client->setClientSecret($config['secret']);
            $client->setRedirectUri("postmessage");
            $client->addScope("https://www.googleapis.com/auth/plus.login");
            $client->addScope("https://www.googleapis.com/plus/v1/people/me");
            $client->addScope("email");
            /*
            $client->setAccessToken(json_encode($response));
            */

            if($client->isAccessTokenExpired()) {
                $client->authenticate($response['code']);
//                $NewAccessToken = json_decode($client->getAccessToken());
//                $client->refreshToken($NewAccessToken->refresh_token);

            }

            $tokenData = $client->verifyIdToken()->getAttributes();

            //$ticket = $client->verifyIdToken($token);
            if ($tokenData) {
                //$data = $tokenData->getAttributes();
                $uid = $tokenData['payload']['sub']; // user ID

                $PlusService = new Google_Service_Plus($client);
                $me = new Google_Service_Plus_Person();
                $me = $PlusService->people->get('me');

                $PlusPersonEMails = new Google_Service_Plus_PersonEmails();
                $PlusPersonEMails = $me->getEmails();
                foreach($PlusPersonEMails as $em) {
                    if($em->type == "account") {
                        $user_email = $em->value;
                    }
                }
            }
   //         $oauth2 = new Google_Auth_OAuth2($client);
   //         $userInfo = $oauth2->userinfo->get();
        }



        return Response::json(array('status' => "error"),400);
    }

    /**
     * Shows the change password form with the given token
     *
     */
    public function getReset( $token )
    {

        return View::make('site/user/reset')
            ->with('token',$token);
    }


    /**
     * Attempt change password of the user
     *
     */
    public function postReset()
    {

        $input = array(
            'token'                 =>Input::get('token'),
            'password'              =>Input::get('password'),
            'password_confirmation' =>Input::get('password_confirmation'),
        );

        // By passing an array with the token, password and confirmation
        if ($this->userRepo->resetPassword($input)) {
            $notice_msg = Lang::get('confide::confide.alerts.password_reset');
            return Redirect::to('user/login')
                ->with('notice', $notice_msg);
        } else {
            $error_msg = Lang::get('confide::confide.alerts.wrong_password_reset');
            return Redirect::to('user/reset', array('token'=>$input['token']))
                ->withInput()
                ->with('error', $error_msg);
        }

    }

    /**
     * Log the user out of the application.
     *
     */
    public function getLogout()
    {
        Confide::logout();
        return Response::json("ok",200);
        //return Redirect::to('/');
    }

    /**
     * Get user's profile
     * @param $username
     * @return mixed
     */
    public function getProfile($username)
    {
        $userModel = new User;
        $user = $userModel->getUserByUsername($username);

        // Check if the user exists
        if (is_null($user))
        {
            return App::abort(404);
        }

        return View::make('site/user/profile', compact('user'));
    }

    public function getSettings()
    {
        list($user,$redirect) = User::checkAuthAndRedirect('user/settings');
        if($redirect){return $redirect;}

        return View::make('site/user/profile', compact('user'));
    }

    /**
     * Process a dumb redirect.
     * @param $url1
     * @param $url2
     * @param $url3
     * @return string
     */
    public function processRedirect($url1,$url2,$url3)
    {
        $redirect = '';
        if( ! empty( $url1 ) )
        {
            $redirect = $url1;
            $redirect .= (empty($url2)? '' : '/' . $url2);
            $redirect .= (empty($url3)? '' : '/' . $url3);
        }
        return $redirect;
    }
}
