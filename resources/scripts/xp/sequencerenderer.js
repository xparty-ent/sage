import axios from "axios";

const zeroPad = (num, places) => String(num).padStart(places, '0');
const defer = (callback) => setTimeout(callback, 0);

class sequencerenderer extends EventTarget  {
    constructor(container, baseUrl) {
        super();
        this.container = container;
        this.baseUrl = baseUrl;

        this.manifest = null;
        this.images = null;
        this.queue = null;
        
        this.canvas = $('<canvas/>');
        this.container.append(this.canvas);

        this.context = this.canvas.get(0).getContext("2d");
        this.currentIndex = -1;
        this._onCanvasResize();

        $(window).on('resize', () => this._onCanvasResize());
    }

    _emit(name, obj) {
        const event = new CustomEvent(name, obj)
        this.dispatchEvent(event);
    }

    on(name, callback) {
        this.addEventListener(name, callback);
    }

    _onCanvasResize() {
        const w = this.container.width();
        const h = this.container.height();
        this.canvas.attr('width', `${w}px`);
        this.canvas.attr('height', `${h}px`);
        this._emit('resize', { width: w, height: h });

        console.log(`[sequencerenderer] canvas resized - ${w}x${h}`);
    }

    _getManifestUrl() {
        return `${this.baseUrl}seq-manifest.json`;
    }

    _loadManifest() {
        const manifestUrl = this._getManifestUrl();
        console.log(`[sequencerenderer] loading manifest from ${manifestUrl}...`);
        return new Promise((resolve, reject) => axios.get(manifestUrl).then(response => {
            const manifest = response.data;
            console.log(`[sequencerenderer] loaded manifest ${manifest.name}`);
            console.log(`[sequencerenderer] frames: ${manifest.frames.count}`);
            console.log(`[sequencerenderer] frames start offset: ${manifest.frames.start}`);
            console.log(`[sequencerenderer] frames digits: ${manifest.frames.digits}`);
            console.log(`[sequencerenderer] frames buffer: ${manifest.frames.buffer}`);
            console.log(`[sequencerenderer] frames extension: ${manifest.frames.extension}`);
            
            this.images = new Array(manifest.frames.count);
            this.queue = new Array(manifest.frames.count);

            for(var x = 0, index = 0; x < manifest.frames.buffer; x++) {
                for(var i = 0; i < manifest.frames.count / manifest.frames.buffer; i++, index++) {
                    const priority = manifest.frames.buffer * i + x;
                    if(priority >= manifest.frames.count) continue;
    
                    this.queue[index] = priority;
                }
            }

            this.manifest = manifest;
            this._emit('manifest-loaded', manifest);
            resolve(manifest);
        }));
    }

    _loadImage(index) {
        return new Promise((resolve, reject) => {
            const name = zeroPad(index, this.manifest.frames.digits);
            const file = `${name}.${this.manifest.frames.extension}`;
            const url = `${this.baseUrl}${file}`;
            
            console.log(`[sequencerenderer] loading frame ${index} as ${file}...`);
    
            defer(() => {
                const image = new Image;
                image.onload = () => resolve({ index, image });
                image.onerror = (e) => reject(e);
                image.src = url;
            });
        });
    }

    _loadImages() {
        let promises = [];

        console.log(this.queue);

        while(this.queue.length) {
            const index = this.queue.shift();
            const promise = this._loadImage(index)
                .then(data => {
                    this.images[data.index] = data.image;
                    const loadedImages = this.images.filter(image => image).length;
                    const imagesCount = this.images.length;
                    this._emit('image-loaded', loadedImages, imagesCount);
                });
            promises.push(promise);
        }

        return Promise.all(promises).then(() => {
            this._emit('images-loaded', this.images.length);
        });
    }

    draw(index) {
        index = Math.floor(index);

        if(!this.images === null || this.images[index] === null)
            return;

        if(this.currentIndex === index)
            return;

        this.currentIndex = index;

        const image = this.images[index];

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

    load() {
        this._loadManifest()
            .then(() => this._loadImages());

        /*
        defer(() => {
            this._loadManifest(baseUrl)
                .then(response => {
                    const manifest = response.data;

                    this._createPriorityQueue(manifest);

                    while(this._loadNextImage(baseUrl, manifest)) {}

                    console.log(`[sequencerenderer] queued frames load`);
                });
        });
        */
    }
};

export default sequencerenderer;