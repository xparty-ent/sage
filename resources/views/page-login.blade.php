@extends('layouts.app', [
    'hideHeader' => $interim_login,
    'hideFooter' => $interim_login
])

@section('page-content')
<div @class(["xp-login-container", "interim-login" => $interim_login]) background-image="https://wp.x-party.it/app/uploads/2023/09/wp76564431.jpg">
    <x-login />
</div>
@endsection
