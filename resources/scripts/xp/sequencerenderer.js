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

    static create(container, baseUrl) {
        return new sequencerenderer(container, baseUrl);
    }

    static create(container, baseUrl, manifest) {
        const renderer = new sequencerenderer(container, baseUrl);
        renderer.manifest = manifest;
        return renderer;
    }

    _emit(name, obj) {
        const event = new CustomEvent(name, { detail: obj });
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

    _fetchManifest() {
        const manifestUrl = this._getManifestUrl();
        console.log(`[sequencerenderer] loading manifest from ${manifestUrl}...`);

        return axios.get(manifestUrl);
    }

    _loadManifest() {
        return new Promise((resolve, reject) => {
            
            if(!this.manifest) {
                return this._fetchManifest().then(response => response.data);
            } else {
                console.log('[sequencerenderer] manifest already loaded');
                resolve(this.manifest);
            }
        }).then(manifest => {
            console.log(`[sequencerenderer] frames: ${manifest.frames.count}`);
            console.log(`[sequencerenderer] frames start offset: ${manifest.frames.start}`);
            console.log(`[sequencerenderer] frames digits: ${manifest.frames.digits}`);
            console.log(`[sequencerenderer] frames buffer: ${manifest.frames.buffer}`);
            console.log(`[sequencerenderer] frames extension: ${manifest.frames.extension}`);
            
            this.images = new Array(manifest.frames.count);
            this.queue = new Array(manifest.frames.count);

            for(var x = 0, index = 0; x < manifest.frames.buffer; x++) {
                for(var i = 0; i < manifest.frames.count / manifest.frames.buffer; i++, index++) {
                    const priority = (manifest.frames.buffer * i + x);
                    if(priority >= manifest.frames.count) continue;
    
                    this.queue[index] = priority + manifest.frames.start;

                    console.log(index, this.queue[index]);
                }
            }
            
            this.manifest = manifest;
            this._emit('manifest-loaded', manifest);
        });
    }

    _loadImage(index) {
        return new Promise((resolve, reject) => {
            const name = zeroPad(index, this.manifest.frames.digits);
            const file = `${name}.${this.manifest.frames.extension}`;
            const url = `${this.baseUrl}${file}`;
            
            console.log(`[sequencerenderer] loading frame ${index} as ${file}...`);
    
            defer(() => {
                const image = new Image;
                image.onload = () => {
                    console.log(image.complete);
                    resolve({ index, image });
                };
                image.onerror = (e) => reject(e);
                image.src = url;
            });
        });
    }

    _loadImages() {
        let loadImage = () => new Promise((resolve, reject) => {
            let index = this.queue.shift();
            if(index == null) {
                this._emit('images-loaded', this.images.length);
                resolve(null);
                return;
            }

            return this._loadImage(index)
                .then(data => {
                    this.images[data.index - this.manifest.frames.start] = data.image;
                    const loadedImages = this.images.filter(image => image).length;
                    const imagesCount = this.images.length;
                    this._emit('image-loaded', { loadedImages, imagesCount });
                    resolve(data.image);
                });
        });

        return loadImage()
            .then(image => {
                if(image)
                    return this._loadImages();
            });
    }

    _findNearestLoadedIndex(index) {
        let nearest = Math.floor(index);
        if(!this.images || !this.images.length) return null;

        for(let i = 0; i < this.images.length; i++) {
            if(!this.images[i]) continue;
            if(Math.abs(Math.abs(i) - Math.abs(index)) < nearest) nearest = i;
        }
        return nearest;
    }

    draw(index) {
        index = this._findNearestLoadedIndex(index);

        if(!index || this.currentIndex === index)
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
    }
};

export default sequencerenderer;