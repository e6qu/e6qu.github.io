(() => {
  const canvas = document.querySelector('#termites');
  const ctx = canvas.getContext('2d');
  const damage = document.createElement('canvas');
  const eaten = damage.getContext('2d');
  if (!ctx || !eaten) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(any-pointer: fine)');
  const IDLE_DELAY = 2000;
  let timer, frame, lastTime = 0, lastPaint = 0, active = false;
  let width = 0, height = 0, termites = [];
  function allowed() { return !reduced.matches && fine.matches && !document.hidden; }
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5, 2400 / innerWidth);
    width = innerWidth;
    height = innerHeight;
    for (const layer of [canvas,damage]) {
      layer.width = Math.round(width * ratio);
      layer.height = Math.round(height * ratio);
      layer.getContext('2d').setTransform(ratio,0,0,ratio,0,0);
    }
  }
  function makeTermite(left, y, phase) {
    return {x:left ? 10 : width-10,y,originY:y,direction:left ? 1 : -1,angle:left ? 0 : Math.PI,phase,nibble:0};
  }
  function bite(x,y,r,phase) {
    // Persistent raster damage keeps memory bounded while the leaf is eaten.
    eaten.fillStyle='#030609';
    eaten.beginPath();
    for(let i=0;i<22;i++) {
      const angle=i/22*Math.PI*2;
      const radius=r*(.83+.17*Math.sin(i*2.1+phase));
      const bx=x+Math.cos(angle)*radius,by=y+Math.sin(angle)*radius;
      if(i===0)eaten.moveTo(bx,by);else eaten.lineTo(bx,by);
    }
    eaten.closePath();eaten.fill();
    // Small overlapping mouthfuls leave a scalloped, irregular leaf edge.
    for(let i=0;i<3;i++) {
      const angle=phase+i*2.2;
      eaten.beginPath();
      eaten.arc(x+Math.cos(angle)*r*.75,y+Math.sin(angle)*r*.75,3+i,0,Math.PI*2);
      eaten.fill();
    }
  }
  function start() {
    if(!allowed())return;
    resize();
    function targetY(selector,fallback) {
      const rect=document.querySelector(selector)?.getBoundingClientRect();
      return rect && rect.top>=30 && rect.bottom<=height-30 ? (rect.top+rect.bottom)/2 : fallback;
    }
    termites=[makeTermite(true,targetY('.identity h1',height*.24),.5),makeTermite(false,targetY('.featured-panel[data-active] .feature-art',height*.56),2.5),makeTermite(true,targetY('#projects h2',height*.82),4.5)];
    for(const t of termites)bite(t.direction===1 ? 0 : width,t.y,23,t.phase);
    active=true;lastTime=lastPaint=0;
    canvas.setAttribute('data-active','');
    frame=requestAnimationFrame(tick);
  }
  function drawTermite(t,now) {
    ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.angle);
    ctx.strokeStyle='#8e7048';ctx.lineWidth=1;
    const walk=Math.sin(now*.011+t.phase)*2;
    for(let i=0;i<3;i++) {
      const x=-3+i*3;
      ctx.beginPath();
      ctx.moveTo(x,-2);ctx.lineTo(x-3+walk,-6);ctx.lineTo(x-1+walk,-9);
      ctx.moveTo(x,2);ctx.lineTo(x-3-walk,6);ctx.lineTo(x-1-walk,9);ctx.stroke();
    }
    ctx.fillStyle='#e9d4a7';
    ctx.beginPath();ctx.ellipse(-5,0,5.5,3.8,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(1,0,3.2,2.7,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#b97841';
    ctx.beginPath();ctx.arc(6,0,3,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(8,-1);ctx.lineTo(12,-4);ctx.moveTo(8,1);ctx.lineTo(12,4);ctx.stroke();
    ctx.restore();
  }
  function tick(now) {
    if(!active)return;
    frame=requestAnimationFrame(tick);
    if(now-lastPaint<80)return;
    const elapsed=lastTime ? Math.min((now-lastTime)/1000,.2) : 0;
    lastTime=lastPaint=now;
    for(const t of termites) {
      t.x+=t.direction*elapsed*5;
      t.y=t.originY+Math.sin((t.x/width)*Math.PI*3+t.phase)*18;
      t.angle=(t.direction===1 ? 0 : Math.PI)+Math.sin(now*.0008+t.phase)*.25;
      t.nibble+=elapsed;
      if(t.nibble>.55) {
        t.nibble=0;
        bite(t.x+Math.cos(t.angle)*8,t.y+Math.sin(t.angle)*8,13+Math.random()*7,now*.004+t.phase);
      }
      if(t.x>width-10||t.x<10) {
        t.direction*=-1;
        t.x=Math.max(10,Math.min(width-10,t.x));
        t.originY=Math.max(30,Math.min(height-30,t.originY+48));
      }
    }
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(damage,0,0,width,height);
    for(const t of termites)drawTermite(t,now);
  }
  function clear() {
    clearTimeout(timer);cancelAnimationFrame(frame);
    if(active) {ctx.clearRect(0,0,width,height);eaten.clearRect(0,0,width,height);}
    active=false;termites=[];canvas.removeAttribute('data-active');
  }
  function reset() {
    clear();
    if(allowed())timer=setTimeout(start,IDLE_DELAY);
  }
  for(const event of ['pointermove','pointerdown','keydown','wheel','scroll','touchstart'])addEventListener(event,reset,{passive:true});
  addEventListener('resize',reset,{passive:true});
  addEventListener('blur',clear);
  addEventListener('focus',reset);
  document.addEventListener('visibilitychange',reset);
  document.addEventListener('themechange',reset);
  reduced.addEventListener('change',reset);
  fine.addEventListener('change',reset);
  reset();
})();
