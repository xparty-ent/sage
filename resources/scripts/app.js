import gsap from 'gsap';

// import three classes
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Scene } from 'three/src/scenes/Scene.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Vector2 } from 'three/src/math/Vector2.js';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js';


/**
 * @see {@link https://webpack.js.org/api/hot-module-replacement/}
 */
if (import.meta.webpackHot) import.meta.webpackHot.accept(console.error);

/**
 * libraries
 */
window.gsap = gsap;
window.$ = window.jQuery;
window.THREE = {
    PerspectiveCamera,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
    GLTFLoader,
    DirectionalLight
};
