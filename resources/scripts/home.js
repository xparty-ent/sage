import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';

const home = {
    _sequenceRenderer: null,

    _timeline: null,

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
        canvas.css('opacity', 0);

        const playhead = { 
            frame: 0 
        };

        
        if(tile.hasClass('has-base-background-color')) {
            tile.css('background-color', '#e0e0e0');
            tile.removeClass('has-base-background-color');
        }

        $('.tile.main .fade-in').each((index, element) => {
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


        mainTimeline.to(playhead, {
            frame: 69,
            ease: 'none',
            scrollTrigger: {
                start: "top top",
                trigger: '.tile.main',
                pin: true,
                end: "+=2000", // end after scrolling 500px beyond the start
                scrub: 0, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            },
            onUpdate: () => {
                console.log(`[home] drawing frame ${playhead.frame}`);
                this._sequenceRenderer.draw(playhead.frame);
            }
        });

        
        /*
        $('.tile.main .fade-in').each((index, element) => {
            mainTimeline.to(element, {
                opacity: 1, 
                yPercent: 5,
                color: '#e0e0e0',
                scrollTrigger: {
                    start: `top top+=${5000 * (index ++ )}`,
                    trigger: '.tile.main',
                    pin: true,
                    end: "+=2000", // end after scrolling 500px beyond the start
                    scrub: 2.5, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
                },
            });
        });
        */
        

        /*
        mainTimeline.to(playhead, {
            frame: 60,
            ease: 'ease-in',
            onUpdate: () => {
                console.log("update", playhead.frame);
                this._sequenceRenderer.draw(playhead.frame);
            }
        });
        */

    },

    _createTimeline() {
        this._timeline = gsap.timeline();
        console.log('[home] creating main tile timeline...');

    },
    
    register() {
        console.log("[home] registering home...")
        gsap.registerPlugin(ScrollTrigger);
        xp.register();

        this._createSequenceRenderer();
        this._createTimeline();

    }
};


domReady(() => {
    home.register();
    console.log('[home] registered');
});