import gsap from 'gsap';
import domReady from '@roots/sage/client/dom-ready';
import scroll from '@scripts/scroll';
import xp from '@scripts/xp';

// 3d environment variables
const CAMERA_POSITION = { x: 0, y: 0, z: 600, duration: 5, delay: 0, ease: 'back', repeat: 0 };

const TORUS_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 15, delay: 0, ease: 'power1.inOut', repeat: -1 };
const TORUS_POSITION = { x: 0, y: 0, z: -75, duration: 3, delay: 5, ease: 'ease', repeat: -1, yoyo: true };
const TORUS_SCALE = { x: 2, y: 2, z: 2, duration: 5, delay: 0, ease: 'power1.inOut', repeat: 0 };
const TORUS_HOVER_SCALE = { x: 1.75, y: 1.75, z: 1.75, duration: 1, delay: 0, ease: 'ease', repeat: 0, yoyo: false };

const ICOSPHERE_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 5, delay: 0, ease: 'none', repeat: -1 };
const ICOSPHERE_POSITION = { x: 0, y: 0, z: -75, duration: 3, delay: 5, ease: 'ease', repeat: -1, yoyo: true };
const ICOSPHERE_SCALE = { x: 1, y: 1, z: 1, duration: 0.50, delay: 0, ease: 'ease', repeat: 0, yoyo: false };
const ICOSPHERE_HOVER_SCALE = { x: 1.25, y: 1.25, z: 1.25, duration: 1, delay: 0, ease: 'ease', repeat: 0, yoyo: false };

const ARMATURE_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 10, delay: 0, ease: 'none', repeat: -1 };
const ARMATURE_POSITION = { x: 0, y: 0, z: -75, duration: 3, delay: 5, ease: 'ease', repeat: -1, yoyo: true };
const ARMATURE_SCALE = { x: 1.25, y: 1.25, z: 1.25, duration: 2.5, delay: 0.5, ease: 'none', repeat: 0 };
const ARMATURE_HOVER_SCALE = { x: 1.50, y: 1.50, z: 1.50, duration: 1, delay: 0, ease: 'ease', repeat: 0, yoyo: false };

const LIGHT_POSITION = { x: 1, y: -1, z: 0, duration: 5, delay: 0.5, ease: 'none', repeat: 0 };
const LIGHT_COLOR = { r: 0, g: 0.8, b: 1, duration: 5, delay: 1, ease: 'none', repeat: 0 };

const home = {
    _icosphere: null,
    _torus: null,
    _armature: null,

    _mainTimeline: null,
    _hoverTimeline: null,

    _renderer: null,

    _changingSlide: false,

    _runRendererAnimation() {
        // init vars
        this._renderer.camera.position.set(0, 0, 0);
        this._torus.gltf.scene.rotation.set(0, 0, 0);
        this._torus.gltf.scene.position.set(0, 0, 0);
        this._torus.gltf.scene.scale.set(1, 1, 1);
        this._icosphere.gltf.scene.rotation.set(0, 0, 0);
        this._icosphere.gltf.scene.position.set(0, 0, 0);
        this._icosphere.gltf.scene.scale.set(1, 1, 1);
        this._armature.gltf.scene.rotation.set(0, 0, 0);
        this._armature.gltf.scene.scale.set(1, 1, 1);
        this._armature.gltf.scene.position.set(0, 0, 0);
        this._renderer.light.color.set(0, 1, 0.63);
        this._renderer.light.position.set(0, 1, 0);

        this._hoverTimeline.pause();
        this._mainTimeline.seek('main');
        this._mainTimeline.play();

        // light position animation
        gsap.to(this._renderer.light.position, {
            ...LIGHT_POSITION
        });

        // light color animation
        gsap.to(this._renderer.light.color, {
            ...LIGHT_COLOR
        });

        // camera animation
        gsap.to(this._renderer.camera.position, {
            ...CAMERA_POSITION,
            onUpdate: () => this._renderer.camera.lookAt(0, 0, 0)
        });

    },

    
    _nextTile() {
        const tiles = $('.tile');

        if(tiles.length < 2)
            return null;

        for(let i = 0; i < tiles.length - 1; i++)
            if($(tiles[i]).hasClass('active'))
                return $(tiles[i + 1]);

        return null;
    },

    _prevTile() {
        const tiles = $('.tile');

        if(tiles.length < 2)
            return null;

        for(let i = 1; i < tiles.length; i++)
            if($(tiles[i]).hasClass('active'))
                return $(tiles[i - 1]);

        return null;
    },

    _scrollTile(tile) {
        if(!tile) return;
        
        const state = {
            top: $(window).scrollTop()
        };

        this._scrollValue(1);

        this._changingSlide = true;
        $('.tile.active').removeClass('active');
        $('.pagination li.active').removeClass('active');


        let offset = 0;
        let showRenderer = false;
        if(tile.hasClass('main')) {
            offset = $('header').height();
            showRenderer = true;
            $('.pagination li.main').addClass('active');
        } else if(tile.hasClass('middle')) {
            $('.pagination li.middle').addClass('active');
        } else if(tile.hasClass('last')) {
            $('.renderer').removeClass('faded');
            $('.pagination li.last').addClass('active');
        }

        if(!showRenderer) {
            $('.renderer').removeClass('faded');
        }

        gsap.to(state, {
            top: tile.position().top - offset,
            duration: 1.5,
            ease: 'ease-in',
            onUpdate: () => {
                $(window).scrollTop(state.top);
                scroll.reset();
            },
            onComplete: () => {
                this._changingSlide = false;
                tile.addClass('active');
                this._scrollValue(0);
                scroll.reset();
                if(showRenderer) {
                    this._runRendererAnimation();
                    $('.renderer').addClass('faded');
                }
            }
        });
    },

    _scrollValue(value) {
        if(this._changingSlide) {
            scroll.reset();
            return;
        }

        gsap.to($('.scroll'), {
            width: `${value * 100}vw`,
            duration: 0.5,
            ease: 'ease-in'
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
                    object.material.size = 1.5;
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
        const intersect = this._icosphere.intersect || this._armature.intersect;
        const drag = this._icosphere.drag || this._armature.drag;

        if(intersect && this._hoverTimeline.paused()) {
            //this._mainTimeline.pause();
            this._hoverTimeline.resume();
        } else if(!intersect && !drag && !this._hoverTimeline.paused()) {
            this._hoverTimeline.tweenTo(0, {
                duration: 0.5
            });
        }
    },

    _createIcosphereAnimations() {
        this._hoverTimeline.to(this._icosphere.gltf.scene.scale, {
           ...ICOSPHERE_HOVER_SCALE
        }, 'main');

        this._mainTimeline.to(this._icosphere.gltf.scene.rotation, {
            ...ICOSPHERE_ROTATION
         }, 'main');
 
         this._mainTimeline.to(this._icosphere.gltf.scene.position, {
             ...ICOSPHERE_POSITION
         }, 'main');

         /*
         this._mainTimeline.to(this._icosphere.gltf.scene.scale, {
            ...ICOSPHERE_SCALE
         }, 'main');
         */
    },

    _createTorusAnimations() {
        this._hoverTimeline.to(this._torus.gltf.scene.scale, {
            ...TORUS_HOVER_SCALE
        }, 'main');

        this._mainTimeline.to(this._torus.gltf.scene.rotation, {
            ...TORUS_ROTATION
        }, 'main');

        this._mainTimeline.to(this._torus.gltf.scene.position, {
            ...TORUS_POSITION
        }, 'main');

        /*
        this._mainTimeline.to(this._torus.gltf.scene.scale, {
            ...TORUS_SCALE
        }, 'main');
        */
    },

    _createArmatureAnimations() {
        this._hoverTimeline.to(this._armature.gltf.scene.scale, {
            ...ARMATURE_HOVER_SCALE
        }, 'main');

        this._mainTimeline.to(this._armature.gltf.scene.rotation, {
            ...ARMATURE_ROTATION
        }, 'main');

        this._mainTimeline.to(this._armature.gltf.scene.position, {
            ...ARMATURE_POSITION
        }, 'main');

        /*
        this._mainTimeline.to(this._armature.gltf.scene.scale, {
            ...ARMATURE_SCALE
        }, 'main');
        */
    },

    _createRendererAnimations() {
        this._mainTimeline = gsap.timeline();
        this._hoverTimeline = gsap.timeline();

        this._mainTimeline.add('main');
        this._hoverTimeline.add('main');

        this._mainTimeline.pause();
        this._hoverTimeline.pause();

        this._createIcosphereAnimations();
        this._createTorusAnimations();
        this._createArmatureAnimations();
    },

    _createFadeAnimations() {
        const elements = $('.tile');

        for(let i = 0; i < elements.length; i++) {
            const children = $(elements[i]).find('.fade-in');
            for(let k = 0; k < children.length; k++) {
                $(children[k]).css('transition-delay', `${(k + 1) * 0.25}s`);
            }
        }
    },

    _createRenderer() {
        const element = $('.renderer');
        this._renderer = xp.renderer.create(element);

        return Promise.all([
            this._createIcosphere(),
            this._createArmature(),
            this._createTorus()
        ]);
    },

    _onRendererCreated() {
        this._createRendererAnimations();
        this._scrollTile($('.tile.main'));
        $('.renderer').on('mousemove', event => this._onRendererMouseMove(event));
        $(window).on('scroll-next', () => this._scrollTile(this._nextTile()));
        $(window).on('scroll-prev', () => this._scrollTile(this._prevTile()));
        $(window).on('scroll-value', (e, val) => this._scrollValue(val));
    },
    
    register() {
        scroll.register();
        xp.register();
        scroll.disable();
        this._createFadeAnimations();
        this._createRenderer()
            .then(() => this._onRendererCreated());
    }
};


domReady(() => {
    home.register();
    console.log('[home] registered');
});