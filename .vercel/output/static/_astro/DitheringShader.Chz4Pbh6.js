import{j as b}from"./jsx-runtime.D_zvdyIk.js";import{r as u}from"./index.DtoOFyvK.js";const C=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,L=`
  float hash11(float p) {
    p = fract(p * 0.3183099) + 0.1;
    p *= p + 19.19;
    return fract(p * p);
  }
`,T=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`,I=`
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`,k=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`,E=`#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;
uniform float u_pxSize;

out vec4 fragColor;

${I}
${C}
${L}
${T}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
  0,  8,  2, 10,
 12,  4, 14,  6,
  3, 11,  1,  9,
 15,  7, 13,  5
);

const int bayer8x8[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}

void main() {
  float t = .5 * u_time;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= .5;
  
  // Apply pixelization
  float pxSize = u_pxSize;
  vec2 pxSizeUv = gl_FragCoord.xy;
  pxSizeUv -= .5 * u_resolution;
  pxSizeUv /= pxSize;
  vec2 pixelizedUv = floor(pxSizeUv) * pxSize / u_resolution.xy;
  pixelizedUv += .5;
  pixelizedUv -= .5;
  
  vec2 shape_uv = pixelizedUv;
  vec2 dithering_uv = pxSizeUv;
  vec2 ditheringNoise_uv = uv * u_resolution;

  float shape = 0.;
  if (u_shape < 1.5) {
    // Simplex noise
    shape_uv *= .001;
    shape = 0.5 + 0.5 * getSimplexNoise(shape_uv, t);
    shape = smoothstep(0.3, 0.9, shape);

  } else if (u_shape < 2.5) {
    // Warp
    shape_uv *= .003;
    for (float i = 1.0; i < 6.0; i++) {
      shape_uv.x += 0.6 / i * cos(i * 2.5 * shape_uv.y + t);
      shape_uv.y += 0.6 / i * cos(i * 1.5 * shape_uv.x + t);
    }
    shape = .15 / abs(sin(t - shape_uv.y - shape_uv.x));
    shape = smoothstep(0.02, 1., shape);

  } else if (u_shape < 3.5) {
    // Dots
    shape_uv *= .05;
    float stripeIdx = floor(2. * shape_uv.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.);
    rand = sign(rand - .5) * pow(.1 + abs(rand), .4);
    shape = sin(shape_uv.x) * cos(shape_uv.y - 5. * rand * t);
    shape = pow(abs(shape), 6.);

  } else if (u_shape < 4.5) {
    // Sine wave
    shape_uv *= 4.;
    float wave = cos(.5 * shape_uv.x - 2. * t) * sin(1.5 * shape_uv.x + t) * (.75 + .25 * cos(3. * t));
    shape = 1. - smoothstep(-1., 1., shape_uv.y + wave);

  } else if (u_shape < 5.5) {
    // Ripple
    float dist = length(shape_uv);
    float waves = sin(pow(dist, 1.7) * 7. - 3. * t) * .5 + .5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Swirl
    float l = length(shape_uv);
    float angle = 6. * atan(shape_uv.y, shape_uv.x) + 4. * t;
    float twist = 1.2;
    float offset = pow(l, -twist) + angle / TWO_PI;
    float mid = smoothstep(0., 1., pow(l, twist));
    shape = mix(0., fract(offset), mid);

  } else {
    // Sphere
    shape_uv *= 2.;
    float d = 1. - pow(length(shape_uv), 2.);
    vec3 pos = vec3(shape_uv, sqrt(d));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  }

  int type = int(floor(u_type));
  float dithering = 0.0;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoise_uv), shape);
    } break;
    case 2:
      dithering = getBayerValue(dithering_uv, 2);
      break;
    case 3:
      dithering = getBayerValue(dithering_uv, 4);
      break;
    default:
      dithering = getBayerValue(dithering_uv, 8);
      break;
  }

  dithering -= .5;
  float res = step(.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`,D={simplex:1,warp:2,dots:3,wave:4,ripple:5,swirl:6,sphere:7},N={random:1,"2x2":2,"4x4":3,"8x8":4};function z(e){const o=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return o?[Number.parseInt(o[1],16)/255,Number.parseInt(o[2],16)/255,Number.parseInt(o[3],16)/255,1]:[0,0,0,1]}function w(e,o,c){const i=e.createShader(o);return i?(e.shaderSource(i,c),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(i)),e.deleteShader(i),null)):null}function O(e,o,c){const i=w(e,e.VERTEX_SHADER,o),p=w(e,e.FRAGMENT_SHADER,c);if(!i||!p)return null;const n=e.createProgram();return n?(e.attachShader(n,i),e.attachShader(n,p),e.linkProgram(n),e.getProgramParameter(n,e.LINK_STATUS)?n:(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(n)),e.deleteProgram(n),null)):null}function $({width:e=800,height:o=800,colorBack:c="#e6d9fb",colorFront:i="#9D7FC1",shape:p="warp",type:n="8x8",pxSize:_=2,speed:f=.3,className:R="",style:A={}}){const m=u.useRef(null),l=u.useRef(void 0),v=u.useRef(null),h=u.useRef(null),d=u.useRef({}),F=u.useRef(Date.now());return u.useEffect(()=>{const x=m.current;if(!x)return;const t=x.getContext("webgl2");if(!t){console.error("WebGL2 not supported");return}h.current=t;const s=O(t,k,E);if(!s)return;v.current=s,d.current={u_time:t.getUniformLocation(s,"u_time"),u_resolution:t.getUniformLocation(s,"u_resolution"),u_colorBack:t.getUniformLocation(s,"u_colorBack"),u_colorFront:t.getUniformLocation(s,"u_colorFront"),u_shape:t.getUniformLocation(s,"u_shape"),u_type:t.getUniformLocation(s,"u_type"),u_pxSize:t.getUniformLocation(s,"u_pxSize")};const g=t.getAttribLocation(s,"a_position"),U=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,U);const P=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];t.bufferData(t.ARRAY_BUFFER,new Float32Array(P),t.STATIC_DRAW),t.enableVertexAttribArray(g),t.vertexAttribPointer(g,2,t.FLOAT,!1,0,0),x.width=e,x.height=o,t.viewport(0,0,e,o);const y=()=>{const B=(Date.now()-F.current)*.001*f,a=h.current,S=v.current;if(!a||!S)return;a.clear(a.COLOR_BUFFER_BIT),a.useProgram(S);const r=d.current;r.u_time&&a.uniform1f(r.u_time,B),r.u_resolution&&a.uniform2f(r.u_resolution,e,o),r.u_colorBack&&a.uniform4fv(r.u_colorBack,z(c)),r.u_colorFront&&a.uniform4fv(r.u_colorFront,z(i)),r.u_shape&&a.uniform1f(r.u_shape,D[p]),r.u_type&&a.uniform1f(r.u_type,N[n]),r.u_pxSize&&a.uniform1f(r.u_pxSize,_),a.drawArrays(a.TRIANGLES,0,6),f!==0&&(l.current=requestAnimationFrame(y))};return(()=>{f!==0&&(l.current=requestAnimationFrame(y))})(),()=>{l.current&&cancelAnimationFrame(l.current),h.current&&v.current&&h.current.deleteProgram(v.current)}},[e,o,c,i,p,n,_,f]),b.jsx("div",{className:R,style:{position:"relative",width:e,height:o,...A},children:b.jsx("canvas",{ref:m,style:{display:"block",width:"100%",height:"100%",objectFit:"cover"}})})}export{$ as DitheringShader};
