@extends('layouts.app')

@section('page-content')
<div class="home-container">
    <div class="renderer"></div>
    <ul class="pagination">
        <li class="main active"></li>
        <li class="middle"></li>
        <li class="last"></li>
    </ul>
    @php(the_content())
</div>
@endsection

@push('post-app-script')
<script type="module">
(function() {
    const sceneTimeline = gsap.timeline();
    const modelTimeline = gsap.timeline();
    const torusTimeline = gsap.timeline();
    const armatureTimeline = gsap.timeline();

    var tile1Animation = (scene, model, torus, armature) => {
        sceneTimeline.clear();
        modelTimeline.clear();
        armatureTimeline.clear();
        torusTimeline.clear();

        gsap.to(scene.camera.position, {
            x: 0,
            y: 0,
            z: 300,
            duration: 5,
            ease: 'back',
            onUpdate: event => {
                scene.camera.lookAt(0, 0, 0);
            }
        });

        gsap.to(torus.gltf.scene.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2.5,
            ease: 'sin'
        });

        torusTimeline.to(torus.gltf.scene.rotation, {
            x: 2 * Math.PI,
            y: 2 * Math.PI,
            duration: 30,
            repeat: -1,
            ease: 'none'
        });

        gsap.to(model.gltf.scene.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
            ease: 'sin'
        });

        gsap.to(armature.gltf.scene.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
            ease: 'sin'
        });

        gsap.to(model.gltf.scene.rotation, {
            y: 1,
            duration: 2.5,
            ease: 'sin'
        });

        gsap.to(armature.gltf.scene.rotation, {
            y: 1,
            duration: 2.5,
            ease: 'sin'
        });

        modelTimeline.to(model.gltf.scene.rotation, {
            x: 2 * Math.PI,
            y: 2 * Math.PI,
            z: 2 * Math.PI,
            duration: 10,
            repeat: -1,
            ease: 'none'
        });

        armatureTimeline.to(armature.gltf.scene.rotation, {
            x: -(2 * Math.PI),
            y: -(2 * Math.PI),
            z: -(2 * Math.PI),
            duration: 10,
            repeat: -1,
            ease: 'none'
        });

        
        torusTimeline.play();
        modelTimeline.play();
        armatureTimeline.play();
        sceneTimeline.play();
    }

    var tile2Animation = (scene, model, torus, armature) => {
        sceneTimeline.clear();
        modelTimeline.clear();
        torusTimeline.clear();
        armatureTimeline.clear();

        const posX = scene.getWorldSize().x / 2;
        
        gsap.to(scene.camera.position, {
            x: 0,
            y: 0,
            z: 300,
            duration: 5,
            ease: 'back',
            onUpdate: event => {
                scene.camera.lookAt(0, 0, 0);
            }
        });


        gsap.to(model.gltf.scene.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2.5,
            ease: 'back'
        });

        modelTimeline.to(model.gltf.scene.position, {
            x: posX,
            duration: 2.5,
            ease: 'back'
        });

        armatureTimeline.to(armature.gltf.scene.position, {
            x: posX,
            duration: 2.5,
            ease: 'back'
        });
        
        modelTimeline.to(model.gltf.scene.rotation, {
            y: 2 * Math.PI,
            duration: 10,
            repeat: -1,
            ease: 'none'
        });

        armatureTimeline.to(armature.gltf.scene.rotation, {
            y: 2 * Math.PI,
            duration: 10,
            repeat: -1,
            ease: 'none'
        });

        gsap.to(torus.gltf.scene.rotation, {
            x: 0,
            y: 1.55,
            z: 0,
            duration: 2.5,
            ease: 'back'
        });

        torusTimeline.to(torus.gltf.scene.position, {
            x: posX,
            duration: 2.5,
            ease: 'back'
        });
        
        torusTimeline.to(torus.gltf.scene.rotation, {
            y: 0,
            duration: 2.5,
            ease: 'back'
        });

        torusTimeline.to(torus.gltf.scene.rotation, {
            z: 2 * Math.PI,
            duration: 30,
            repeat: -1,
            ease: 'sin'
        });

        torusTimeline.play();
        modelTimeline.play();
        armatureTimeline.play();
        sceneTimeline.play();
    }

    
    var tile3Animation = (scene, model, torus, armature) => {
        sceneTimeline.clear();
        modelTimeline.clear();
        torusTimeline.clear();
        armatureTimeline.clear();


        gsap.to(torus.gltf.scene.position, {
            x: 0,
            y: 0,
            z: -300,
            duration: 2.5,
            ease: 'sin'
        });
        
        gsap.to(torus.gltf.scene.rotation, {
            x: 0,
            y: 90,
            z: 0,
            duration: 2.5,
            ease: 'sin'
        });

        gsap.to(icosphere.gltf.scene.position, {
            x: 0,
            y: 1,
            z: 200,
            duration: 2.5,
            ease: 'sin'
        });
        
        gsap.to(armature.gltf.scene.position, {
            x: 0,
            y: 1,
            z: 200,
            duration: 2.5,
            ease: 'sin'
        });

        torusTimeline.play();
        modelTimeline.play();
        armatureTimeline.play();
        sceneTimeline.play();
    }

    var createArmature = () => {
        return window.scene.addModel("{{ asset('/models/xp-armature.glb') }}")
            .then(model => {
                model.gltf.scene.scale.x = 0.65;
                model.gltf.scene.scale.y = 0.65;
                model.gltf.scene.scale.z = 0.65;

                model.gltf.scene.traverse(object => {
                    if(!object.material) return;
                    object.material.color.r = 0x21 / 255;
                    object.material.color.g = 0x21 / 255;
                    object.material.color.b = 0x21 / 255;
                });

                window.armature = model;
                
        });
    }

    var createTorus = () => {
        return window.scene.addModel("{{ asset('/models/xp-torus.glb') }}")
            .then(model => {
                model.gltf.scene.traverse(object => {
                    if(!object.material) return;
                    object.material.color.r = 0x21 / 255;
                    object.material.color.g = 0x21 / 255;
                    object.material.color.b = 0x21 / 255;
                    object.material.size = 2;
                });

                window.torus = model;
                
        });
    }

    var createIcosphere = () => {
        return window.scene.addModel("{{ asset('/models/xp-icosphere.glb') }}")
            .then(model => {
                model.gltf.scene.scale.x /= 2;
                model.gltf.scene.scale.y /= 2;
                model.gltf.scene.scale.z /= 2;

                model.gltf.scene.traverse(object => {
                    if(!object.material) return;
                    object.material.emissive.r = 0; //0x21 / 255;
                    object.material.emissive.g = 0; //0x21 / 255;
                    object.material.emissive.b = 0; //0x21 / 255;
                });

                window.icosphere = model;
        });
    }

    var nextTile = () => {
        const tiles = $('.tile');

        if(tiles.length < 2)
            return null;

        for(let i = 0; i < tiles.length - 1; i++)
            if($(tiles[i]).hasClass('active'))
                return $(tiles[i + 1]);

        return null;
    }

    var prevTile = () => {
        const tiles = $('.tile');

        if(tiles.length < 2)
            return null;

        for(let i = 1; i < tiles.length; i++)
            if($(tiles[i]).hasClass('active'))
                return $(tiles[i - 1]);

        return null;
    }

    var onWheel = (event) => {
        
    }


    var scrollTile = (tile) => {
        const state = {
            top: $(window).scrollTop()
        };

        $('.tile.active').removeClass('active');
        $('.pagination li.active').removeClass('active');
        tile.addClass('active');


        let offset = 0;
        if(tile.hasClass('main')) {
            offset = $('header').height();
            tile1Animation(window.scene, window.icosphere, window.torus, window.armature);
            $('.pagination li.main').addClass('active');
        } else if(tile.hasClass('middle')) {
            tile2Animation(window.scene, window.icosphere, window.torus, window.armature);
            $('.pagination li.middle').addClass('active');
        } else if(tile.hasClass('last')) {
            $('.pagination li.last').addClass('active');
            tile3Animation(window.scene, window.icosphere, window.torus, window.armature);
        }

        gsap.to(state, {
            top: tile.position().top - offset,
            duration: 1.5,
            ease: 'ease-in',
            onUpdate: e => {
                $(window).scrollTop(state.top);
            }
        });
    };

    var onScrollNext = (event) => {
        const next = nextTile();
        if(!next) return;

        scrollTile(next);
    }
    

    var onScrollPrev = (event) => {
        const next = prevTile();

        if(!next) return;
        
        scrollTile(next);
    }


    setTimeout(() => {
        const scene = xp.renderer.create($('.renderer'));
        window.scene = scene;
                
                
        window.torusPromise = createTorus();
        window.spherePromise = createIcosphere();
        window.armaturePromise = createArmature();
    }, 0);

    var init = () => {
        const elements = $('.fade-in');
        for(let i = 0; i < elements.length; i++) {
            $(elements[i]).css('transition-delay', `${(1 + i) * 0.25}s`);
        }
        window.scroll.disable();

        setTimeout(() => {

            Promise.all([window.spherePromise, window.torusPromise, window.armaturePromise])
                .then(() => {
                    $(window).scrollTop(0);
                    $(window).on('wheel', event => onWheel(event));
                    $(window).on('scroll-next', event => onScrollNext(event));
                    $(window).on('scroll-prev', event => onScrollPrev(event));
                    window.scene.light.position.x = 1;
                    window.scene.light.position.y = -1;
                    window.scene.light.color.r = 1 / 255;
                    window.scene.light.color.g = 205 / 255;
                    window.scene.light.color.b = 254 / 255;
                    $('.home-container').addClass('faded')
                    tile1Animation(scene, window.icosphere, window.torus, window.armature);
                });
        }, 50);
    }

    $(document).ready(() => init());
}());
</script>
@endpush