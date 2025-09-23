import{j as h}from"./jsx-runtime.D_zvdyIk.js";import{r as d}from"./index.DtoOFyvK.js";const p=[{id:1,name:"Sarah Johnson",profilePic:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",description:"Karen delivered an exceptional website that exceeded all our expectations. Her attention to detail and creative vision transformed our brand completely."},{id:2,name:"Michael Chen",profilePic:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",description:"Working with Karen was a game-changer for our startup. She created a stunning UI/UX that our users absolutely love. Highly recommended!"},{id:3,name:"Emily Rodriguez",profilePic:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",description:"Karen's motion design skills are incredible. She brought our static designs to life with beautiful animations that perfectly capture our brand essence."},{id:4,name:"David Thompson",profilePic:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",description:"Professional, creative, and reliable. Karen delivered our e-commerce platform on time and within budget. The results speak for themselves."},{id:5,name:"Lisa Park",profilePic:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",description:"Karen's art direction elevated our entire visual identity. She has an amazing eye for design and understands how to create compelling user experiences."},{id:6,name:"James Wilson",profilePic:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",description:"Exceptional work on our mobile app. Karen's technical skills combined with her design expertise resulted in a product our customers can't stop talking about."}],g=()=>{const t=d.useRef(null),n=d.useRef(null);return d.useEffect(()=>{if(!t.current)return;const u=()=>{const a=t.current;if(!a)return;a.innerHTML="";const i=document.createElement("div");i.className="reviews-marquee-wrapper";const e=document.createElement("div");e.className="reviews-marquee";const l=r=>{const c=document.createElement("div");return c.className="review-card-marquee",c.innerHTML=`
          <div class="card-inner">
            <div class="gradient-border"></div>
            
            <!-- Profile section -->
            <div class="profile-section">
              <div class="profile-pic">
                <img src="${r.profilePic}" alt="${r.name}" loading="lazy" />
              </div>
              <h3 class="reviewer-name">${r.name}</h3>
            </div>
            
            <!-- Review description -->
            <p class="review-description">
              ${r.description}
            </p>
          </div>
        `,c},s=document.createElement("div");s.className="reviews-set",p.forEach(r=>{s.appendChild(l(r))});const o=document.createElement("div");o.className="reviews-set",p.forEach(r=>{o.appendChild(l(r))}),e.appendChild(s),e.appendChild(o),i.appendChild(e),a.appendChild(i)},m=()=>{n.current=new IntersectionObserver(a=>{a.forEach(i=>{const e=i.target.querySelector(".reviews-marquee");e&&(i.isIntersecting?e.style.animationPlayState="running":e.style.animationPlayState="paused")})},{rootMargin:"200px 0px",threshold:.1}),t.current&&n.current.observe(t.current)};return u(),m(),()=>{n.current&&n.current.disconnect(),t.current&&(t.current.innerHTML="")}},[]),h.jsx("div",{ref:t,className:"reviews-container"})};export{g as default};
