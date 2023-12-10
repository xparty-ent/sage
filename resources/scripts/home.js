import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';

const home = {
    _sequenceRenderer: null,

    _timeline: null,

    _onSequenceImageLoaded(e) {
        const { loadedImages, imagesCount } = e.detail; 
        console.log(e, loadedImages, imagesCount);
        const loadedPercentage = Math.floor(loadedImages / imagesCount * 100);
        
        const loader = $('.loader .bar');
        gsap.to(loader, {
            width: `${loadedPercentage}%`,
            duration: 0.5
        });
    },

    _onSequenceImagesLoaded() {
        gsap.to($('.loader'), {
            opacity: 0,
            duration: 1,
            onComplete: () => this._createMainTileTimeline()
        });
    },

    _createSequenceRenderer() {
        console.log(`[home] creating sequence renderer...`);
        const element = $('.renderer').first();
        this._sequenceRenderer = new xp.sequencerenderer(element, window.home.mainSequence);
        this._sequenceRenderer.load();

        this._sequenceRenderer.on('image-loaded', e => this._onSequenceImageLoaded(e));
        this._sequenceRenderer.on('images-loaded', () => this._onSequenceImagesLoaded());
    },

    
    _createMainTileTimeline() {
        const playhead = { frame: 0 };
        const tile = $('.tile.main');

        if(tile.hasClass('has-base-background-color')) {
            tile.css('background-color', '#e0e0e0');
            tile.removeClass('has-base-background-color');
        }
        
        this._sequenceRenderer.draw(0);

        this._timeline.to(tile, {
            backgroundColor: '#212121',
            duration: 1
        });
        
        this._timeline.to(playhead, {
            frame: 15,
            ease: 'ease-in',
            scrollTrigger: {
                start: 0,
                trigger: '.tile.main',
                pin: true,
                end: "+=1500", // end after scrolling 500px beyond the start
                scrub: 0, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            },
            onUpdate: () => {
                console.log("update", playhead.frame);
                this._sequenceRenderer.draw(playhead.frame);
            }
        });

        $('.tile.main .fade-in').each((index, element) => {
            this._timeline.to(element, {
                opacity: 1, 
                scrollTrigger: {
                    start: 1500 * (index + 1),
                    trigger: '.tile.main',
                    pin: true,
                    end: `+=${1500 * (index + 2)}`, // end after scrolling 500px beyond the start
                    scrub: 0, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
                },
            })
        });
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