@extends('layouts.app')

@section('page-content')
<!--<div class="renderer">
</div>-->
<div class="home-container">
    <!--<ul class="pagination">
        <li class="main active"></li>
        <li class="middle"></li>
        <li class="last"></li>
    </ul>
    <div class="scroll">
        <div class="container">
            <p>Scrolla per iniziare</p>
            <div class="arrow"></div>
            <div class="arrow"></div>
            <div class="arrow"></div>
        </div>
    </div>-->
    @php(the_content())
</div>
@endsection

@push('post-app-script')
<script>
(function() {
    window.home = window.home || {};
    window.home.mainSequence = '{{ $mainSequence }}';
}());
</script>
@endpush
