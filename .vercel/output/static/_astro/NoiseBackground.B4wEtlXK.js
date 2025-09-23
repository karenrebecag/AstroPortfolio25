import{j as a}from"./jsx-runtime.D_zvdyIk.js";import"./index.DtoOFyvK.js";function i({opacity:t=.9,speed:e=.2,className:n=""}){return a.jsx("div",{className:`noise-background ${n}`,style:{position:"fixed",top:"-50%",left:"-50%",right:"-50%",bottom:"-50%",width:"200%",height:"200vh",background:`transparent url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E") repeat 0 0`,backgroundRepeat:"repeat",backgroundSize:"600px 600px",animation:`noiseAnimation ${e}s infinite`,opacity:t,visibility:"visible",pointerEvents:"none",zIndex:1}})}if(typeof document<"u"){const t=document.createElement("style");t.textContent=`
    @keyframes noiseAnimation {
      0% { transform: translate(0,0) }
      10% { transform: translate(-5%,-5%) }
      20% { transform: translate(-10%,5%) }
      30% { transform: translate(5%,-10%) }
      40% { transform: translate(-5%,15%) }
      50% { transform: translate(-10%,5%) }
      60% { transform: translate(15%,0) }
      70% { transform: translate(0,10%) }
      80% { transform: translate(-15%,0) }
      90% { transform: translate(10%,5%) }
      100% { transform: translate(5%,0) }
    }
    
    .noise-background {
      mix-blend-mode: multiply;
    }
    
    /* Variante más sutil para backgrounds claros */
    .noise-background.light {
      mix-blend-mode: overlay;
      opacity: 0.3 !important;
    }
    
    /* Variante más intensa para backgrounds oscuros */
    .noise-background.dark {
      mix-blend-mode: screen;
      opacity: 0.15 !important;
    }
  `,document.head.appendChild(t)}export{i as NoiseBackground};
