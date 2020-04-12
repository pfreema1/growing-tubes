#pragma glslify: inverse = require(glsl-inverse)
#pragma glslify: transpose = require(glsl-transpose)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 


varying vec3 vNormal;
varying vec3 fragPos;
uniform float uTime;
uniform float movementRadius;
uniform float noiseEffect;


void main() {
  vec3 offsetPosition = position;
  // noise
  vec2 noisePos = position.xy * 0.2;
  float noiseVal = snoise3(vec3(noisePos.xy, uTime + position.y));
  float noiseOffset = noiseVal * 0.5;

  // base wave
  float wave1 = sin(uTime + position.y) * movementRadius;
  float wave2 = cos(uTime + position.y) * movementRadius;

  offsetPosition.z += wave1 + noiseOffset;
  offsetPosition.x += wave2 + noiseOffset;
  offsetPosition.y += noiseOffset;

  // set varyings
  vNormal = mat3(transpose(inverse(modelMatrix))) * normal;
  fragPos = vec3(modelMatrix * vec4(offsetPosition, 1.0));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition,1.0);
}