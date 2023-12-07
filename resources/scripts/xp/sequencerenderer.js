import axios from "axios";

const zeroPad = (num, places) => String(num).padStart(places, '0');
const defer = (callback) => setTimeout(callback, 0);

class sequencerenderer {
    constructor(container) {
        this.container = container;
        
        this.canvas = $('<canvas/>');
        this.container.append(this.canvas);

        this.context = this.canvas.get(0).getContext("2d");
        this.currentIndex = -1;
        this.currentManifest = null;
        this.sequences = {};

        this._onCanvasResize();
        $(window).on('resize', () => this._onCanvasResize());
    }

    _onCanvasResize() {
        const w = this.container.width();
        const h = this.container.height();
        this.canvas.attr('width', `${w}px`);
        this.canvas.attr('height', `${h}px`);
        this.drawIndex(this.currentManifest, this.currentIndex);

        console.log(`[sequencerenderer] canvas resized - ${w}x${h}`);
    }

    _getManifestUrl(baseUrl) {
        return `${baseUrl}seq-manifest.json`;
    }

    _loadManifest(baseUrl) {
        const manifestUrl = this._getManifestUrl(baseUrl);
        console.log(`[sequencerenderer] loading manifest from ${manifestUrl}...`);
        return axios.get(this._getManifestUrl(baseUrl));
    }

    _onImageLoaded(manifest, index, image) {
        console.log(`[sequencerenderer] loaded image ${index} for manifest ${manifest.name}`);
        this.sequences[manifest.name].images[index] = image;

        if(!this.currentIndex && !this.currentManifest) {
            this.drawIndex(manifest.name, index);
        }
    }

    _loadNextImage(baseUrl, manifest) {
        if(!this.sequences[manifest.name].queue.length) {
            console.log('[sequencerenderer] sequence loading complete');
            return null;
        }

        const index = this.sequences[manifest.name].queue.shift();

        const name = zeroPad(index, manifest.frames.digits);
        const file = `${name}.${manifest.frames.extension}`;
        const url = `${baseUrl}${file}`;
        
        console.log(`[sequencerenderer] loading frame ${index} as ${file}...`);

        const image = new Image;
        image.onload = () => this._onImageLoaded(manifest, index, image);
        image.src = url;

        return image;
    }

    _createPriorityQueue(manifest) {
        let index = 0;
        for(var x = 0; x < manifest.frames.buffer; x++) {
            for(var i = 0; i < manifest.frames.count / manifest.frames.buffer; i++) {
                const priority = manifest.frames.buffer * i + x;
                if(priority >= manifest.frames.count) continue;

                this.sequences[manifest.name].queue[index++] = priority;
            }
        }
    }

    drawIndex(name, index) {
        index = Math.floor(index);

        if(!this.sequences.hasOwnProperty(name) || this.sequences[name].images === null || this.sequences[name].images[index] === null)
            return;

        if(this.currentManifest === name && this.currentIndex === index)
            return;

        this.currentManifest = name;
        this.currentIndex = index;

        const image = this.sequences[name].images[index];

        const w = this.canvas.width();
        const h = this.canvas.height();

        var iw = image.width,
            ih = image.height,
            r = Math.min(w / iw, h / ih),
            nw = iw * r,   // new prop. width
            nh = ih * r,   // new prop. height
            cx, cy, cw, ch, ar = 1;
  
        // decide which gap to fill    
        if (nw < w) ar = w / nw;                             
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
        nw *= ar;
        nh *= ar;
  
        // calc source rectangle
        cw = iw / (nw / w);
        ch = ih / (nh / h);
  
        cx = (iw - cw) * 0.5;
        cy = (ih - ch) * 0.5;
  
        // make sure source rectangle is valid
        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;


        this.context.clearRect(0, 0, w, h);
        this.context.drawImage(image, cx, cy, cw, ch, 0, 0, w, h);
        
    }

    load(baseUrl) {
        if(!baseUrl.endsWith('/'))
            baseUrl += '/';

        defer(() => {
            this._loadManifest(baseUrl)
                .then(response => {
                    const manifest = response.data;
                    console.log(`[sequencerenderer] loaded manifest ${manifest.name}`);
                    console.log(`[sequencerenderer] frames: ${manifest.frames.count}`);
                    console.log(`[sequencerenderer] frames start offset: ${manifest.frames.start}`);
                    console.log(`[sequencerenderer] frames digits: ${manifest.frames.digits}`);
                    console.log(`[sequencerenderer] frames buffer: ${manifest.frames.buffer}`);
                    console.log(`[sequencerenderer] frames extension: ${manifest.frames.extension}`);

                    this.sequences[manifest.name] = {};
                    this.sequences[manifest.name].manifest = manifest;
                    this.sequences[manifest.name].images = new Array(manifest.frames.count);
                    this.sequences[manifest.name].queue = new Array(manifest.frames.count);

                    this._createPriorityQueue(manifest);

                    while(this._loadNextImage(baseUrl, manifest)) {}

                    console.log(`[sequencerenderer] queued frames load`);
                });
        });
    }
};

export default sequencerenderer;