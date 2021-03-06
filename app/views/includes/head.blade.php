<head>
    <title>{{{$page['title']}}}</title>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta names="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="stylesheet" href="assets/css/site.css?unique={{{Config::get('app.version')}}}">

    <script type="text/javascript">
        window.APPVERSION = "{{{Config::get('app.version')}}}"
        window.AppServer = window.AppServer || {};
        window.AppServer.module = "{{{$page['module']}}}";
        window.AppServer.session = "{{{ csrf_token() }}}";
        window.AppServer.debug =@if (Config::get('app.debug') == 1) true; @else false; @endif
    </script>

    <script src="/assets/js/libs/require/require.js"></script>
    <script>
        require.config({baseUrl : 'assets/js', appDir : '../', urlArgs : "version=" + '{{{Config::get('app.version')}}}'});require(['main']);
    </script>
</head>