import * as THREE from 'three';
import glslify from 'glslify';
import fitPlaneToScreen from './utils/fitPlaneToScreen';
import bgPlaneFrag from '../shaders/bgPlane.frag';
import bgPlaneVert from '../shaders/bgPlane.vert';

export default class BgPlane {
    constructor(bgScene, bgCamera, pane, PARAMS) {
        this.bgScene = bgScene;
        this.bgCamera = bgCamera;
        this.pane = pane;
        this.PARAMS = PARAMS;

        this.init();
    }

    init() {
        const dim = fitPlaneToScreen(this.bgCamera, -100, window.innerWidth, window.innerHeight);

        this.geo = new THREE.PlaneBufferGeometry(dim.width, dim.height, 32, 32);

        this.mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {
                    value: 0.0
                }
            },
            vertexShader: bgPlaneVert,
            fragmentShader: bgPlaneFrag
        });

        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.mesh.position.z = -100;

        this.bgScene.add(this.mesh);
        // debugger;
    }

    update(time) {
        if (this.mat) {
            this.mat.uniforms.uTime.value = time;
        }
    }
}
