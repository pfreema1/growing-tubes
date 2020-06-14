#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)


uniform float uTime;
uniform vec3 u_lightColor;
uniform vec3 u_lightPos;
uniform vec3 tubeColor;
uniform vec2 uResolution;
uniform sampler2D texture;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 fragPos;



void main() {

  vec2 uv = vUv;
  // uv = vUv.xy / uResolution.xy;
  
  vec4 color = vec4(1.0);
  vec3 skyBlue = vec3(0.68,0.58,0.83);
  vec3 horizon = vec3(0.95,0.56,0.39);
  // vec3 cloudColor = vec3(0.81,0.44,0.53);
  vec3 cloudColor = vec3(0.87,0.67,0.79);
  // vec3 cloudColor = vec3(0.81,1.44,1.53);
  vec3 cloudColor1 = vec3(0.83,0.54,0.62);
  vec3 cloudColor2 = vec3(0.89,0.68,0.79);
  vec3 cloudColor3 = vec3(0.92,0.69,0.65);

  // bg 
  float m = uv.y * uv.y * -1.0 + 0.45;
  color = vec4(mix(skyBlue, horizon, smoothstep(0.2, 0.5, m)), 1.0);

  // cloud noise
  vec2 modUv = vec2(uv.x, uv.y);
  modUv.x -= uTime;
  modUv *= 1.3;
  float n = -1.0 * snoise3(vec3(modUv, uTime));
  color = vec4(mix(color.rgb, cloudColor, n), 1.0);

  gl_FragColor = color;
}