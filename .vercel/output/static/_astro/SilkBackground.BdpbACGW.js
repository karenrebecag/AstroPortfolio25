import{j as E}from"./jsx-runtime.D_zvdyIk.js";import{r}from"./index.DtoOFyvK.js";import{c as L,S as R,j as I,W as O,k as M,N as T,C as x,d as V,M as z}from"./react.B9YLAtNL.js";const c=L((n,i)=>({isVisible:!1,isPaused:!1,isLoading:!0,opacity:0,quality:"medium",animationSpeed:1,colors:{primary:"#9D7FC1",contrast:"#4523AE"},setVisible:e=>{n({isVisible:e}),e?setTimeout(()=>n({opacity:1}),200):setTimeout(()=>n({opacity:0}),100)},setPaused:e=>n({isPaused:e}),setLoading:e=>n({isLoading:e}),setOpacity:e=>n({opacity:e}),setQuality:e=>n({quality:e}),setAnimationSpeed:e=>n({animationSpeed:e}),setColors:e=>n({colors:e})})),G=({className:n=""})=>{const i=r.useRef(null),e=r.useRef(null),[y,S]=r.useState(!1),{isVisible:d,isPaused:h,isLoading:C,opacity:N,quality:l,animationSpeed:U}=c();return r.useEffect(()=>{const t=new IntersectionObserver(([a])=>{c.getState().setVisible(a.isIntersecting)},{threshold:0,rootMargin:"800px 0px 200px 0px"});return i.current&&t.observe(i.current),()=>t.disconnect()},[]),r.useEffect(()=>{const t=()=>{c.getState().setPaused(document.hidden)};return document.addEventListener("visibilitychange",t),()=>document.removeEventListener("visibilitychange",t)},[]),r.useEffect(()=>{if(!i.current||!d)return;const t=i.current,a=new R,m=new I(-1,1,1,-1,0,1),s=new O({antialias:!1,alpha:!0,powerPreference:"high-performance"});s.setSize(t.clientWidth,t.clientHeight),s.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.appendChild(s.domElement);const u=new M({uniforms:{uTime:{value:0},uColor:{value:new x(.616,.498,.757)},uContrastColor:{value:new x(.271,.137,.682)},uSpeed:{value:5},uScale:{value:1*(l==="low"?.5:l==="medium"?1:1.5)},uRotation:{value:0},uNoiseIntensity:{value:1.5},uOpacity:{value:0}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec2 vUv;
        varying vec3 vPosition;

        uniform float uTime;
        uniform vec3  uColor;
        uniform vec3  uContrastColor;
        uniform float uSpeed;
        uniform float uScale;
        uniform float uRotation;
        uniform float uNoiseIntensity;
        uniform float uOpacity;

        const float e = 2.71828182845904523536;

        float noise(vec2 texCoord) {
          float G = e;
          vec2  r = (G * sin(G * texCoord));
          return fract(r.x * r.y * (1.0 + texCoord.x));
        }

        vec2 rotateUvs(vec2 uv, float angle) {
          float c = cos(angle);
          float s = sin(angle);
          mat2  rot = mat2(c, -s, s, c);
          return rot * uv;
        }

        void main() {
          float rnd        = noise(gl_FragCoord.xy);
          vec2  uv         = rotateUvs(vUv * uScale, uRotation);
          vec2  tex        = uv * uScale;
          float tOffset    = uSpeed * uTime * 0.01; // Slower for performance

          tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

          float pattern = 0.6 +
                          0.4 * sin(5.0 * (tex.x + tex.y +
                                           cos(3.0 * tex.x + 5.0 * tex.y) +
                                           0.02 * tOffset) +
                                   sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

          vec4 col = vec4(uColor, 1.0) * vec4(pattern) + 
                     vec4(uContrastColor, 1.0) * (1.0 - pattern) - 
                     rnd / 15.0 * uNoiseIntensity;
          
          col.a = uOpacity;
          gl_FragColor = col;
        }
      `,transparent:!0,blending:T}),f=new V(2,2),w=new z(f,u);a.add(w),e.current={scene:a,camera:m,renderer:s,material:u,animationId:null};let v=0;const p=()=>{const o=c.getState();!o.isPaused&&o.isVisible&&(v+=.1*o.animationSpeed,u.uniforms.uTime.value=v,u.uniforms.uOpacity.value=o.opacity,s.render(a,m)),e.current.animationId=requestAnimationFrame(p)},b=setTimeout(()=>{c.getState().setLoading(!1),S(!0),p()},300),g=()=>{if(!t||!e.current)return;const o=t.clientWidth,P=t.clientHeight;e.current.renderer.setSize(o,P)};return window.addEventListener("resize",g),()=>{clearTimeout(b),window.removeEventListener("resize",g),e.current&&(e.current.animationId&&cancelAnimationFrame(e.current.animationId),e.current.material.dispose(),f.dispose(),e.current.renderer.dispose(),t.contains(e.current.renderer.domElement)&&t.removeChild(e.current.renderer.domElement))}},[d,h,l]),E.jsx("div",{ref:i,className:`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${y&&!C?"opacity-100 scale-100":"opacity-0 scale-95"} ${n}`,style:{zIndex:1,mixBlendMode:"normal"}})};export{G as default};
