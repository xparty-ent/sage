import domReady from "@roots/sage/client/dom-ready";

const animations = {
    _onWindowLoaded() {
        $('body').addClass('faded');
    },

    register() {
        console.log('[animations] registered');
        $(window).on('load', event => this._onWindowLoaded());
    }
};

domReady(() => {
    animations.register();
});