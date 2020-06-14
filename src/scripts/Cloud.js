import * as THREE from 'three';
import glslify from 'glslify';
import cloudVert from '../shaders/cloud.vert';
import cloudFrag from '../shaders/cloud.frag';

export default class Cloud {
    constructor(bgScene, bgCamera, pane, PARAMS) {
        this.bgScene = bgScene;
        this.bgCamera = bgCamera;
        this.pane = pane;
        this.PARAMS = PARAMS;

        this.loadTextures();
    }

    loadTextures() {
        this.loader = new THREE.TextureLoader();
        this.texturesLoaded = [false, false];



        this.loader.load('./1.jpg', texture => {
            this.texturesLoaded[0] = true;
            this.texture1 = texture;
            this.texture1.wrapS = THREE.RepeatWrapping;
            this.texture1.wrapT = THREE.RepeatWrapping;
            this.texture1.needsUpdate = true;


            if (this.texturesLoaded[0] && this.texturesLoaded[1]) this.init();
        });

        this.loader.load('./2.jpg', texture => {
            this.texturesLoaded[1] = true;
            this.texture2 = texture;
            this.texture2.wrapS = THREE.RepeatWrapping;
            this.texture2.wrapT = THREE.RepeatWrapping;
            this.texture2.needsUpdate = true;

            if (this.texturesLoaded[0] && this.texturesLoaded[1]) this.init();
        });
    }

    init() {
        this.geo = new THREE.PlaneBufferGeometry(1.0, 1.0, 5, 5);

        let myUniforms = {
            uTime: { value: 0 },
            uTxtShape: { value: this.texture1 },
            uTxtCloudNoise: { value: this.texture2 },
            uFac1: { value: 17.8 },
            uFac2: { value: 2.7 },
            uTimeFactor1: { value: 0.002 },
            uTimeFactor2: { value: 0.0015 },
            uDisplStrenght1: { value: 0.04 },
            uDisplStrenght2: { value: 0.08 },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        };

        this.mat = new THREE.ShaderMaterial({
            uniforms: {
                ...THREE.UniformsUtils.clone(THREE.ShaderLib.sprite.uniforms), ...myUniforms
            },
            vertexShader: cloudVert,
            fragmentShader: cloudFrag,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geo, this.mat);

        this.mesh.scale.set(200, 200, 1);
        this.mesh.position.set(-100, -100, 0);

        this.bgScene.add(this.mesh);
    }

    update(time) {
        if (this.mat) {
            this.mat.uniforms.uTime.value += 1;
        }
    }
}