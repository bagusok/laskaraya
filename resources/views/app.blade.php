<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>

    </style>

    <title inertia>{{ config('app.name', 'LASKARAYA') }}</title>


    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @vite(['resources/css/app.css'])
    @inertiaHead
</head>

<body class="antialiased">
    @inertia
</body>

</html>
