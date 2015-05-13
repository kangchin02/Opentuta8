Authentication
==============
1. C:\xampp\htdocs\Opentuta8\vendor\laravel\framework\src\Illuminate\Auth\AuthManager.php

	public function createEloquentDriver()
	{
		$provider = $this->createEloquentProvider();

		return new Guard($provider, $this->app['session.store']);
	}

2. C:\xampp\htdocs\Opentuta8\vendor\laravel\framework\src\Illuminate\Auth\Guard.php

	public function __construct(UserProviderInterface $provider,
								SessionStore $session,
								Request $request = null)
	{
		$this->session = $session;
		$this->request = $request;
		$this->provider = $provider;
	}

	public function check()
	{
		return ! is_null($this->user());
	}

3. C:\xampp\htdocs\Opentuta8\vendor\zizaco\confide\src\Confide\Confide.php

    public function logAttempt(array $input, $mustBeConfirmed = true)
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

4. C:\xampp\htdocs\Opentuta8\vendor\laravel\framework\src\Illuminate\Auth\Guard.php

	public function login(UserInterface $user, $remember = false)
	{
		$this->updateSession($user->getAuthIdentifier());

		// If the user should be permanently "remembered" by the application we will
		// queue a permanent cookie that contains the encrypted copy of the user
		// identifier. We will then decrypt this later to retrieve the users.
		if ($remember)
		{
			$this->createRememberTokenIfDoesntExist($user);

			$this->queueRecallerCookie($user);
		}

		// If we have an event dispatcher instance set we will fire an event so that
		// any listeners will hook into the authentication events and run actions
		// based on the login and logout events fired from the guard instances.
		if (isset($this->events))
		{
			$this->events->fire('auth.login', array($user, $remember));
		}

		$this->setUser($user);
	}

5. Database models

    roles: admin, comment (This can be added through admin panel)

    permissions: manage_blogs, manage_posts, manage_comments, manage_users, post_comment

    permission_role: roles has many permissions

    assigned_roles: user can have many roles and therefore many permissions

6. New database models

    Accounts: username, email, password, isDeleted

    Permissions: super_user, super_user_read_only, admin and etc

    PermissionGroups: customer, admin

    UserPermissions: tracks permissions and permission groups user belongs to


