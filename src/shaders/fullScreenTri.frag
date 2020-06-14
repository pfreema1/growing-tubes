precision highp float;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform sampler2D uScene;
uniform sampler2D uMouseCanvas;
uniform sampler2D uTextCanvas;
uniform sampler2D iChannel0;
uniform vec2 uResolution;
uniform float uTime;


// Table of pigments 
// from Computer-Generated Watercolor. Cassidy et al.
// K is absortion. S is scattering
vec3 K_QuinacridoneRose = vec3(0.22, 1.47, 0.57);
vec3 S_QuinacridoneRose = vec3(0.05, 0.003, 0.03);
vec3 K_FrenchUltramarine = vec3(0.86, 0.86, 0.06);
vec3 S_FrenchUltramarine = vec3(0.005, 0.005, 0.09);
vec3 K_CeruleanBlue = vec3(1.52, 0.32, 0.25);
vec3 S_CeruleanBlue = vec3(0.06, 0.26, 0.40);
vec3 K_HookersGreen = vec3(1.62, 0.61, 1.64);
vec3 S_HookersGreen = vec3(0.01, 0.012, 0.003);
vec3 K_HansaYellow = vec3(0.06, 0.21, 1.78);
vec3 S_HansaYellow = vec3(0.50, 0.88, 0.009);

vec3 cosh(vec3 val) { vec3 e = exp(val); return (e + vec3(1.0) / e) / vec3(2.0); }
vec3 tanh(vec3 val) { vec3 e = exp(val); return (e - vec3(1.0) / e) / (e + vec3(1.0) / e); }
vec3 sinh(vec3 val) { vec3 e = exp(val); return (e - vec3(1.0) / e) / vec3(2.0); }


// Math functions not available in webgl
//vec3 cosh(vec3 val) { vec3 e = exp(val); return (e + vec3(1.0) / e) / vec3(2.0); }
//vec3 tanh(vec3 val) { vec3 e = exp(val); return (e - vec3(1.0) / e) / (e + vec3(1.0) / e); }
//vec3 sinh(vec3 val) { vec3 e = exp(val); return (e - vec3(1.0) / e) / vec3(2.0); }

// Kubelka-Munk reflectance and transmitance model
void KM(vec3 k, vec3 s, float h, out vec3 refl, out vec3 trans)
{
    vec3 a = (k+s)/s;
    vec3 b = sqrt(a*a - vec3(1.0));
    vec3 bsh = b*s*vec3(h);
    vec3 sinh_bsh = sinh(bsh);
    vec3 denom = b*cosh(bsh)+a*sinh_bsh;
    refl = sinh_bsh/denom;
    trans = b/denom;
}

// The watercolours tends to dry first in the center
// and accumulate more pigment in the corners
float brush_effect(float dist, float h_avg, float h_var)
{
    float h = max(0.0,1.0-10.0*abs(dist));
    h *= h;
    h *= h;
    return (h_avg+h_var*h) * smoothstep(-0.01, 0.002, dist);
}

// Kubelka-Munk model for layering
void layering(vec3 r0, vec3 t0, vec3 r1, vec3 t1, out vec3 r, out vec3 t)
{
    r = r0 + t0*t0*r1 / (vec3(1.0)-r0*r1);
    t = t0*t1 / (vec3(1.0)-r0*r1);
}

// Simple 2d noise fbm with 3 octaves
float noise2d(vec2 p)
{
    // float t = texture2D(iChannel0, p).x;
    // t += 0.5 * texture2D(iChannel0, p * 2.0).x;
    // t += 0.25 * texture2D(iChannel0, p * 4.0).x;
    // return t / 1.75;
    float t = snoise3(vec3(p.x, p.y, uTime));
    t += 0.5 * snoise3(vec3(p * 2.0, uTime));
    t += 0.25 * snoise3(vec3(p * 4.0, uTime));
    return t / 1.75;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    // vec4 color = vec4(0.0);
    vec4 sceneColor = texture2D(uScene, uv);


    vec4 color = sceneColor;
    

    
    
    gl_FragColor = vec4(color);
}