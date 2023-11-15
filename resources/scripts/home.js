import gsap from 'gsap';
import domReady from '@roots/sage/client/dom-ready';

// 3d environment variables
const CAMERA_POSITION = { x: 0, y: 0, z: 600, duration: 5, delay: 0, ease: 'back', repeat: 0 };
const TORUS_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 15, delay: 0, ease: 'power1.inOut', repeat: -1 };
const ICOSPHERE_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 5, delay: 0, ease: 'none', repeat: -1 };
const ARMATURE_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 10, delay: 0, ease: 'none', repeat: -1 };
const ARMATURE_SCALE = { x: 1.25, y: 1.25, z: 1.25, duration: 2.5, delay: 0.5, ease: 'none', repeat: 0 };
const LIGHT_POSITION = { x: 1, y: -1, z: 0, duration: 5, delay: 0.5, ease: 'none', repeat: 0 };
const LIGHT_COLOR = { r: 0, g: 0.8, b: 1, duration: 5, delay: 1, ease: 'none', repeat: 0 };

const home = {
    _icosphere: null,
    _torus: null,
    _armature: null,

    _renderer: null,

    _runRendererAnimation() {

        // camera animation
        gsap.to(this._renderer.camera.position, {
            ...CAMERA_POSITION,
            onUpdate: () => this._renderer.camera.lookAt(0, 0, 0)
        });

        // torus animation
        gsap.to(this._torus.gltf.scene.rotation, {
            ...TORUS_ROTATION
        });

        // icosphere animation
        gsap.to(this._icosphere.gltf.scene.rotation, {
           ...ICOSPHERE_ROTATION
        });

        // armature rotation animation
        gsap.to(this._armature.gltf.scene.rotation, {
            ...ARMATURE_ROTATION
        });

        // armature scale animation
        gsap.to(this._armature.gltf.scene.scale, {
            ...ARMATURE_SCALE
        });

        // light position animation
        gsap.to(this._renderer.light.position, {
            ...LIGHT_POSITION
        });

        // light color animation
        gsap.to(this._renderer.light.color, {
            ...LIGHT_COLOR
        });
    },

    _createIcosphere() {
        return this._renderer.addModel(window.home.icosphere)
            .then(icosphere => {
                icosphere.gltf.scene.traverse(object => {
                    if(!object.material) return;
                    object.material.emissive.r = 0;
                    object.material.emissive.g = 0;
                    object.material.emissive.b = 0;
                });

                this._icosphere = icosphere;
            });
    },

    _createTorus() {
        return this._renderer.addModel(window.home.torus)
            .then(torus => {
                torus.gltf.scene.traverse(object => {
                    if(!object.material) return;
                    object.material.color.r = 0x21 / 255;
                    object.material.color.g = 0x21 / 255;
                    object.material.color.b = 0x21 / 255;
                    object.material.size = 2;
                });

                this._torus = torus;
            })
    },

    _createArmature() {
        return this._renderer.addModel(window.home.armature)
            .then(armature => {
                armature.gltf.scene.traverse(object => {
                    if(!object.material) return;
                    object.material.color.r = 0x21 / 255;
                    object.material.color.g = 0x21 / 255;
                    object.material.color.b = 0x21 / 255;
                });

                this._armature = armature;
            })
    },

    _onRendererMouseMove(event) {
        this._icosphere.gltf.scene.traverse(object => {
            if(!object.material) return;

            if(this._icosphere.intersect) {
                object.material.emissive.r = 255;
            } else {
                object.material.emissive.r = 0;
            }
        });
        
        this._torus.gltf.scene.traverse(object => {
            if(!object.material) return;
            
            if(this._torus.intersect) {
                object.material.color.r = 255;
            } else {
                object.material.color.r = 0;
            }
        });
        
        this._armature.gltf.scene.traverse(object => {
            if(!object.material) return;
            
            if(this._armature.intersect) {
                object.material.color.r = 255;
            } else {
                object.material.color.r = 0;
            }
        });
    },

    _createRenderer() {
        const element = $('.renderer');

        this._renderer = xp.renderer.create(element);

        element.on('mousemove', event => this._onRendererMouseMove(event));

        return Promise.all([
            this._createIcosphere(),
            this._createArmature(),
            this._createTorus()
        ]);
    },

    _onRendererCreated() {
        this._runRendererAnimation();
    },
    
    register() {
        this._createRenderer()
            .then(() => this._onRendererCreated());
    }
};


domReady(() => {
    home.register();
    console.log('[home] registered');
});