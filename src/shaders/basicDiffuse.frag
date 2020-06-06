uniform float uTime;
uniform vec3 u_lightColor;
uniform vec3 u_lightPos;
uniform vec3 tubeColor;
uniform sampler2D texture;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 fragPos;



void main() {
  
  vec4 color = vec4(0.0);
  vec2 uv = vUv;

  uv *= 2.0;
  uv.x += uTime * 0.2;
  uv.y -= uTime * 0.1;
  uv.y *= 3.0;
  uv = fract(uv);
  vec4 textureColor = texture2D(texture, uv);

  color = textureColor;

  

  gl_FragColor = color;
}