import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type'
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';
import loader from '@scripts/loader';

const home = {
    _scrollMarkers: false,
    _sequenceRenderer: null,

    _onImageLoading(e) {
        const { imageIndex, loadProgress } = e.detail;

        if(imageIndex) return;

    },

    _onSequenceImageLoaded(e) {
        const { loadedImages, imagesCount, imageIndex } = e.detail; 
        const loadedPercentage = Math.floor(loadedImages / imagesCount * 100);
        loader.markItemLoaded();

        console.log(`[home] loaded frame ${imageIndex}, loaded ${loadedImages}/${imagesCount} images, progress: ${loadedPercentage}%`);
        
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

        loader.registerItems(1);

        this._sequenceRenderer.load();

        this._sequenceRenderer.on('image-loading', e => this._onImageLoading(e));
        this._sequenceRenderer.on('image-loaded', e => this._onSequenceImageLoaded(e));
        this._sequenceRenderer.on('images-loaded', () => this._onSequenceImagesLoaded());
    },

    
    _createMainTileTimeline() {
        const tile = $('.tile.main');
        const canvas = $('.renderer canvas');
        const scroll = $('.scroll');
        const prologue = $('.prologue');
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

            if($(element).hasClass('has-contrast-background-color')) {
                $(element).css('background-color', '#bdbdbd');
                $(element).removeClass('has-contrast-background-color');
            }
        });
        
        // draw the first frame
        this._sequenceRenderer.draw(0);

        let timeline = gsap.timeline().to(canvas, {
            opacity: 1,
            duration: 0.5
        });
        
        let mainTimeline = gsap.timeline();


        /*

        timeline = gsap.timeline().to(scroll, {
            opacity: 0,
            scrollTrigger: {
                start: "top top",
                trigger: '.scroll',
                markers: this._scrollMarkers ? {startColor: "white", endColor: "white" } : false,
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
                markers: this._scrollMarkers ? {startColor: "red", endColor: "red" } : false,
                pin: false,
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
                markers: this._scrollMarkers ? { startColor: "blue", endColor: "blue" } : false,
                pin: true,
                end: "bottom top", // end after scrolling 500px beyond the start
                scrub: 0, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            }
        });

        $('.tile.main .fade-in').each((index, element) => {
            console.log($(element).text());
            const text = $(element).text().trim();
            timeline.to(element, {
                //opacity: 1, 
                yPercent: 10,
                //color: '#e0e0e0',
                text: {
                    value: text
                }
            });

            $(element).css('opacity', 1);
            $(element).text('');
        });

        timeline.to(playhead, {});
        mainTimeline.add(timeline, '>');
        
        
        
        timeline = gsap.timeline().fromTo(playhead,
            {
                frame: 30
            },
            {
                frame: 69,
                ease: 'none',
                scrollTrigger: {
                    start: "top top+=44",
                    trigger: '.tile.middle',
                    markers: this._scrollMarkers ? {startColor: "magenta", endColor: "magenta" } : false,
                    pin: true,
                    end: "bottom top",
                    scrub: 0,
                },
                onUpdate: () => {
                    console.log(`[home] drawing frame ${playhead.frame}`);
                    this._sequenceRenderer.draw(playhead.frame);
                }
            }
        );
        mainTimeline.add(timeline, '>');
        */
    },

    animateMainTile() {
        const timeline = gsap.timeline()
            .to($('.tile.main .wp-block-cover div[role="img"]'), {
                scale: '1.0',
                ease: 'power4',
                duration: 1
            });
        
        timeline.to($('.tile.main .wp-block-cover p .split-line'), {
            y: 0,
            duration: 1.8,
            ease: "power4",
            stagger: 0.1
        });

        timeline.to($('.tile.main .wp-block-cover .scroll'), {
            duration: 1,
            opacity: 1,
            ease: "power4"
        });

        gsap.to($('.tile.main .wp-block-cover div[role="img"]'), {
            backgroundPosition: "50% 0%",
            ease: "none",
            scrollTrigger: {
                trigger: '.tile.main .wp-block-cover',
                start: "top top+=44",
                end: "bottom top",
                markers: this._scrollMarkers ? {startColor: "magenta", endColor: "magenta" } : false,
                scrub: true,
            }, 
        });
    },

    onLoaderFaded() {
        window.scrollTo(0, 0);
        this.animateMainTile();
    },

    prepareElements() {
        $('.tile.main .wp-block-cover div[role="img"]').css('transform', 'scale(1.5)');
        $('.tile.main .wp-block-cover .scroll').css('opacity', 0);
        
        $('.tile.main .wp-block-cover p').each((index, element) => {
            const lines = new SplitType(element, { types: 'lines', lineClass: 'split-line' });
            lines.lines.forEach((line) => {
                const wrapper = $('<div/>').addClass('split-line-wrapper');
                $(line).detach().appendTo(wrapper);
                $(element).append(wrapper);
            });
        });

        $(window).on('loader-faded', () => this.onLoaderFaded());
    },
    
    register() {
        console.log("[home] registering home...")
        gsap.registerPlugin(ScrollTrigger);
        gsap.registerPlugin(TextPlugin);
        this.prepareElements();

        this._createSequenceRenderer();
    }
};


domReady(() => {
    home.register();
    console.log('[home] registered');
});