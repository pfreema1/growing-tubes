import * as THREE from 'three';
import glslify from 'glslify';
import basicDiffuseVert from '../shaders/basicDiffuse.vert';
import basicDiffuseFrag from '../shaders/basicDiffuse.frag';
import { ToonShader, ToonShader1, ToonShader2, ToonShaderHatching, ToonShaderDotted } from 'three/examples/jsm/shaders/ToonShader'
import customToonFrag from '../shaders/customToon.frag';
import customToonVert from '../shaders/customToon.vert';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export default class Flower {
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

        this.loader = new GLTFLoader();
        this.loader.load('./petal.glb', obj => {
            this.petalObj = obj.scene.children[0];

            this.addGUI();

            this.initMesh();


            this.addEvents();
        });




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

        this.flowerPane.addInput(this.PARAMS.flower, 'petalRotY', {
            min: -10.0,
            max: 10.0
        }).on('change', value => {
            for (let i = 0; i < this.numPetals; i++) {
                this.petals[i].rotation.y = value;
            }
        });

        this.flowerPane.addInput(this.PARAMS.flower, 'petalRotZ', {
            min: -10.0,
            max: 10.0
        }).on('change', value => {
            for (let i = 0; i < this.numPetals; i++) {
                this.petals[i].rotation.z = value;
            }
        });
    }

    addEvents() {

    }

    initPetals() {
        this.innerRadius = 1.0;
        this.outerRadius = 2.0;
        this.petalLength = this.outerRadius - this.innerRadius;
        this.petalRadius = 0.2;
        this.numPetals = 10;
        this.petals = [];

        for (let i = 0; i < this.numPetals; i++) {
            let angle = ((Math.PI * 2.0) / this.numPetals) * i;
            let x = Math.sin(angle) * this.innerRadius;
            let y = Math.cos(angle) * this.innerRadius;

            // let geo = new THREE.CylinderBufferGeometry(this.petalRadius, this.petalRadius, this.petalLength, 64, 64);
            let geo = this.petalObj.geometry;
            let mat = new THREE.MeshToonMaterial({
                color: new THREE.Color(0xffffff),
                specular: new THREE.Color(0x111111),
                shininess: 0.0
            });
            this.modifyPetalMaterial(mat);
            let mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, 0);
            mesh.rotation.set(0, 0, -angle);
            mesh.userData.angle = angle;
            // mesh.add(new THREE.AxesHelper());

            this.bgScene.add(mesh);

            this.petals.push(mesh);
        }

        console.log('this.petals:  ', this.petals);
    }

    initCenter() {
        let geo = new THREE.SphereBufferGeometry(0.5, 32, 32);
        let mat = new THREE.MeshToonMaterial({
            color: new THREE.Color(0xFFFF00),
            specular: new THREE.Color(0x111111),
            shininess: 0.0
        });
        this.modifyCenterMaterial(mat);
        let mesh = new THREE.Mesh(geo, mat);
        this.bgScene.add(mesh);

        this.center = mesh;

    }

    initMesh() {

        this.initPetals();
        this.initCenter();

    }

    modifyCenterMaterial(mat) {
        mat.userData.time = { value: 0.0 };

        mat.onBeforeCompile = shader => {
            shader.uniforms.time = mat.userData.time;

            shader.vertexShader = `
                #define PI 3.14159265359
                uniform float time;

                vec3 orthogonal(vec3 v) {
                    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                    : vec3(0.0, -v.z, v.y));
                }
                
                float map(float value, float min1, float max1, float min2, float max2) {
                    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                }

                mat4 rotationX( in float angle ) {
                    return mat4(	1.0,		0,			0,			0,
                                     0, 	cos(angle),	-sin(angle),		0,
                                    0, 	sin(angle),	 cos(angle),		0,
                                    0, 			0,			  0, 		1);
                }
                
                mat4 rotationY( in float angle ) {
                    return mat4(	cos(angle),		0,		sin(angle),	0,
                                             0,		1.0,			 0,	0,
                                    -sin(angle),	0,		cos(angle),	0,
                                            0, 		0,				0,	1);
                }
                
                mat4 rotationZ( in float angle ) {
                    return mat4(	cos(angle),		-sin(angle),	0,	0,
                                     sin(angle),		cos(angle),		0,	0,
                                            0,				0,		1,	0,
                                            0,				0,		0,	1);
                }
                
                // Any function can go here to distort p
                vec3 distorted(vec3 p) {
                    vec4 modP = vec4(p, 1.0);
                    // modP = modP * rotationX(time) * rotationY(PI * 0.5) * rotationZ(0.0);
                    float distFromCenter = -length(modP - vec4(0.0, 0.0, 0.0, 1.0));
                    distFromCenter = modP.z;

                    modP.z = sin((time + distFromCenter) * 2.0) * 0.5;
                    return modP.xyz;
                }
            ` + shader.vertexShader;

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
        }
    }

    modifyPetalMaterial(mat) {
        mat.userData.time = { value: 0.0 };

        mat.onBeforeCompile = shader => {
            shader.uniforms.time = mat.userData.time;

            shader.vertexShader = `
                #define PI 3.14159265359
                uniform float time;

                vec3 orthogonal(vec3 v) {
                    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                    : vec3(0.0, -v.z, v.y));
                }
                
                float map(float value, float min1, float max1, float min2, float max2) {
                    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                }

                mat4 rotationX( in float angle ) {
                    return mat4(	1.0,		0,			0,			0,
                                     0, 	cos(angle),	-sin(angle),		0,
                                    0, 	sin(angle),	 cos(angle),		0,
                                    0, 			0,			  0, 		1);
                }
                
                mat4 rotationY( in float angle ) {
                    return mat4(	cos(angle),		0,		sin(angle),	0,
                                             0,		1.0,			 0,	0,
                                    -sin(angle),	0,		cos(angle),	0,
                                            0, 		0,				0,	1);
                }
                
                mat4 rotationZ( in float angle ) {
                    return mat4(	cos(angle),		-sin(angle),	0,	0,
                                     sin(angle),		cos(angle),		0,	0,
                                            0,				0,		1,	0,
                                            0,				0,		0,	1);
                }
                
                // Any function can go here to distort p
                vec3 distorted(vec3 p) {
                    vec4 modP = vec4(p, 1.0);
                    modP = modP * rotationX(time) * rotationY(PI * 0.5) * rotationZ(0.0);
                    float distFromCenter = -length(modP - vec4(0.0, 0.0, 0.0, 1.0));

                    modP.z = sin((time + distFromCenter) * 2.0) * 1.0;
                    return modP.xyz;
                }
            ` + shader.vertexShader;

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
        }
    }

    update(time) {

        // update petals
        for (let i = 0; i < this.numPetals; i++) {
            let petal = this.petals[i];

            petal.material.userData.time.value = time;
        }

        if (this.center) {

            // update center
            this.center.material.userData.time.value = time;

            let centerScale = Math.abs(Math.sin(time * 2.0)) * 0.5 + 1.0;
            this.center.scale.set(centerScale, centerScale, centerScale);
        }
    }
}