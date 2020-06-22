uniform float time;
uniform vec3 worldPos;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float mod1;
uniform float mod2;
uniform vec2 dimWidth;

varying vec2 vUv;
varying vec3 vBarycentric;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    // float width = 0.05;// * mod(time, 1.0);
    vec3 b = vBarycentric;

    // float borderx = max(step(vUv.x, width), step(1. - vUv.x, width));
    // float bordery = max(step(vUv.y, width), step(1. - vUv.y, width));
    // float border = max(borderx, bordery);

    // width = mod1;
    // float width = map(mouse.x, -1.0, 1.0, 0.4, 0.0);
    float normX = gl_FragCoord.x/resolution.x;
    float width = 0.0;
    if(normX < 0.5) {
      width = map(normX, 0.0, 0.5, 0.4, 0.0);
    } else {
      width = map(normX, 0.5, 1.0, 0.0, 0.4);
    }
    // float width = map(normX, 0.0, 1.0, 0.4, 0.0);
    // float width = map(worldPos.x, dimWidth.x, dimWidth.y, 0.4, 0.0);
    // float m = length(uv - mouse);
    // width *= m;
    float xStep = step(b.x, width);
    float yStep = step(b.y, width);
    float zStep = step(b.z, width);
    float border = max(max(xStep, yStep), zStep);
    vec3 color = vec3(border);

    // gl_FragColor = vec4(vUv. 0.0, 1.0);
    gl_FragColor = vec4(color, 1.0);

}