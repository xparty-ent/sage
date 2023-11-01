import domReady from "@roots/sage/client/dom-ready";

const preloader = {
    register() {

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