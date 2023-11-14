
// import three classes
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Scene } from 'three/src/scenes/Scene.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Vector2 } from 'three/src/math/Vector2.js';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js';

class model {
    constructor(gltf) {
        this.gltf = gltf;
    }

    getSize(camera) {
        var vector = new Vector3();

        var widthHalf = 0.5;
        var heightHalf = 0.5;
    
        this.gltf.scene.updateMatrixWorld();
        vector.setFromMatrixPosition(this.gltf.scene.matrixWorld);
        vector.project(camera);
    
        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;
    
        return { 
            x: vector.x,
            y: vector.y
        };
    
    }
}

class scene {
    constructor(element) {
        this.element = $(element);
        this.width = this.element.width();
        this.height = this.element.height();
        this.loader = new GLTFLoader();
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(1, this.width / this.height, 0.1, 100000);
        //this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0.1, 100000);

        this.renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            precision: "highp",
            powerPreference: "high-performance"
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.element.append(this.renderer.domElement);
        
        this.light = new DirectionalLight(0xff0000, 1);
        this.scene.add(this.light);
        

        this.onResize();
        this.render();
    }

    getWorldSize() {
        const fov = (this.camera.fov * Math.PI) / 180;
        const h = 2 * Math.tan(fov / 2) * Math.abs(this.camera.position.z);
        return new Vector2(
            h * this.camera.aspect,
            h
        );
    }

    onResize() {
        this.width = this.element.width();
        this.height = this.element.height();

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        $(this.render.domElement).width(this.width);
        $(this.render.domElement).height(this.height);
    
        this.renderer.setSize(this.width, this.height, false);
    }

    render() {
        if(this.width != this.element.width() || this.height != this.element.height())
            this.onResize();
        
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.render());
    }

    loadModel(path) {
        return new Promise((resolve, reject) => {
            this.loader.load(path, gltf => {
                if(!gltf) {
                    reject();
                    return;
                }

                resolve(new model(gltf));
            });
        });
    }

    addModel(path) {
        return new Promise((resolve) => {
            this.loadModel(path).then(model => {
                this.scene.add(model.gltf.scene);
                resolve(model);
            });
        });
    }
}

const renderer = {
    create(element) {
        return new scene(element);
    }
};

export default renderer;