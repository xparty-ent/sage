<!doctype html>
<html @php(language_attributes())>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @php(wp_head())
  </head>
  <body @php(body_class())>

    <!-- WP Start -->
    @php(wp_body_open())
    
    @if(!isset($hideHeader) || !$hideHeader)
      @php(do_action('get_header'))
    @endif
    <!-- WP End -->


    <div id="app">
      @include('sections.mouse')

      <main id="main" @class(["main", "header-hidden" => isset($hideHeader) && $hideHeader, "footer-hidden" => isset($hideFooter) && $hideFooter])>
        @yield('page-content')
      </main>

      @hasSection('sidebar')
        <aside class="sidebar">
          @yield('sidebar')
        </aside>
      @endif
      
    </div>

    @stack('post-app-script')

    <!-- WP Start -->
    @if(!isset($hideFooter) || !$hideFooter)
      @php(do_action('get_footer'))
    @endif

    @php(wp_footer())
    <!-- WP End -->

  </body>
</html>

