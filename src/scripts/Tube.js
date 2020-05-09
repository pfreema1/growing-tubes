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
        this.radius = 0.3;

        this.addGUI();

        this.initMesh();


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

        this.mat = new THREE.MeshToonMaterial({
            color: new THREE.Color(0x0000ff),
            specular: new THREE.Color(0x111111),
            shininess: 0.0
        });

        this.mat.userData.bulgePosY = { value: this.PARAMS.tube.bulgePosY };
        this.mat.userData.time = { value: 0.0 };

        this.mat.onBeforeCompile = shader => {
            shader.uniforms.time = this.mat.userData.time;
            shader.uniforms.bulgePosY = this.mat.userData.bulgePosY;

            shader.vertexShader = `
                uniform float time;
                uniform float bulgePosY;

                vec3 orthogonal(vec3 v) {
                    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                    : vec3(0.0, -v.z, v.y));
                }
                
                float map(float value, float min1, float max1, float min2, float max2) {
                    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                }
                
                // Any function can go here to distort p
                vec3 distorted(vec3 p) {
                    // float y = bulgePosY;
                    float y = p.y - bulgePosY;
                    p.x += sin(time + p.y) * (0.2 * y);
                    p.z += cos(time + p.y) * (0.2 * y);
                    return p;
                }
            ` + shader.vertexShader

            const token = '#include <begin_vertex>'
            const customTransform = `
                float tangentFactor = 0.5; // default 0.1
                vec3 distortedPosition = distorted(position);
                vec3 tangent1 = orthogonal(normal);
                vec3 tangent2 = normalize(cross(normal, tangent1));
                vec3 nearby1 = position + tangent1 * tangentFactor;
                vec3 nearby2 = position + tangent2 * tangentFactor;
                vec3 distorted1 = distorted(nearby1);
                vec3 distorted2 = distorted(nearby2);

                vec3 transformed = vec3(distortedPosition);

                vNormal = normalize(cross(distorted1 - distortedPosition, distorted2 - distortedPosition));

            `
            shader.vertexShader = shader.vertexShader.replace(token, customTransform);



        };



        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.mat.needsUpdate = true;



        this.bgScene.add(this.mesh);

        console.log(this.mesh);

        this.mesh.position.x += 2;
    }

    update(time) {

        this.mat.userData.time.value = time;

    }
}