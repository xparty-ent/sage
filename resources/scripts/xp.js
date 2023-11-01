import domReady from '@roots/sage/client/dom-ready';
import api from '@scripts/xp/api';
import renderer from '@scripts/xp/renderer';
import serviceworker from '@scripts/xp/serviceworker';

const xp = {
    api,
    renderer,
    serviceworker,

    register() {
        serviceworker.register();
    }
};

domReady(() => {
    xp.register();
});

/**
 * #x-party scripts
 */
window.xp = xp;