import domReady from "@roots/sage/client/dom-ready";

const preloader = {
    _onDomLoaded(e) {
        $('.preloader').addClass('faded');
    },

    register() {
        $(window).on('load', (e) => this._onDomLoaded(e));
    },

    dismiss() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
};

domReady(() => {
    preloader.register();
});

window.preloader = preloader;