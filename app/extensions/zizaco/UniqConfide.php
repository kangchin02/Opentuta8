<?php namespace Uniq;

class UniqConfide extends \Zizaco\Confide\Confide {

    public function __construct(
        \Zizaco\Confide\RepositoryInterface       $repo,
        \Zizaco\Confide\PasswordServiceInterface  $passService,
        \Zizaco\Confide\LoginThrottleServiceInterface $loginThrottler,
        $app = null)
    {
        parent::__construct($repo, $passService, $loginThrottler, $app);
    }

    /**
     * Attempt to log a user into the application with password and
     * identity field(s), usually email or username.
     *
     * @param array $input           Array containing at least 'username' or 'email' and 'password'.
     *                               Optionally the 'remember' boolean.
     * @param bool  $mustBeConfirmed If true, the user must have confirmed his email account in order to log-in.
     *
     * @return bool Success.
     */
    public function logAttemptUniq(array $input, $mustBeConfirmed = true)
    {
        $remember = $this->extractRememberFromArray($input);
        $email = $this->extractIdentityFromArray($input);

        if (!$this->loginThrottling($email)) {
            return false;
        }

        $user = $this->repo->getUserByEmail($email);

        if ($user) {
            if (! $user->confirmed && $mustBeConfirmed) {
                return false;
            }

            $correctPassword = $this->app['hash']->check(
                isset($input['password']) ? $input['password'] : false,
                $user->password
            );

            if (! $correctPassword) {
                return false;
            }

            $this->app['auth']->login($user, $remember);
            return true;
        }

        return false;
    }

    public function getUserByEmail($identity)
    {
        if (is_array($identity)) {
            $identity = $this->extractIdentityFromArray($identity);
        }

        return $this->repo->getUserByEmail($identity);
    }


    public function logAttemptSocial(array $input, $mustBeConfirmed = true)
    {
        $remember = $this->extractRememberFromArray($input);
        $emailOrUsername = $this->extractIdentityFromArray($input);

        if (!$this->loginThrottling($emailOrUsername)) {
            return false;
        }

        $user = $this->repo->getUserByEmailOrUsername($emailOrUsername);

        if ($user) {
            if (! $user->confirmed && $mustBeConfirmed) {
                return false;
            }

            $correctPassword = $this->app['hash']->check(
                isset($input['password']) ? $input['password'] : false,
                $user->password
            );

            if (! $correctPassword) {
                return false;
            }

            $this->app['auth']->login($user, $remember);
            return true;
        }

        return false;
    }

}