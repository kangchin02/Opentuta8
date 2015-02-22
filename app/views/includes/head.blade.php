<head>
    <script type="text/javascript">
        window.opentutaserver = window.opentutaserver || {};
        window.opentutaserver.router = "{{{$page['router']}}}";
        window.opentutaserver.debug =@if (Config::get('app.debug') == 1) true; @else false; @endif

    </script>


    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>{{{$page['title']}}}</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta names="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="stylesheet" href="assets/css/site.css?unique={{{Config::get('app.version')}}}">
    <script>
        window.APPVERSION = "{{{Config::get('app.version')}}}"
    </script>
    <script src="/assets/js/libs/require/require.js"></script>
    <script src="/assets/js/require-config.js"></script>
    <script>
        // same as data-main
        require.config({
            baseUrl : 'assets/js',
            appDir : '../'
        });
        require(['main']);
    </script>
</head>