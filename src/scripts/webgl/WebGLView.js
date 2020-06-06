import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
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

    this.initTubes();

    // this.initFlower();

    this.initLights();
  }

  initFlower() {
    this.flower = new Flower(this.bgScene, this.bgCamera, this.pane, this.PARAMS);
  }

  initTubes() {
    this.tubes = [];

    for (let i = 0; i < 1; i++) {
      const tube = new Tube(this.bgScene, this.bgCamera, this.pane, this.PARAMS);

      this.tubes.push(tube);
    }
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

    // this.effectGrayScale = new ShaderPass(LuminosityShader);
    // this.composer.addPass(this.effectGrayScale);




    // Sobel operator
    // this.effectSobel = new ShaderPass(SobelOperatorShader);
    // this.effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
    // this.effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;
    // this.composer.addPass(this.effectSobel);

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
      this.mouse.x = clientX; //(clientX / this.width) * 2 - 1;
      this.mouse.y = clientY; //-(clientY / this.height) * 2 + 1;

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
      100
    );
    this.controls = new OrbitControls(this.bgCamera, this.renderer.domElement);

    this.bgCamera.position.z = 3;
    this.controls.update();

    this.bgScene = new THREE.Scene();
  }

  initLights() {
    this.pointLight = new THREE.PointLight(0xffffff, 1);
    this.pointLight.position.set(0, 2, 3);
    this.bgScene.add(this.pointLight);

    // var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(1, 10, 1);
    // directionalLight.target.position.set(-5, 0, 0);
    // this.bgScene.add(directionalLight);
    // this.bgScene.add(directionalLight.target);

    // const helper = new THREE.PointLightHelper(this.pointLight, 1, new THREE.Color(0xff0000));
    // console.log(helper);
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

    if (this.effectSobel) {
      this.effectSobel.uniforms['uTime'].value = time;
    }

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

    if (this.flower) {
      this.flower.update(time);
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
