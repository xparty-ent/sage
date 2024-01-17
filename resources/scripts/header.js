import gsap from 'gsap';
const header = {
    _nav: null,
    _toggle: null,

    _runFadeAnimation() {
        gsap.from($('.nav a'), {
           opacity: 0,
           delay: 0.5,
           stagger: 0.1
        });
    },

    _onWindowLoad() {
        this._runFadeAnimation();
    },

    _onLoaderFaded() {
        $('.mobile-menu-toggle').addClass('active');
    },

    _onToggleClick(e) {
        e.preventDefault();
        this._nav.toggleClass('active');

        if(this._nav.hasClass('active')) {
            this._runFadeAnimation();
        }
    },

    register() {
        this._nav = $('header.banner');

        $('.mobile-menu-toggle').on('click', (e) => this._onToggleClick(e));

        $(window).on('load', () => this._onWindowLoad());
        $(window).on('loader-faded', () => this._onLoaderFaded());
    }
};

export default header;