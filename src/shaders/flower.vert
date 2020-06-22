uniform float time;
varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 pixels;
uniform vec2 mouse;

attribute vec3 barycentric;

varying vec3 vBarycentric;
varying vec4 worldXPos;

void main() {
    vUv = uv;
    vBarycentric = barycentric;
    
    vec3 modPos = position + (normal * mouse.x * 3.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(modPos, 1.0);
}