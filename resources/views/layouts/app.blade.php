
@include('sections.mouse')

@if(!isset($hide_header) || !$hide_header)
  @include('sections.header')
@endif

  <main id="main" @class(["main", "header-hidden" => isset($hide_header) && $hide_header, "footer-hidden" => isset($hide_footer) && $hide_footer])>
    @yield('page-content')
  </main>

  @hasSection('sidebar')
    <aside class="sidebar">
      @yield('sidebar')
    </aside>
  @endif

@if(!isset($hide_footer) || !$hide_footer)
  @include('sections.footer')
@endif

@stack('post-app-script')