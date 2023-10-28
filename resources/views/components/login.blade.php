<div class="xp-login show">
    <h1>{{ __('Login', 'label', 'sage') }}</h1>
    @php(wp_login_form())
    <hr />
    <p class="xp-login-footer">
        <a href="{!! wp_registration_url() !!}">Registrati</a> | <a href="{!! wp_lostpassword_url() !!}">Password dimenticata</a>
    </p>
</div>
<div class="xp-login-status">
    <p id="login-error-text"></p>
    <p id="login-status-text"></p>
</div>

@push('post-app-script')
<script type="module">
(function() {
        const status_container = $('.xp-login-status');
        const error_text = $('#login-error-text');
        const status_text = $('#login-status-text');
        const form = $('#loginform');
        const username = $('#user_login');
        const password = $('#user_pass');
        const remember_me = $('rememberme');
        const interim_login = $('.xp-login-container').hasClass('interim-login');
        const url = new URL(window.location);
        const home_url = '{{ get_home_url() }}';
        const redirect_to = url.searchParams.get('redirect_to');

        if(interim_login && url.searchParams.get('interim-login-status') === 'success') {
            $('body').addClass('interim-login-success');
            $('.xp-login').removeClass('show');
            status_container.addClass('show');
            status_text.addClass('show');
            status_text.html('Hai effettuato l\'accesso con successo!');
            return;
        } else if(url.searchParams.get('loggedout')) {
            status_container.addClass('show');
            status_text.addClass('show');
            status_text.html('Hai effettuato il logout con successo!');
        }

        form.on('submit', (e) => {
            e.preventDefault();
            xp.api.login(username.val(), password.val(), remember_me.is(':checked'))
                .then(() => {
                    if(interim_login) {
                        url.searchParams.append('interim-login-status', 'success');
                        window.location = url.href;
                        return;
                    }

                    window.location = redirect_to ?? home_url;
                })
                .catch(error => {
                    status_text.removeClass('show');
                    status_container.addClass('show');
                    error_text.addClass('show');
                    error_text.html(error.message);
                });
        });
}());
</script>
@endpush