<?php

use Zizaco\Confide\ConfideUserInterface;

class UniqUser extends Zizaco\Confide\EloquentRepository {

    public function getUserByEmailOrUsername($emailOrUsername) {
        $identity = [
            'email' => $emailOrUsername
        ];
        return $this->getUserByIdentity($identity);
    }

}