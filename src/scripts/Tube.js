import * as THREE from 'three';
import glslify from 'glslify';
import basicDiffuseVert from '../shaders/basicDiffuse.vert';
import basicDiffuseFrag from '../shaders/basicDiffuse.frag';
import { ToonShader, ToonShader1 } from 'three/examples/jsm/shaders/ToonShader'


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
        this.radius = 0.03;

        this.initMesh();

        // this.initInnerTube();

        this.addGUI();
        this.addEvents();



    }

    addGUI() {

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
        // this.mat = new THREE.ShaderMaterial({
        //     uniforms: {
        //         uTime: {
        //             value: 0.0
        //         },
        //         tubeColor: {
        //             value: this.returnRandomColor()
        //         },
        //         movementRadius: {
        //             value: this.movementRadius
        //         },
        //         noiseEffect: {
        //             value: this.noiseEffect
        //         }
        //     },
        //     vertexShader: glslify(basicDiffuseVert),
        //     fragmentShader: glslify(basicDiffuseFrag)
        // });
        // ToonShader;
        // debugger
        this.mat = new THREE.ShaderMaterial({
            uniforms: ToonShader1.uniforms,
            vertexShader: ToonShader1.vertexShader,
            fragmentShader: ToonShader1.fragmentShader
        })

        this.mesh = new THREE.Mesh(this.geo, this.mat);

        this.mesh.position.y -= 2;

        this.bgScene.add(this.mesh);
    }

    update(time) {
        this.mat.uniforms.uTime.value = time + this.timeOffset;

    }
}