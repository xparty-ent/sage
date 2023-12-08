import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';

const home = {
    _sequenceRenderer: null,

    _timeline: null,

    _onSequenceImageLoaded(loadedImages, imagesCount) {
        const loadedPercentage = Math.floor(loadedImages / imagesCount * 100);
        
        const loader = $('.loader .bar');
        gsap.to(loader, {
            width: `${loadedPercentage}%`,
            duration: 0.5
        });
    },

    _onSequenceImagesLoaded() {
        this._timeline.play();
    },

    _createSequenceRenderer() {
        console.log(`[home] creating sequence renderer...`);
        const element = $('.renderer').first();
        this._sequenceRenderer = new xp.sequencerenderer(element, window.home.mainSequence);
        this._sequenceRenderer.load();

        this._sequenceRenderer.on('image-loaded', (loadedImages, imagesCount) => this._onSequenceImageLoaded(loadedImages, imagesCount));
        this._sequenceRenderer.on('images-loaded', () => this._onSequenceImagesLoaded());
    },

    
    _createMainTileTimeline() {
        const playhead = { frame: 0 };
        const loader = $('.loader');
        const tile = $('.tile.main');

        this._timeline.to(loader, {
            opacity: 0,
            duration: 1
        });

        this._timeline.to(tile, {
            backgroundColor: '#212121',
            duration: 1
        });
        
        this._timeline.to(playhead, {
            frame: 64,
            ease: 'ease-in',
            scrollTrigger: {
                start: 0,
                trigger: '.tile.main',
                pin: true,
                end: "+=1500", // end after scrolling 500px beyond the start
                scrub: 1.5, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            },
            onUpdate: () => {
                console.log("update", playhead.frame);
                this._sequenceRenderer.draw(playhead.frame)
            }
        });
    },

    _createTimeline() {
        this._timeline = gsap.timeline();
        this._timeline.pause();

        console.log('[home] creating main tile timeline...');
        this._createMainTileTimeline();

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