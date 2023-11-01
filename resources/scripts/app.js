import gsap from 'gsap';
import * as THREE from 'three';

/**
 * @see {@link https://webpack.js.org/api/hot-module-replacement/}
 */
if (import.meta.webpackHot) import.meta.webpackHot.accept(console.error);

/**
 * libraries
 */
window.gsap = gsap;
window.$ = window.jQuery;
window.THREE = THREE;
