<?php namespace Uniq;

/**
 * This class is used by Laravel in order to register confide
 * services into the IoC container.
 */
class UniqServiceProvider extends \Zizaco\Confide\ServiceProvider
{
    /**
     * Register the service provider.
     */
    public function register()
    {
        $this->registerRepository();

        $this->registerPasswordService();

        $this->registerLoginThrottleService();

        $this->registerUserValidator();

        $this->registerConfide();

        $this->registerCommands();
    }

    /**
     * Register the application bindings.
     */
    protected function registerConfide()
    {
        $this->app->bind('confide', function ($app) {
            return new UniqConfide(
                $app->make('confide.repository'),
                $app->make('confide.password'),
                $app->make('confide.throttle'),
                $app
            );
        });
    }
}
