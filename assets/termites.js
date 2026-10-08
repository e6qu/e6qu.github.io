(() => {
  const canvas = document.querySelector('#termites');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(any-pointer: fine)');
  const IDLE_DELAY = 10000;
  const MAX_BITES = 180;
  let timer, frame, lastTime = 0, lastPaint = 0, active = false;
  let width = 0, height = 0, termites = [], bites = [], palette;
  function allowed() { return !reduced.matches && fine.matches && !document.hidden; }
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function makeTermite(left, y) {
    return {x:left ? 8 : width - 8, y, direction:left ? 1 : -1, angle:left ? 0 : Math.PI, phase:Math.random()*6.28, nibble:0};
  }
  function start() {
    if (!allowed()) return;
    resize();
    const css = getComputedStyle(document.documentElement);
    palette = {hole:css.getPropertyValue('--bite').trim(), dust:css.getPropertyValue('--muted').trim()};
    termites = [makeTermite(true, height*.24), makeTermite(false, height*.58), makeTermite(true, height*.83)];
    bites = [];
    active = true;
    lastTime = lastPaint = 0;
    canvas.setAttribute('data-active', '');
    frame = requestAnimationFrame(tick);
  }
  function drawTermite(t, now) {
    ctx.save();
    ctx.translate(t.x,t.y);
    ctx.rotate(t.angle);
    ctx.strokeStyle = '#55412a';
    ctx.lineWidth = 1;
    const walk = Math.sin(now*.011+t.phase)*2;
    for (let i=0;i<3;i++) {
      const x=-3+i*3;
      ctx.beginPath();
      ctx.moveTo(x,-2);ctx.lineTo(x-3+walk,-6);ctx.lineTo(x-1+walk,-9);
      ctx.moveTo(x,2);ctx.lineTo(x-3-walk,6);ctx.lineTo(x-1-walk,9);
      ctx.stroke();
    }
    ctx.fillStyle = '#e9d4a7';
    ctx.beginPath();ctx.ellipse(-5,0,5.5,3.8,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(1,0,3.2,2.7,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#b97841';
    ctx.beginPath();ctx.arc(6,0,3,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(8,-1);ctx.lineTo(12,-4);ctx.moveTo(8,1);ctx.lineTo(12,4);ctx.stroke();
    ctx.restore();
  }
  function tick(now) {
    if (!active) return;
    frame = requestAnimationFrame(tick);
    if (now-lastPaint < 80) return;
    const elapsed = lastTime ? Math.min((now-lastTime)/1000,.2) : 0;
    lastTime = lastPaint = now;
    ctx.clearRect(0,0,width,height);
    for (const t of termites) {
      t.x += t.direction * elapsed * 3.2;
      t.y += Math.sin(now*.0006+t.phase)*elapsed*2;
      t.angle = (t.direction===1 ? 0 : Math.PI) + Math.sin(now*.0008+t.phase)*.3;
      t.nibble += elapsed;
      if (t.nibble > .7 && bites.length < MAX_BITES) {
        t.nibble=0;
        bites.push({x:t.x+Math.cos(t.angle)*8,y:t.y+Math.sin(t.angle)*8,r:6+Math.random()*5,phase:Math.random()*6.28});
      }
    }
    ctx.fillStyle = palette.hole;
    for (const b of bites) {
      ctx.beginPath();
      for (let i=0;i<14;i++) {
        const angle=i/14*Math.PI*2;
        const radius=b.r*(.87+.13*Math.sin(i*2.3+b.phase));
        const x=b.x+Math.cos(angle)*radius,y=b.y+Math.sin(angle)*radius;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.closePath();ctx.fill();
    }
    ctx.fillStyle=palette.dust;
    for (const b of bites.slice(-12)) {
      ctx.globalAlpha=.35;
      ctx.fillRect(b.x+Math.cos(b.phase)*14,b.y+Math.sin(b.phase)*14,1.3,1.3);
    }
    ctx.globalAlpha=1;
    for(const t of termites)drawTermite(t,now);
    // Keep the effect small and bounded even when a tab is left idle for hours.
    if (bites.length === MAX_BITES) { cancelAnimationFrame(frame); frame=undefined; }
  }
  function clear() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    if(active)ctx.clearRect(0,0,width,height);
    active=false;termites=[];bites=[];
    canvas.removeAttribute('data-active');
  }
  function reset() {
    clear();
    if(allowed())timer=setTimeout(start,IDLE_DELAY);
  }
  for(const event of ['pointermove','pointerdown','keydown','wheel','scroll','touchstart']) {
    addEventListener(event,reset,{passive:true});
  }
  addEventListener('resize',reset,{passive:true});
  addEventListener('blur',clear);
  addEventListener('focus',reset);
  document.addEventListener('visibilitychange',reset);
  document.addEventListener('themechange',reset);
  reduced.addEventListener('change',reset);
  fine.addEventListener('change',reset);
  reset();
})();
