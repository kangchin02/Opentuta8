@extends('layouts.default')

{{-- Content --}}
@section('content')
<div id="body" class="" data-role="content">




    <div id="modals"></div>

    <div id="container-main" class="container">
        <div id="container-alert" style="display: none;"></div>

        <div id="current-user" style="font-weight:bold"></div>

        <!-- ONLY USED FOR ADMIN MODE -->
        <div id="admin-header" style="display: none;">

        </div>

        <div id="viewport-main"><div>


                <div class="well">
                    <div class="row-fluid">
                        <div class="span12">




                            <ul class="unstyled app-list" data-role="listview" data-divider-theme="c">



                                <li class="active" data-role="list-divider">
                                    <h4>
                                        Flash Cards for Pediatrics<br>
                                    </h4>
                                </li>


                                <li>
                                    <div class="description ui-body" style="margin-bottom:20px;">

                                    </div>





                                    <div>
                                        <div>
                                            <ul class="unstyled user-product-list">

                                                <li>
                                                    <div>
                                                        <div>

                                                            <strong class="product-name">


                                                                <div style="margin-top:20px;">Flash Cards for Pediatrics  <span class="hidden-phone" style="font-size:small">•</span> Tst</div>


                                                                <span style="font-weight:normal">Flash Cards Peds</span>


                                                            </strong>
                                                            <div class="product-action-buttons">


                                                                <a class="btn btn-info" href="/apps/FlashCards.cshtml?userproductid=2087" data-role="button" data-theme="g">Go</a>













                                                            </div>

                                                        </div>



                                                        <div class="text-faded license-info">


                                            <span>
                                                Online access available until Saturday, July 25, 2015
                                            </span>
                                                            <br>


                                                        </div>






                                                    </div>
                                                </li>

                                            </ul>
                                        </div>

                                    </div>









                                    <hr>
                                </li>




                            </ul>

                        </div>
                    </div>
                </div>


            </div></div>

        <div id="viewport-main-secondary"></div>

        <div id="viewport-main-overlay" style="position:fixed"></div>




        <div id="common-modal" class="modal fade hide modal700"></div>



        <div id="common-progress" class="modal fade hide">
            <div id="common-progress-title" class="modal-header">
                Progress...
            </div>

            <div class="modal-body">
                <div class="progress progress-striped active">
                    <div class="bar" style="width: 100%;">Processing...</div>
                </div>
                <div id="common-progress-label"></div>
            </div>
        </div>

    </div>
</div>
@stop
