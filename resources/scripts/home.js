import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type'
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';
import loader from '@scripts/loader';

const home = {
    _scrollMarkers: true,
    _sequenceRenderer: null,

    _mainTileTimeline: gsap.timeline(),

    _onImageLoading(e) {
        const { imageIndex, loadProgress } = e.detail;

        if(imageIndex) return;

    },

    _onSequenceImageLoaded(e) {
        const { loadedImages, imagesCount, imageIndex } = e.detail; 
        const loadedPercentage = Math.floor(loadedImages / imagesCount * 100);
        loader.markItemLoaded();

        console.log(`[home] loaded frame ${imageIndex}, loaded ${loadedImages}/${imagesCount} images, progress: ${loadedPercentage}%`);
        
        if(imageIndex == 0) {
            this._createRendererTimeline()
        }
    },

    _onSequenceImagesLoaded() {
        console.log('[home] sequence images loaded');
    },

    _createSequenceRenderer() {
        console.log(`[home] creating sequence renderer...`);
        const element = $('.tile.middle .renderer').first();
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

    
    _createRendererTimeline() {
        const tile = $('.tile.main');
        const scroll = $('.scroll');
        const prologue = $('.prologue');

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
        
        this._sequenceRenderer.draw(0);

        gsap.to(playhead, {
            frame: 69,
            ease: 'none',
            scrollTrigger: {
                start: "top top+=44",
                trigger: '.tile.middle',
                markers: this._scrollMarkers ? {startColor: "red", endColor: "red" } : false,
                pin: true,
                end: "bottom top",
                scrub: 0,
            },
            onUpdate: () => {
                console.log(`[home] drawing frame ${playhead.frame}`);
                this._sequenceRenderer.draw(playhead.frame);
            }
        });

    },

    createMainTileTimeline() {
        this._mainTileTimeline.to($('.tile.main .wp-block-cover div[role="img"]'), {
            scale: '1.0',
            ease: 'power4',
            duration: 1
        }, 0);
        
        this._mainTileTimeline.from($('.tile.main .wp-block-cover span'), {
            background: 'transparent',
            ease: 'power4',
            duration: 1
        }, 0);
        
        this._mainTileTimeline.to($('.tile.main .wp-block-cover p .split-line'), {
            y: 0,
            duration: 1.8,
            ease: "power4",
            stagger: 0.1
        });

        this._mainTileTimeline.to($('.tile.main .wp-block-cover .scroll'), {
            duration: 1,
            opacity: 1,
            ease: "power4"
        });

        this._mainTileTimeline.to($('.tile.main .wp-block-cover div[role="img"]'), {
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

        this._mainTileTimeline.pause();
    },

    onLoaderFaded() {
        window.scrollTo(0, 0);
        this._mainTileTimeline.play();
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
        this.createMainTileTimeline();

        this._createSequenceRenderer();
    }
};


domReady(() => {
    home.register();
    console.log('[home] registered');
});