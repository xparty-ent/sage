import xp from '@scripts/xp';
import mouse from '@scripts/mouse';
import '@scripts/header';

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
xp.register();
mouse.register();