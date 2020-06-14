import * as THREE from 'three';
import glslify from 'glslify';
import basicDiffuseVert from '../shaders/basicDiffuse.vert';
import basicDiffuseFrag from '../shaders/basicDiffuse.frag';
import { ToonShader, ToonShader1, ToonShader2, ToonShaderHatching, ToonShaderDotted } from 'three/examples/jsm/shaders/ToonShader'
import customToonFrag from '../shaders/customToon.frag';
import customToonVert from '../shaders/customToon.vert';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import fitPlaneToScreen from './utils/fitPlaneToScreen';



export default class Flower {

    constructor(bgScene, bgCamera, pane, PARAMS) {
        this.bgScene = bgScene;
        this.bgCamera = bgCamera;
        this.pane = pane;
        this.PARAMS = PARAMS;
        this.items = [];
        this.dummy = new THREE.Object3D();

        this.numClones = 10;

        this.dim = fitPlaneToScreen(this.bgCamera, -50, window.innerWidth, window.innerHeight);


        this.loader = new GLTFLoader();

        this.loadFlower1();
        this.loadFlower2();
        this.loadFlower3();
        this.loadFlower4();
        this.loadFlower5();
        this.loadFlower6();

        this.loadLeaf1();


    }

    loadLeaf1() {
        this.loader.load('./leaf1.glb', obj => {
            // debugger;
            let flower = obj.scene.children[0];
            // flower.add(new THREE.AxesHelper());

            // setup geo
            // flower.children[0].geometry.translate(0, 3.8, 0);
            // flower.children[1].geometry.translate(0, 3.8, 0);
            // flower.children[2].geometry.translate(0, 3.8, 0);

            // setup material
            flower.material = new THREE.MeshBasicMaterial({
                color: flower.material.color,
                side: THREE.DoubleSide
            });
            flower.material.needsUpdate = true;

            // flower.children[1].material = new THREE.MeshBasicMaterial({
            //     color: flower.children[1].material.color,
            //     side: THREE.DoubleSide
            // });
            // flower.children[1].material.needsUpdate = true;

            // flower.children[2].material = new THREE.MeshBasicMaterial({
            //     color: flower.children[2].material.color,
            //     side: THREE.DoubleSide
            // });
            // flower.children[2].material.needsUpdate = true;

            // flower.children[3].material = new THREE.MeshBasicMaterial({
            //     color: flower.children[3].material.color,
            //     side: THREE.DoubleSide
            // });
            // flower.children[3].material.needsUpdate = true;



            this.randomPos(flower.position);
            this.randomRot(flower.rotation);
            this.randomScale(flower.scale);
            this.items.push(flower);
            this.bgScene.add(flower);


            for (let i = 0; i < this.numClones; i++) {
                let clone;
                clone = flower.clone();
                this.randomPos(clone.position);
                this.randomRot(clone.rotation);
                this.randomScale(clone.scale);
                this.items.push(clone);
                this.bgScene.add(clone);

            }


        });
    }

    loadFlower6() {
        this.loader.load('./flower6.glb', obj => {
            let flower = obj.scene.children[0];
            // flower.add(new THREE.AxesHelper());

            // setup geo
            // flower.children[0].geometry.translate(0, 3.8, 0);
            // flower.children[1].geometry.translate(0, 3.8, 0);
            // flower.children[2].geometry.translate(0, 3.8, 0);

            // setup material
            flower.children[0].material = new THREE.MeshBasicMaterial({
                color: flower.children[0].material.color,
                side: THREE.DoubleSide
            });
            flower.children[0].material.needsUpdate = true;

            flower.children[1].material = new THREE.MeshBasicMaterial({
                color: flower.children[1].material.color,
                side: THREE.DoubleSide
            });
            flower.children[1].material.needsUpdate = true;

            flower.children[2].material = new THREE.MeshBasicMaterial({
                color: flower.children[2].material.color,
                side: THREE.DoubleSide
            });
            flower.children[2].material.needsUpdate = true;

            // flower.children[3].material = new THREE.MeshBasicMaterial({
            //     color: flower.children[3].material.color,
            //     side: THREE.DoubleSide
            // });
            // flower.children[3].material.needsUpdate = true;



            this.randomPos(flower.position);
            this.randomRot(flower.rotation);
            this.randomScale(flower.scale);
            this.items.push(flower);
            this.bgScene.add(flower);

            for (let i = 0; i < this.numClones; i++) {
                let clone;
                clone = flower.clone();
                this.randomPos(clone.position);
                this.randomRot(clone.rotation);
                this.randomScale(clone.scale);
                this.items.push(clone);
                this.bgScene.add(clone);

            }
        });
    }

    loadFlower5() {
        this.loader.load('./flower5.glb', obj => {
            let flower = obj.scene.children[0];
            // flower.add(new THREE.AxesHelper());

            // setup geo
            // flower.children[0].geometry.translate(0, 3.8, 0);
            // flower.children[1].geometry.translate(0, 3.8, 0);
            // flower.children[2].geometry.translate(0, 3.8, 0);

            // setup material
            flower.children[0].material = new THREE.MeshBasicMaterial({
                color: flower.children[0].material.color,
                side: THREE.DoubleSide
            });
            flower.children[0].material.needsUpdate = true;

            flower.children[1].material = new THREE.MeshBasicMaterial({
                color: flower.children[1].material.color,
                side: THREE.DoubleSide
            });
            flower.children[1].material.needsUpdate = true;

            flower.children[2].material = new THREE.MeshBasicMaterial({
                color: flower.children[2].material.color,
                side: THREE.DoubleSide
            });
            flower.children[2].material.needsUpdate = true;

            // flower.children[3].material = new THREE.MeshBasicMaterial({
            //     color: flower.children[3].material.color,
            //     side: THREE.DoubleSide
            // });
            // flower.children[3].material.needsUpdate = true;




            this.randomPos(flower.position);
            this.randomRot(flower.rotation);
            this.randomScale(flower.scale);
            this.items.push(flower);
            this.bgScene.add(flower);

            for (let i = 0; i < this.numClones; i++) {
                let clone;
                clone = flower.clone();
                this.randomPos(clone.position);
                this.randomRot(clone.rotation);
                this.randomScale(clone.scale);
                this.items.push(clone);
                this.bgScene.add(clone);

            }
        });
    }

    loadFlower4() {
        this.loader.load('./flower4.glb', obj => {
            let flower = obj.scene.children[0];
            // flower.add(new THREE.AxesHelper());
            // debugger;

            // setup geo
            // flower.children[0].geometry.translate(0, 3.8, 0);
            // flower.children[1].geometry.translate(0, 3.8, 0);
            // flower.children[2].geometry.translate(0, 3.8, 0);

            // setup material
            flower.children[0].material = new THREE.MeshBasicMaterial({
                color: flower.children[0].material.color,
                side: THREE.DoubleSide
            });
            flower.children[0].material.needsUpdate = true;

            flower.children[1].material = new THREE.MeshBasicMaterial({
                color: flower.children[1].material.color,
                side: THREE.DoubleSide
            });
            flower.children[1].material.needsUpdate = true;

            flower.children[2].material = new THREE.MeshBasicMaterial({
                color: flower.children[2].material.color,
                side: THREE.DoubleSide
            });
            flower.children[2].material.needsUpdate = true;

            flower.children[3].material = new THREE.MeshBasicMaterial({
                color: flower.children[3].material.color,
                side: THREE.DoubleSide
            });
            flower.children[3].material.needsUpdate = true;






            this.randomPos(flower.position);
            this.randomRot(flower.rotation);
            this.randomScale(flower.scale);
            this.items.push(flower);
            this.bgScene.add(flower);

            for (let i = 0; i < this.numClones; i++) {
                let clone;
                clone = flower.clone();
                this.randomPos(clone.position);
                this.randomRot(clone.rotation);
                this.randomScale(clone.scale);
                this.items.push(clone);
                this.bgScene.add(clone);

            }
        });
    }

    loadFlower3() {
        this.loader.load('./flower3.glb', obj => {
            let flower = obj.scene.children[0];
            // flower.add(new THREE.AxesHelper());

            // setup geo
            flower.children[0].geometry.translate(0, 3.8, 0);
            flower.children[1].geometry.translate(0, 3.8, 0);
            flower.children[2].geometry.translate(0, 3.8, 0);

            // setup material
            flower.children[0].material = new THREE.MeshBasicMaterial({
                color: flower.children[0].material.color,
                side: THREE.DoubleSide
            });
            flower.children[0].material.needsUpdate = true;

            flower.children[1].material = new THREE.MeshBasicMaterial({
                color: flower.children[1].material.color,
                side: THREE.DoubleSide
            });
            flower.children[1].material.needsUpdate = true;

            this.randomPos(flower.position);
            this.randomRot(flower.rotation);
            this.randomScale(flower.scale);
            this.items.push(flower);
            this.bgScene.add(flower);

            for (let i = 0; i < this.numClones; i++) {
                let clone;
                clone = flower.clone();
                this.randomPos(clone.position);
                this.randomRot(clone.rotation);
                this.randomScale(clone.scale);
                this.items.push(clone);
                this.bgScene.add(clone);

            }
        });
    }

    loadFlower2() {
        this.loader.load('./flower2.glb', obj => {
            let flower = obj.scene.children[0];
            // flower.add(new THREE.AxesHelper());

            // setup geo
            flower.children[0].geometry.translate(0, 3.8, 0);
            flower.children[1].geometry.translate(0, 3.8, 0);
            flower.children[2].geometry.translate(0, 3.8, 0);

            // setup material
            flower.children[0].material = new THREE.MeshBasicMaterial({
                color: flower.children[0].material.color,
                side: THREE.DoubleSide
            });
            flower.children[0].material.needsUpdate = true;

            flower.children[1].material = new THREE.MeshBasicMaterial({
                color: flower.children[1].material.color,
                side: THREE.DoubleSide
            });
            flower.children[1].material.needsUpdate = true;

            this.randomPos(flower.position);
            this.randomRot(flower.rotation);
            this.randomScale(flower.scale);
            this.items.push(flower);
            this.bgScene.add(flower);

            for (let i = 0; i < this.numClones; i++) {
                let clone;
                clone = flower.clone();
                this.randomPos(clone.position);
                this.randomRot(clone.rotation);
                this.randomScale(clone.scale);
                this.items.push(clone);
                this.bgScene.add(clone);

            }
        });
    }

    loadFlower1() {
        this.loader.load('./flower1.glb', obj => {
            let flower = obj.scene.children[0];
            // flower.add(new THREE.AxesHelper());

            // setup geo
            flower.children[0].geometry.translate(0, 3.8, 0);
            flower.children[1].geometry.translate(0, 3.8, 0);
            flower.children[2].geometry.translate(0, 3.8, 0);

            // setup material
            flower.children[0].material = new THREE.MeshBasicMaterial({
                color: flower.children[0].material.color,
                side: THREE.DoubleSide
            });
            flower.children[0].material.needsUpdate = true;

            flower.children[1].material = new THREE.MeshBasicMaterial({
                color: flower.children[1].material.color,
                side: THREE.DoubleSide
            });
            flower.children[1].material.needsUpdate = true;

            this.randomPos(flower.position);
            this.randomRot(flower.rotation);
            this.randomScale(flower.scale);
            this.items.push(flower);
            this.bgScene.add(flower);

            for (let i = 0; i < this.numClones; i++) {
                let clone;
                clone = flower.clone();
                this.randomPos(clone.position);
                this.randomRot(clone.rotation);
                this.randomScale(clone.scale);
                this.items.push(clone);
                this.bgScene.add(clone);

            }
        });
    }

    randomScale(scale) {
        const scaleSpread = 1.0;

        scale.set(Math.random() * scaleSpread + 1, Math.random() * scaleSpread + 1, Math.random() * scaleSpread + 1);
    }

    randomPos(position) {
        const xSpread = this.dim.width;
        const zSpread = THREE.Math.mapLinear(Math.random(), 0.0, 1.0, -100, 200);
        const yPos = THREE.Math.mapLinear(Math.random(), 0.0, 1.0, (-this.dim.height / 2) * 0.2, (this.dim.height / 2) * 0.2);

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
            item.position.x += 1;

            // item.position.y += mouse.y;


            item.rotation.x += 0.01;
            item.rotation.z += 0.02;





            if (item.position.x > this.dim.width * 0.5) {
                item.position.x = -this.dim.width * 0.5;
            }
        });

    }
}