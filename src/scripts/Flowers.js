import * as THREE from 'three';
import glslify from 'glslify';
import basicDiffuseVert from '../shaders/basicDiffuse.vert';
import basicDiffuseFrag from '../shaders/basicDiffuse.frag';
import { ToonShader, ToonShader1, ToonShader2, ToonShaderHatching, ToonShaderDotted } from 'three/examples/jsm/shaders/ToonShader'
import customToonFrag from '../shaders/customToon.frag';
import customToonVert from '../shaders/customToon.vert';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import fitPlaneToScreen from './utils/fitPlaneToScreen';
import flowerVert from '../shaders/flower.vert';
import flowerFrag from '../shaders/flower.frag';


export default class Flower {

    constructor(bgScene, bgCamera, pane, PARAMS) {
        this.bgScene = bgScene;
        this.bgCamera = bgCamera;
        this.pane = pane;
        this.PARAMS = PARAMS;
        this.items = [];
        this.dummy = new THREE.Object3D();

        this.numClones = 3;

        this.dim = fitPlaneToScreen(this.bgCamera, -50, window.innerWidth, window.innerHeight);


        this.loader = new GLTFLoader();

        this.initPane();
        this.loadMeshes();


    }

    initPane() {
        this.PARAMS.mod1 = 0.0;
        this.PARAMS.mod2 = 0.0;

        this.pane.addInput(this.PARAMS, 'mod1', {
            min: -1.0,
            max: 1.0
        }).on('change', value => {
            this.items.forEach(item => {
                item.material.uniforms.mod1.value = value;
            });
        });

        this.pane.addInput(this.PARAMS, 'mod2', {
            min: -1.0,
            max: 1.0
        }).on('change', value => {
            this.items.forEach(item => {
                item.material.uniforms.mod2.value = value;
            });
        });
    }

    loadMeshes() {
        const urls = ['./flower1.glb', './flower2.glb', './flower3.glb', './flower4.glb', './flower5.glb', './flower6.glb', './leaf1.glb'];

        // const urls = ['./flower6.glb'];

        urls.forEach(url => {

            this.loader.load(url, obj => {
                let mesh = obj.scene.children[0];
                // debugger;
                console.log('mesh:  ', mesh);

                mesh.material = new THREE.ShaderMaterial({
                    uniforms: {
                        time: {
                            value: 0.0
                        },
                        worldPos: {
                            value: new THREE.Vector3(0, 0, 0)
                        },
                        mouse: {
                            value: new THREE.Vector2(0, 0, 0)
                        },
                        resolution: {
                            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                        },
                        mod1: {
                            value: this.PARAMS.mod1
                        },
                        mod2: {
                            value: this.PARAMS.mod2
                        },
                        dimWidth: {
                            value: new THREE.Vector2(this.dim.width / 2 * -1, this.dim.width / 2)
                        }
                    },
                    vertexShader: flowerVert,
                    fragmentShader: flowerFrag,
                    side: THREE.DoubleSide
                });

                // mesh.geometry = new THREE.OctahedronBufferGeometry(1);

                // add barycentric coords attribute
                let pos = mesh.geometry.attributes.position;
                let count = pos.length / 3;

                let bary = [];

                for (let i = 0; i < count; i++) {
                    bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0);
                }

                bary = new Float32Array(bary);
                mesh.geometry.setAttribute('barycentric', new THREE.BufferAttribute(bary, 3));

                mesh.material.needsUpdate = true;
                mesh.geometry.needsUpdate = true;


                this.randomPos(mesh.position);
                this.randomRot(mesh.rotation);
                this.randomScale(mesh.scale);
                this.items.push(mesh);
                this.bgScene.add(mesh);


                for (let i = 0; i < this.numClones; i++) {
                    let clone;
                    clone = mesh.clone();
                    this.randomPos(clone.position);
                    this.randomRot(clone.rotation);
                    this.randomScale(clone.scale);
                    this.items.push(clone);
                    this.bgScene.add(clone);

                }
            })
        })
    }



    randomScale(scale) {
        const scaleSpread = 1.0;
        const scaleMin = 2;

        scale.set(Math.random() * scaleSpread + scaleMin, Math.random() * scaleSpread + scaleMin, Math.random() * scaleSpread + scaleMin);
    }

    randomPos(position) {
        const xSpread = this.dim.width;
        const zSpread = THREE.Math.mapLinear(Math.random(), 0.0, 1.0, -200, 200);
        const yPos = THREE.Math.mapLinear(Math.random(), 0.0, 1.0, (-this.dim.height / 2) * 0.35, (this.dim.height / 2) * 0.35);

        position.set(Math.random() * xSpread - (xSpread / 2), yPos, Math.random() * zSpread);

    }

    randomRot(rotation) {
        rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    }

    addGUI() {
        this.PARAMS.flower = {
            petalRotX: 0.0,
            petalRotY: 0.0,
            petalRotZ: 0.0
        };

        this.flowerPane = this.pane.addFolder({
            title: 'flower'
        });

        this.flowerPane.addInput(this.PARAMS.flower, 'petalRotX', {
            min: -10.0,
            max: 10.0
        }).on('change', value => {
            for (let i = 0; i < this.numPetals; i++) {
                this.petals[i].rotation.x = value;
            }
        });

    }

    addEvents() {

    }









    update(time, mouse) {
        this.items.forEach(item => {
            item.position.x += 2;

            item.rotation.x += 0.01;
            item.rotation.z += 0.02;



            item.material.uniforms.time.value = time;
            item.material.uniforms.worldPos.value = item.position;
            item.material.uniforms.mouse.value = mouse;

            if (item.position.x > this.dim.width * 0.5) {
                item.position.x = -this.dim.width * 0.5;
            }
        });

    }
}