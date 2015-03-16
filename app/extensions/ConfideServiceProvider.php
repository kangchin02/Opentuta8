<?php namespace Extensions;

//use Zizaco\Confide\Confide;

class ConfideServiceProvider extends \Zizaco\Confide\ServiceProvider {

    /**
     * Bootstrap the service provider.
     *
     * @return void
     */
    public function boot() {
        $this->package('extensions/confide', 'confide', __DIR__.'/../');

        $this->commands(
            'command.confide.controller',
            'command.confide.routes',
            'command.confide.migration'
        );

    }

    /**
     * Register the application bindings.
     *
     * @return void
     */
    protected function registerConfide() {
        /*
        $this->app->bind('confide', function($app) {
            return new Confide($app->make('confide.repository'));
        });
        */

        $this->app->bind('confide', function ($app) {
            return new Confide(
                $app->make('confide.repository'),
                $app->make('confide.password'),
                $app->make('confide.throttle'),
                $app
            );
        });
    }
}
