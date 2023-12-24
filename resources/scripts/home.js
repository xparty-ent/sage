import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';

const home = {
    _sequenceRenderer: null,

    _onImageLoading(e) {
        const { imageIndex, loadProgress } = e.detail;

        if(imageIndex) return;
        const bar = $('.loader .bar');
        
        gsap.to(bar, {        
            width: `${loadProgress}%`,
            duration: 0.5
        })

    },

    _onSequenceImageLoaded(e) {
        const bar = $('.loader .bar');
        const loader = $('.loader');
        const scroll = $('.scroll');
        const { loadedImages, imagesCount, imageIndex } = e.detail; 
        const loadedPercentage = Math.floor(loadedImages / imagesCount * 100);
        console.log(`[home] loaded frame ${imageIndex}, loaded ${loadedImages}/${imagesCount} images, progress: ${loadedPercentage}%`);
        
        if(!imageIndex) {    
            gsap.timeline({
                onComplete: () => this._createMainTileTimeline()
            })
            .to(bar, {        
                width: '100%',
                duration: 0.5
            })
            .to(loader, {
                opacity: 0,
                duration: 1,
            })
            .to(scroll, {
                opacity: 1,
                duration: 0.5,
            });
        }
    },

    _onSequenceImagesLoaded() {
        console.log('[home] sequence images loaded');
    },

    _createSequenceRenderer() {
        console.log(`[home] creating sequence renderer...`);
        const element = $('.renderer').first();
        this._sequenceRenderer = xp.sequencerenderer.create(element, window.home.mainSequence, {
            "frames": {
                "start": 1,
                "count": 70,
                "digits": 4,
                "buffer": 6,
                "extension": "png"
            }
        });

        this._sequenceRenderer.load();

        this._sequenceRenderer.on('image-loading', e => this._onImageLoading(e));
        this._sequenceRenderer.on('image-loaded', e => this._onSequenceImageLoaded(e));
        this._sequenceRenderer.on('images-loaded', () => this._onSequenceImagesLoaded());
    },

    
    _createMainTileTimeline() {
        const tile = $('.tile.main');
        const canvas = $('.renderer canvas');
        const scroll = $('.scroll');
        canvas.css('opacity', 0);

        const playhead = { 
            frame: 0 
        };

        
        if(tile.hasClass('has-base-background-color')) {
            tile.css('background-color', '#e0e0e0');
            tile.removeClass('has-base-background-color');
        }

        $('.tile .fade-in').each((index, element) => {
            if($(element).hasClass('has-accent-color')) {
                $(element).css('color', '#212121');
                $(element).removeClass('has-accent-color');
            }
        });
        
        // draw the first frame
        this._sequenceRenderer.draw(0);

        gsap.to(canvas, {
           opacity: 1,
           duration: 1 
        });

        let mainTimeline = gsap.timeline();

        let timeline = gsap.timeline().to(scroll, {
            opacity: 0,
            scrollTrigger: {
                start: "top top",
                trigger: '.scroll',
                markers: {startColor: "white", endColor: "white" },
                pin: false,
                end: "bottom center",
                scrub: 0,
            },
        });
        
        mainTimeline.add(timeline, '>');


        timeline = gsap.timeline().to(playhead, {
            frame: 30,
            ease: 'none',
            scrollTrigger: {
                start: "bottom center",
                trigger: '.scroll',
                markers: {startColor: "red", endColor: "red" },
                pin: false,
                snap: 1,
                end: "bottom top",
                scrub: 0,
            },
            onUpdate: () => {
                console.log(`[home] drawing frame ${playhead.frame}`);
                this._sequenceRenderer.draw(playhead.frame);
            }
        });

        mainTimeline.add(timeline, '>');

        timeline = gsap.timeline({
            scrollTrigger: {
                start: `top top+=44`,
                trigger: '.tile.main',
                markers: {startColor: "blue", endColor: "blue" },
                pin: true,
                end: "+=2000", // end after scrolling 500px beyond the start
                scrub: 0, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            }
        });

        $('.tile.main .fade-in').each((index, element) => {
            timeline.to(element, {
                opacity: 1, 
                yPercent: 10,
                color: '#e0e0e0',
            });
        });

        timeline.to(playhead, {});
        mainTimeline.add(timeline, '>');
        
        
        /*
        timeline = gsap.timeline().to(playhead,
            {
                frame: 69,
                ease: 'none',
                scrollTrigger: {
                    start: "top bottom",
                    trigger: '.tile.main',
                    markers: {startColor: "magenta", endColor: "magenta" },
                    pin: true,
                    snap: 1,
                    end: "bottom top",
                    scrub: 0,
                },
                onUpdate: () => {
                    console.log(`[home] drawing frame ${playhead.frame}`);
                    this._sequenceRenderer.draw(playhead.frame);
                }
            }
        );
        mainTimeline.add(timeline, '>');*/

    },
    
    register() {
        console.log("[home] registering home...")
        gsap.registerPlugin(ScrollTrigger);
        xp.register();

        this._createSequenceRenderer();
    }
};


domReady(() => {
    home.register();
    console.log('[home] registered');
});