<?php

class BaseController extends Controller {

    const APPVERSION = 'TEAMCITY_BUILD_NUMBER';

    protected $page;

    /**
     * Initializer.
     *
     * @access   public
     * @return \BaseController
     */
    public function __construct()
    {
        $this->beforeFilter('csrf', array('on' => 'post'));

        $this->page = array(
            "module" => "homeModule",
            "title" => "Opentuta",
        );

        View::share('appversion', self::APPVERSION);
    }

	/**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	protected function setupLayout()
	{
		if ( ! is_null($this->layout))
		{
			$this->layout = View::make($this->layout);
		}
	}

}