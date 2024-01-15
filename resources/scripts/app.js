import xp from '@scripts/xp';
import mouse from '@scripts/mouse';
import animations from '@scripts/animations';
import header from '@scripts/header';
import loader from '@scripts/loader';
import domReady from '@roots/sage/client/dom-ready';

/**
 * @see {@link https://webpack.js.org/api/hot-module-replacement/}
 */
if (import.meta.webpackHot) import.meta.webpackHot.accept(console.error);

/**
 * libraries
 */
window.$ = window.jQuery;
window.xp = xp;

/**
 * custom libraries
 */
domReady(() => {
    xp.register();
    header.register();
    mouse.register();
    loader.register();
    animations.register();
});