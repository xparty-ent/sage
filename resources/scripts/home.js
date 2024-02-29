import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type'
import domReady from '@roots/sage/client/dom-ready';
import xp from '@scripts/xp';
import loader from '@scripts/loader';
import axios from 'axios';

const home = {
    //_CRMDeploymentID: "AKfycbza4mWbsR_7rqyMWoLkpM7oTCZ76rNI22qMMd9Yh5dUskq8IgpRMumvdHdMZX_NebmGGw",

    _scrollMarkers: false,
    _sequenceRenderer: null,

    _mainTileTimeline: null,
    _middleTileTimeline: null,
    _lastTileTimeline: null,

    _onImageLoading(e) {
        const { imageIndex, loadProgress } = e.detail;

        if(imageIndex) return;

    },

    _onSequenceImageLoaded(e) {
        const { loadedImages, imagesCount, imageIndex } = e.detail; 
        const loadedPercentage = Math.floor(loadedImages / imagesCount * 100);
        loader.markItemLoaded();
        
        if(!imageIndex) {
            this._sequenceRenderer.draw(0);
            console.log(`[home] drawn first frame, renderer ready`);
        }

        console.log(`[home] loaded frame ${imageIndex}, loaded ${loadedImages}/${imagesCount} images, progress: ${loadedPercentage}%`);

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

    
    _createMiddleTileTimeline() {
        const playhead = { 
            frame: 0 
        };

        let currentProgress = 0;

        let printProgress = (type, progress) => {
            let current = currentProgress;
            let newProgress = Math.floor(progress * 100);

            if(current === newProgress) return;
            currentProgress = newProgress;

            console.log(`[home] [middle-tile] updated ${type} tween progress to ${newProgress} / 100`);
        } 

        this._middleTileTimeline = gsap.timeline({
            scrollTrigger: {
                start: "top top+=44",
                trigger: '.tile.middle',
                markers: this._scrollMarkers ? {startColor: "red", endColor: "red" } : false,
                pin: true,
                end: "bottom+=3000 top",
                preventOverlaps: false,
                scrub: true
                /*
                snap: {
                    snapTo: "labelsDirectional",
                    directional: true,
                    duration: { min: 1, max: 3 },
                    delay: 0,
                    ease: "power1.inOut",
                  },
                */
            }
        })
        .addLabel("start", ">")
        .to($('.tile.middle .renderer .overlay'), {
            opacity: 0,
            ease: 'linear',
            duration: 10,
            onUpdate: function() {
                printProgress('renderer overlay disappear', this.progress());
                $('.tile.middle .renderer .overlay').css('opacity', 1 - this.progress());
            }
        })
        .to(playhead, {
            frame: 69,
            ease: 'linear',
            duration: 40,
            onUpdate: () => {
                const newIndex = Math.floor(playhead.frame);
                const currentIndex = this._sequenceRenderer.getCurrentIndex();

                if(newIndex === currentIndex) return;

                console.log(`[home] drawing middle tile frame ${currentIndex} -> ${newIndex}`);
                this._sequenceRenderer.draw(newIndex);
                const progress = playhead.frame / 69;
                gsap.to($('.tile.middle .renderer .bar'), {
                    width: `${Math.floor(progress * 100)}%`
                });
            }
        })
        .to($('.tile.middle .renderer .overlay'), {
            opacity: 1,
            ease: 'linear',
            duration: 10,
            onUpdate: function() {
                printProgress('renderer overlay disappear', this.progress());
                $('.tile.middle .renderer .overlay').css('opacity', this.progress());
            }
        })

        .addLabel("stage-2", ">")
        .to($('.tile.middle h2 .split-line'), {
            y: 0,
            ease: "power4",
            stagger: 0.1,
            duration: 20,
            onUpdate: function() {
                printProgress('h2 split line appear', this.progress());
            }
        })
        .to($('.tile.middle .wp-block-column'), {
                opacity: 1,
                ease: "power4",
                duration: 20,
                onUpdate: function() {
                    printProgress('info block appear', this.progress());
                }
        })
        .addLabel("stage-3", ">");
    },

    _createLastTileTimeline() {
        this._lastTileTimeline = gsap.timeline()
            .to($('.tile.last .wp-block-cover span'), {
                opacity: 0.65,
                duration: 0.1,
                scrollTrigger: {
                    start: "top top+=44",
                    trigger: '.tile.last',
                    markers: this._scrollMarkers ? {startColor: "green", endColor: "green" } : false,
                    pin: true,
                    end: "bottom top",
                    scrub: true,
                }
            });
    },

    _createMainTileTimeline() {
        this._mainTileTimeline = gsap.timeline();

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

        /*
        this._mainTileTimeline.to($('.tile.main .wp-block-cover div[role="img"]'), {
            backgroundPosition: "50% 0%",
            ease: "none",
            scrollTrigger: {
                trigger: '.tile.main .wp-block-cover',
                start: "top top+=44",
                end: "bottom top",
                markers: this._scrollMarkers ? {startColor: "magenta", endColor: "magenta" } : false,
                scrub: false,
            }, 
        });
        */

        this._mainTileTimeline.pause();
    },

    _onLoaderFaded() {
        window.scrollTo(0, 0);
        this._mainTileTimeline.play();
        $('.tile.middle .renderer .overlay').css('background-color', $('.tile.middle').css('background-color'));
    },

    _prepareElements() {
        if($('.tile.main').hasClass('has-base-background-color')) {
            $('.tile.main').css('background-color', '#e0e0e0');
            $('.tile.main').removeClass('has-base-background-color');
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
        
        $('.tile.middle h2').each((index, element) => {
            const lines = new SplitType(element, { types: 'lines', lineClass: 'split-line' });
            lines.lines.forEach((line) => {
                const wrapper = $('<div/>').addClass('split-line-wrapper');
                $(line).detach().appendTo(wrapper);
                $(element).append(wrapper);
            });
        });

        $('.tile.middle .wp-block-column').css('opacity', 0);

        $('.tile.last .wp-block-cover span').css('opacity', 1);

        $(window).on('loader-faded', () => this._onLoaderFaded());
    },

    /*_prepareCRMForm() {
        console.log('[home] preparing CRM form...');
        axios.get(`https://script.google.com/macros/s/${this._CRMDeploymentID}/exec`)
            .then(response => {
                if(!response.data.success) {
                    console.error('[home] failed to load CRM info!');
                    return;
                }
                console.log(`[home] retrieved CRM reCAPTCHA key: ${response.data.recaptcha_site_key}`);
                console.log(`[home] retrieved CRM reCAPTCHA script url: ${response.data.recaptcha_js_script_url}`);
                console.log(`[home] retrieved CRM reCAPTCHA snippet: ${response.data.recaptcha_js_script_snippet}`);

                console.log(`[home] creating reCAPTCHA script element...`);
                var script = $('<script/>', {
                    id: 'recaptcha-script',
                    src: response.data.recaptcha_js_script_url
                });

                console.log("[home] appending reCAPTCHA script element...");
                $('body').append(script);
                
                console.log("[home] reCAPTCHA script element appended");

                console.log("[home] appending CRM form...");
                $('.crm-placeholder').append(response.data.form_html);

            })
            .catch(() => {
                console.error('[home] failed to load CRM info!');
            });
    },*/

    register() {
        console.log("[home] registering home...")
        gsap.registerPlugin(ScrollTrigger);
        gsap.registerPlugin(TextPlugin);
       // this._prepareCRMForm();
        this._prepareElements();
        this._createSequenceRenderer();

        this._createMainTileTimeline();
        this._createMiddleTileTimeline();
        this._createLastTileTimeline();

    }
};


domReady(() => {
    home.register();
    console.log('[home] registered');
});