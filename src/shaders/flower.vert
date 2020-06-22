uniform float time;
varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 pixels;

attribute vec3 barycentric;

varying vec3 vBarycentric;
varying vec4 worldXPos;

void main() {
    vUv = uv;
    vBarycentric = barycentric;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}