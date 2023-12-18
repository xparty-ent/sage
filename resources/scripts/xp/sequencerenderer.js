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
            const buffersCount = Math.floor(manifest.frames.count / manifest.frames.buffer + !!(manifest.frames.count % manifest.frames.buffer));

            console.log(`[sequencerenderer] frames: ${manifest.frames.count}`);
            console.log(`[sequencerenderer] frames start offset: ${manifest.frames.start}`);
            console.log(`[sequencerenderer] frames digits: ${manifest.frames.digits}`);
            console.log(`[sequencerenderer] frames buffer: ${manifest.frames.buffer}`);
            console.log(`[sequencerenderer] frames buffers count: ${buffersCount}`);
            console.log(`[sequencerenderer] frames extension: ${manifest.frames.extension}`);
            
            this.images = new Array(manifest.frames.count);
            this.queue = new Array(manifest.frames.count);

            for(var buffer = 0, index = 0; buffer < buffersCount; buffer++) {
                for(var position = 0; position < manifest.frames.buffer; position++) {
                    const priority = (buffersCount * position + buffer);
                    if(priority >= manifest.frames.count) continue;

                    this.queue[index++] = priority + manifest.frames.start;
                }
            }

            /*
            for(var x = 0, index = 0; x < manifest.frames.buffer; x++) {
                for(var i = 0; i < manifest.frames.count / manifest.frames.buffer; i++, index++) {
                    const priority = (manifest.frames.buffer * i + x);
                    if(priority >= manifest.frames.count) continue;
    
                    this.queue[index] = priority + manifest.frames.start;
                }
            }
            */

            console.log(this.queue);
            
            this.manifest = manifest;
            this._emit('manifest-loaded', manifest);
        });
    }

    _imageAjax

    _loadImage(index) {
        return new Promise((resolve, reject) => {
            const name = zeroPad(index, this.manifest.frames.digits);
            const file = `${name}.${this.manifest.frames.extension}`;
            const url = `${this.baseUrl}${file}`;
            const imageIndex = index - this.manifest.frames.start;
            
            console.log(`[sequencerenderer] loading frame ${index} as ${file}...`);

            let http = new XMLHttpRequest();
            http.open('GET', url, true);
            http.responseType = 'arraybuffer';
            http.onerror = (e) => reject(e);
            http.onloadstart = () => this._emit('image-loading', { imageIndex, loadProgress: 0 });
            http.onprogress = (e) => this._emit('image-loading', { imageIndex, loadProgress: parseInt((e.loaded / e.total) * 100) });
            http.onload = () => {
                let blob = new Blob([http.response]);
                const image = new Image;
                image.onerror = (e) => reject(e);
                image.onload = () => {
                    if(!image.complete) return;
                    resolve({ index, image });
                };
                image.src = window.URL.createObjectURL(blob);
            };

            http.send();
        });
    }

    _loadImages() {
        let loadImage = () => new Promise((resolve, reject) => {
            let index = this.queue.shift();
            if(index == null) {
                console.log(this.images);
                this._emit('images-loaded', this.images.length);
                resolve(null);
                return;
            }

            return this._loadImage(index)
                .then(data => {
                    const imageIndex = data.index - this.manifest.frames.start;
                    this.images[imageIndex] = data.image;
                    const loadedImages = this.images.filter(image => image).length;
                    const imagesCount = this.images.length;
                    this._emit('image-loaded', { loadedImages, imagesCount, imageIndex });
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
        if(!this.images || !this.images.length) return null;

        let nearest = Math.floor(index);
        let distance = this.images.length + 1;

        for(let i = 0; i < this.images.length; i++) {
            if(!this.images[i]) continue;
            if(Math.abs(i - index) >= distance) continue;
            
            distance = Math.abs(i - index);
            nearest = i;
        }
        
        return nearest;
    }

    draw(index) {
        index = this._findNearestLoadedIndex(index);

        if(index === null || this.currentIndex === index)
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