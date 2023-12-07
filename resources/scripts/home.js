import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';

const home = {
    _sequenceRenderer: null,

    _timeline: null,

    _createSequenceRenderer() {
        console.log(`[home] creating sequence renderer...`);
        const element = $('.renderer').first();
        this._sequenceRenderer = new xp.sequencerenderer(element);
        this._sequenceRenderer.load(window.home.mainSequence);
    },

    _createMainTileTimeline() {
        const playhead = { frame: 0 };
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
                this._sequenceRenderer.drawIndex('airpods-pro', playhead.frame)
            }
        });
    },

    _createTimeline() {
        this._timeline = gsap.timeline();

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