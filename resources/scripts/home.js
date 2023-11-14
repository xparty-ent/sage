import gsap from 'gsap';
import domReady from '@roots/sage/client/dom-ready';

const home = {
    _sceneTimeline: null,
    _modelTimeline: null,
    _torusTimeline: null,
    _armatureTimeline: null,

    _icosphere: null,
    _torus: null,
    _armature: null,

    _renderer: null,

    _createTimelines() {
        this._sceneTimeline = gsap.timeline();
        this._modelTimeline = gsap.timeline();
        this._torusTimeline = gsap.timeline();
        this._armatureTimeline = gsap.timeline();
    },

    _createIcosphere() {
        return this._renderer.addModel(window.home.icosphere)
            .then(icosphere => {
                icosphere.gltf.scene.traverse(object => {
                    if(!object.material) return;
                    object.material.emissive.r = 0;
                    object.material.emissive.g = 0;
                    object.material.emissive.b = 0;
                })

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

    _createRenderer() {
        this._renderer = xp.renderer.create($('.renderer'));
        
        return Promise.all([
            this._createIcosphere(),
            this._createArmature(),
            this._createTorus()
        ]);
    },

    _onRendererCreated() {
        this._createTimelines();
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