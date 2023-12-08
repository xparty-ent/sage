@extends('layouts.app')

@section('page-content')
<div class="home-container">
    <div class="renderer">
        <div class="loader">
            <div class="bar"></div>
        </div>
    </div>
    <div class="scroll"></div>
    <ul class="pagination">
        <li class="main active"></li>
        <li class="middle"></li>
        <li class="last"></li>
    </ul>
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
