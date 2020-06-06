#pragma glslify: inverse = require(glsl-inverse)
#pragma glslify: transpose = require(glsl-transpose)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 


varying vec3 vNormal;
varying vec3 fragPos;
varying vec2 vUv;
uniform float uTime;
uniform float movementRadius;
uniform float noiseEffect;

vec3 orthogonal(vec3 v) {
    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
    : vec3(0.0, -v.z, v.y));
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// Any function can go here to distort p
vec3 distorted(vec3 p) {
    float y = p.y;
    p.x += sin(uTime + p.y) * (0.2 * y);
    p.z += cos(uTime + p.y) * (0.2 * y);
    return p;
}


void main() {
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

  fragPos = vec3(modelMatrix * vec4(distortedPosition, 1.0));

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(distortedPosition,1.0);
}