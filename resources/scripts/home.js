import gsap from 'gsap';
import domReady from '@roots/sage/client/dom-ready';
import scroll from '@scripts/scroll';
import xp from '@scripts/xp';

// 3d environment variables
const CAMERA_POSITION = { x: 0, y: 0, z: 600, duration: 5, delay: 0, ease: 'back', repeat: 0 };

const TORUS_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 15, delay: 0, ease: 'power1.inOut', repeat: -1 };
const TORUS_POSITION = { x: 0, y: 0, z: -75, duration: 3, delay: 5, ease: 'ease', repeat: -1, yoyo: true };
const TORUS_SCALE = { x: 2, y: 2, z: 2, duration: 5, delay: 0, ease: 'power1.inOut', repeat: 0 };

const ICOSPHERE_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 5, delay: 0, ease: 'none', repeat: -1 };
const ICOSPHERE_POSITION = { x: 0, y: 0, z: -75, duration: 3, delay: 5, ease: 'ease', repeat: -1, yoyo: true };

const ARMATURE_ROTATION = { x: Math.PI, y: Math.PI, z: Math.PI, duration: 10, delay: 0, ease: 'none', repeat: -1 };
const ARMATURE_SCALE = { x: 1.25, y: 1.25, z: 1.25, duration: 2.5, delay: 0.5, ease: 'none', repeat: 0 };
const ARMATURE_POSITION = { x: 0, y: 0, z: -75, duration: 3, delay: 5, ease: 'ease', repeat: -1, yoyo: true };

const LIGHT_POSITION = { x: 1, y: -1, z: 0, duration: 5, delay: 0.5, ease: 'none', repeat: 0 };
const LIGHT_COLOR = { r: 0, g: 0.8, b: 1, duration: 5, delay: 1, ease: 'none', repeat: 0 };

const home = {
    _icosphere: null,
    _torus: null,
    _armature: null,

    _renderer: null,

    _runRendererAnimation() {
        // init vars
        this._renderer.camera.position.set(0, 0, 0);
        this._torus.gltf.scene.rotation.set(0, 0, 0);
        this._torus.gltf.scene.position.set(0, 0, 0);
        this._torus.gltf.scene.scale.set(1, 1, 1);
        this._icosphere.gltf.scene.rotation.set(0, 0, 0);
        this._icosphere.gltf.scene.position.set(0, 0, 0);
        this._armature.gltf.scene.rotation.set(0, 0, 0);
        this._armature.gltf.scene.scale.set(1, 1, 1);
        this._armature.gltf.scene.position.set(0, 0, 0);
        this._renderer.light.color.set(0, 1, 0.63);
        this._renderer.light.position.set(0, 1, 0);

        // camera animation
        gsap.to(this._renderer.camera.position, {
            ...CAMERA_POSITION,
            onUpdate: () => this._renderer.camera.lookAt(0, 0, 0)
        });

        // torus rotation animation
        gsap.to(this._torus.gltf.scene.rotation, {
            ...TORUS_ROTATION
        });

        // torus position animation
        gsap.to(this._torus.gltf.scene.position, {
            ...TORUS_POSITION
        });

        // torus scale animation
        gsap.to(this._torus.gltf.scene.scale, {
            ...TORUS_SCALE
        });

        // icosphere rotation animation
        gsap.to(this._icosphere.gltf.scene.rotation, {
           ...ICOSPHERE_ROTATION
        });

        // icosphere position animation
        gsap.to(this._icosphere.gltf.scene.position, {
            ...ICOSPHERE_POSITION
        });

        // armature rotation animation
        gsap.to(this._armature.gltf.scene.rotation, {
            ...ARMATURE_ROTATION
        });

        // armature scale animation
        gsap.to(this._armature.gltf.scene.scale, {
            ...ARMATURE_SCALE
        });

        // armature position animation
        gsap.to(this._armature.gltf.scene.position, {
            ...ARMATURE_POSITION
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
            },
            onComplete: () => {
                tile.addClass('active');
                if(showRenderer) {
                    this._runRendererAnimation();
                    $('.renderer').addClass('faded');
                }
            }
        });
    },

    _scrollValue(value) {
        console.log(value);
        gsap.to($('.scroll'), {
            width: Math.max(outerPosition.x, (this._mouseOuterElement.width() / 2) + 1),
            top: Math.max(outerPosition.y, (this._mouseOuterElement.height() / 2) + 1),
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
                    object.material.size = 1;
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
        this._scrollTile($('.tile.main'));
        $('.renderer').on('mousemove', event => this._onRendererMouseMove(event));
        $(window).on('scroll-next', () => this._scrollTile(this._nextTile()));
        $(window).on('scroll-prev', () => this._scrollTile(this._prevTile()));
        $(window).on('scroll-value', (e, val) => this._scrollValue(val));
    },
    
    register() {
        scroll.disable();
        this._createFadeAnimations();
        this._createRenderer()
            .then(() => this._onRendererCreated());
    }
};


domReady(() => {
    home.register();
    scroll.register();
    xp.register();
    console.log('[home] registered');
});