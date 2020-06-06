import * as THREE from 'three';
import glslify from 'glslify';
import basicDiffuseVert from '../shaders/basicDiffuse.vert';
import basicDiffuseFrag from '../shaders/basicDiffuse.frag';
import { ToonShader, ToonShader1, ToonShader2, ToonShaderHatching, ToonShaderDotted } from 'three/examples/jsm/shaders/ToonShader'
import customToonFrag from '../shaders/customToon.frag';
import customToonVert from '../shaders/customToon.vert';


export default class Tube {
    constructor(bgScene, bgCamera, pane, PARAMS) {
        this.bgScene = bgScene;
        this.bgCamera = bgCamera;
        this.pane = pane;
        this.PARAMS = PARAMS;

        // settings
        this.timeOffset = Math.random() * 1.0;
        this.movementRadius = Math.random() * 10.5;
        this.noiseEffect = Math.random() * 3;
        this.radius = 1.3;

        this.addGUI();

        this.loader = new THREE.TextureLoader();

        this.loader.load('./flowers.png', (texture) => {
            this.texture = texture;
            this.initMesh();
        })




        this.addEvents();



    }

    addGUI() {
        this.PARAMS.tube = {
            bulgePosY: 0.0
        };

        this.tubePane = this.pane.addFolder({
            title: 'tube'
        });

        this.tubePane.addInput(this.PARAMS.tube, 'bulgePosY', {
            min: -10.0,
            max: 10.0
        }).on('change', value => {
            this.mat.userData.bulgePosY.value = value;
        })
    }

    addEvents() {

    }

    returnRandomColor() {
        let tubeColor = new THREE.Vector3();

        const pallette = [
            new THREE.Vector3(70, 74, 57),
            new THREE.Vector3(0.41, 0.41, 0.57),
            new THREE.Vector3(0.75, 0.50, 0.44),
            new THREE.Vector3(0.99, 0.98, 0.55),
            new THREE.Vector3(0.34, 0.33, 0.89)
        ];

        tubeColor = pallette[parseInt(Math.random() * pallette.length)];
        return tubeColor;
    }



    initMesh() {

        this.geo = new THREE.CylinderBufferGeometry(this.radius, this.radius, 10, 128, 128);

        this.mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {
                    value: 0.0
                },
                texture: {
                    value: this.texture
                }
            },
            vertexShader: basicDiffuseVert,
            fragmentShader: basicDiffuseFrag,
            transparent: true,
            side: THREE.DoubleSide
        });


        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.mat.needsUpdate = true;



        this.bgScene.add(this.mesh);

        console.log(this.mesh);

        this.mesh.position.x += 2;
    }

    update(time) {


        if (this.mat) {

            this.mat.uniforms.uTime.value = time;
        }

    }
}