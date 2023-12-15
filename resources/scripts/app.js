import xp from '@scripts/xp';
import mouse from '@scripts/mouse';
import animations from '@scripts/animations';
import '@scripts/header';
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
    mouse.register();
    animations.register();
});