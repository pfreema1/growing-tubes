import * as THREE from 'three';
import glslify from 'glslify';
import Tweakpane from 'tweakpane';
import OrbitControls from 'three-orbitcontrols';
import TweenMax from 'TweenMax';
import baseDiffuseFrag from '../../shaders/basicDiffuse.frag';
import basicDiffuseVert from '../../shaders/basicDiffuse.vert';
import MouseCanvas from '../MouseCanvas';
import TextCanvas from '../TextCanvas';
import RenderTri from '../RenderTri';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { debounce } from '../utils/debounce';
import Tube from '../Tube';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import Flower from '../Flower';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Flowers from '../Flowers';
import BgPlane from '../BgPlane';
import Cloud from '../Cloud';


export default class WebGLView {
  constructor(app) {
    this.app = app;
    this.PARAMS = {
      rotSpeed: 0.005
    };

    this.init();
  }

  async init() {
    this.initThree();
    this.initBgScene();
    this.initTweakPane();

    this.setupTextCanvas();
    this.initMouseMoveListen();
    this.initMouseCanvas();
    this.initRenderTri();
    this.initPostProcessing();
    this.initResizeHandler();

    // this.loadMesh();

    this.loadFlowers();

    this.initCloud();

    this.initBgPlane();


    this.initLights();
  }

  initCloud() {
    this.cloud = new Cloud(this.bgScene, this.bgCamera, this.pane, this.PARAMS);
  }

  initBgPlane() {
    this.bgPlane = new BgPlane(this.bgScene, this.bgCamera, this.pane, this.PARAMS);
  }

  loadFlowers() {
    this.flowers = new Flowers(this.bgScene, this.bgCamera, this.pane, this.PARAMS);
  }

  loadMesh() {
    this.loader = new GLTFLoader();

    this.loader.load('./flower1.glb', obj => {
      console.log('full object:  ', obj);

      this.flower = obj.scene.children[0];
      console.log('this.flower:  ', this.flower);
      this.flower.add(new THREE.AxesHelper());

      // setup geo
      this.flower.children[0].geometry.translate(0, 3.8, 0);
      this.flower.children[1].geometry.translate(0, 3.8, 0);
      this.flower.children[2].geometry.translate(0, 3.8, 0);

      // setup material
      this.flower.children[0].material = new THREE.MeshBasicMaterial({
        color: this.flower.children[0].material.color,
        side: THREE.DoubleSide
      });
      this.flower.children[0].material.needsUpdate = true;

      this.flower.children[1].material = new THREE.MeshBasicMaterial({
        color: this.flower.children[1].material.color,
        side: THREE.DoubleSide
      });
      this.flower.children[1].material.needsUpdate = true;



      this.bgScene.add(this.flower);
    })
  }



  initResizeHandler() {
    window.addEventListener(
      'resize',
      debounce(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer.setSize(this.width, this.height);

        // render tri
        this.renderTri.renderer.setSize(this.width, this.height);
        this.renderTri.triMaterial.uniforms.uResolution.value = new THREE.Vector2(
          this.width,
          this.height
        );

        // bg scene
        this.bgRenderTarget.setSize(this.width, this.height);
        this.bgCamera.aspect = this.width / this.height;
        this.bgCamera.updateProjectionMatrix();

        // text canvas
        this.textCanvas.canvas.width = this.width;
        this.textCanvas.canvas.height = this.height;
        this.setupTextCanvas();
        this.renderTri.triMaterial.uniforms.uTextCanvas.value = this.textCanvas.texture;

        // mouse canvas
        this.mouseCanvas.canvas.width = this.width;
        this.mouseCanvas.canvas.height = this.height;

        // composer
        this.composer.setSize(this.width, this.height);
      }, 500)
    );
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(new RenderPass(this.scene, this.camera));

    // color to grayscale conversion

    this.effectGrayScale = new ShaderPass(LuminosityShader);
    this.composer.addPass(this.effectGrayScale);




    // Sobel operator
    this.effectSobel = new ShaderPass(SobelOperatorShader);
    this.effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
    this.effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;
    this.composer.addPass(this.effectSobel);

    // outline
    // this.outlineEffect = new OutlineEffect(this.renderer);

    // unreal bloom
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), // res
      this.PARAMS.bloomStrength, // strength
      this.PARAMS.bloomRadius, // radius
      this.PARAMS.bloomThreshold, // threshold
    );
    this.composer.addPass(this.bloomPass);

    // vertical blur
    this.effectBlur = new ShaderPass(VerticalBlurShader);
    this.composer.addPass(this.effectBlur);




  }

  initTweakPane() {
    this.pane = new Tweakpane();

    this.PARAMS.blurAmt = 0.0;
    this.PARAMS.bloomThreshold = 0.85;
    this.PARAMS.bloomStrength = 0.0;
    this.PARAMS.bloomRadius = 0.4;
    // this.PARAMS.dirLight

    this.pane.addInput(this.PARAMS, 'blurAmt', {
      min: 0.0,
      max: 10.0
    }).on('change', value => {
      this.effectBlur.uniforms['v'].value = value / 512.0;
    });

    this.pane.addInput(this.PARAMS, 'bloomThreshold', {
      min: 0.3,
      max: 1.5
    }).on('change', value => {
      this.bloomPass.threshold = value;
    });

    this.pane.addInput(this.PARAMS, 'bloomStrength', {
      min: 0.0,
      max: 3.0
    }).on('change', value => {
      this.bloomPass.strength = value;
    });

    this.pane.addInput(this.PARAMS, 'bloomRadius', {
      min: 0.1,
      max: 1.0
    }).on('change', value => {
      this.bloomPass.radius = value;
    });
  }

  initMouseCanvas() {
    this.mouseCanvas = new MouseCanvas();
  }

  initMouseMoveListen() {
    this.mouse = new THREE.Vector2();
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    window.addEventListener('mousemove', ({ clientX, clientY }) => {
      this.mouse.x = (clientX / this.width) * 2 - 1;
      this.mouse.y = -(clientY / this.height) * 2 + 1;

      this.mouseCanvas.addTouch(this.mouse);
    });
  }

  initThree() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0xD2E9F1);
    this.renderer.autoClear = true;

    this.clock = new THREE.Clock();
  }

  setupTextCanvas() {
    this.textCanvas = new TextCanvas(this);
  }



  initRenderTri() {
    this.resize();

    this.renderTri = new RenderTri(
      this.scene,
      this.renderer,
      this.bgRenderTarget,
      this.mouseCanvas,
      this.textCanvas
    );
  }

  initBgScene() {
    this.bgRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    this.bgCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.controls = new OrbitControls(this.bgCamera, this.renderer.domElement);

    this.bgCamera.position.z = 300;
    this.controls.update();

    this.bgScene = new THREE.Scene();
  }

  initLights() {
    // this.dim = fitPlaneToScreen(this.bgCamera, -50, window.innerWidth, window.innerHeight);
    // this.pointLight = new THREE.PointLight(0xffffff, 10);
    // this.pointLight.position.set(-5, -this.dim.height * 0.5, -5);
    // this.bgScene.add(this.pointLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, -10, 1);
    directionalLight.target.position.set(0, 1, 0);
    this.bgScene.add(directionalLight);
    this.bgScene.add(directionalLight.target);
    // const helper = new THREE.DirectionalLightHelper(directionalLight, 100, new THREE.Color(0xff0000));
    // this.bgScene.add(helper);

    // const helper = new THREE.PointLightHelper(this.pointLight, 10, new THREE.Color(0xff0000));
    // // console.log(helper);
    // this.bgScene.add(helper);
  }

  resize() {
    if (!this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.fovHeight =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z;
    this.fovWidth = this.fovHeight * this.camera.aspect;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.trackball) this.trackball.handleResize();
  }

  updateTextCanvas(time) {
    this.textCanvas.textLine.update(time);
    this.textCanvas.textLine.draw(time);
    this.textCanvas.texture.needsUpdate = true;
  }

  updateTubes(time) {
    for (let i = 0; i < this.tubes.length; i++) {
      const tube = this.tubes[i];
      tube.update(time);
    }
  }

  update() {
    const delta = this.clock.getDelta();
    const time = performance.now() * 0.0005;

    this.controls.update();

    if (this.renderTri) {
      this.renderTri.triMaterial.uniforms.uTime.value = time;
    }

    if (this.mouseCanvas) {
      this.mouseCanvas.update();
    }

    if (this.textCanvas) {
      this.updateTextCanvas(time);
    }

    if (this.tubes) {
      this.updateTubes(time);

    }

    // if (this.effectSobel) {
    //   this.effectSobel.uniforms['uTime'].value = time;
    // }

    if (this.pointLight) {
      // this.pointLight.position.set(
      //   Math.sin(time * 1.5) * 3.0,
      //   2.0,
      //   Math.cos(time * 1.5) * 3.0
      // );

      // attach light to flower center
      // if (this.flower.center) {

      //   this.pointLight.position.set(
      //     this.flower.center.position.x,
      //     this.flower.center.position.y,
      //     this.flower.center.position.z,
      //   )
      // }
    }

    if (this.cloud) {
      this.cloud.update(time);
    }

    if (this.flower) {
      this.flower.rotation.x += 0.05;
      this.flower.rotation.z += 0.02;
      this.flower.rotation.y += 0.03;
    }

    if (this.bgPlane) {
      this.bgPlane.update(time);
    }

    if (this.flowers) {
      this.flowers.update(time, this.mouse);
    }

    if (this.trackball) this.trackball.update();
  }

  draw() {
    this.renderer.setRenderTarget(this.bgRenderTarget);
    this.renderer.render(this.bgScene, this.bgCamera);
    this.renderer.setRenderTarget(null);

    // this.outlineEffect.render(this.bgScene, this.bgCamera);

    // this.renderer.render(this.scene, this.camera);

    if (this.composer) {

      this.composer.render();
    }
  }
}
