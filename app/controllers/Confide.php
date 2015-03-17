<?php

class ConfideExtended extends Zizaco\Confide\Confide {
    public function logAttempt1(array $input, $mustBeConfirmed = true) {
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
