import gsap from 'gsap';

const MAX_LOAD_TICKS = 100;
const loader = {
    _bar: null,
    _label: null,

    _pageLoaded: false,

    _items: 0,
    _loadedItems: 0,

    _loadedTicks: 0,
    _tickInterval: null,

    _fadeIn() {
        console.log('[loader] fading...');
        gsap.timeline({
            onComplete: () => {
                console.log('[loader] fading complete');
                $(window).trigger('loader-faded');
            }
        })
        .to($('.loader .bar'), {        
            width: '100vw',
            height: '0%',
            maxWidth: '100vw',
            opacity: 0,
            duration: 0.5
        })
        .to($('.loader'), {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                $('.loader').css('display', 'none');
            }
        });
    },

    _refreshBar() {
        const perc = Math.min(100, ((this._loadedItems + this._loadedTicks) / (this._items + MAX_LOAD_TICKS)) * 100);
        gsap.to(this._bar, {
            width: `${perc}%`,
            ease: 'linear',
            onUpdate: () => {
                const current = parseFloat(this._bar.css('width').replace('px', ''));
                const max = parseFloat($('.loader .bar').css('width').replace('px', ''));
                const progress = current / max * 100;
                
                this._label.text(`${Math.floor(progress)}%`);
            },
            onComplete: () => {
                if(perc != 100) return;
                this._fadeIn();
            }
        });
    },

    _onLoadTick() {
        this._loadedTicks++;
        this._refreshBar();
        if(this._loadedTicks >= MAX_LOAD_TICKS) {
            if(this._tickInterval) clearInterval(this._tickInterval);
            this._tickInterval = null;
        }
        console.log(`[loader] marked ${this._loadedTicks} ticks as loaded`);
    },

    _onWindowLoad() {
        if(this._tickInterval) clearInterval(this._tickInterval);

        this._loadedTicks = MAX_LOAD_TICKS;
        this._pageLoaded = true;

        this._refreshBar();
        console.log(`[loader] marked page as loaded`);
    },

    markItemLoaded() {
        if(this._loadedItems > this._items) return;
        this._loadedItems++;
        this._refreshBar();
    },

    registerItems(count) {
        this._items += count;
    },

    register() {
        console.log('[loader] registering loader...');
        this._bar = $('.loader .bar .filler');
        this._label = $('.loader .bar p');
        $(window).on('load', () => this._onWindowLoad());

        this._tickInterval = setInterval(() => this._onLoadTick(), 150);
        
        console.log('[loader] loader registered');
    }
};

export default loader;