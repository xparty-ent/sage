@extends('layouts.app')

@section('page-content')
<div class="home-container">
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
