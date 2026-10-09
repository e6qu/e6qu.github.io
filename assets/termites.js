(() => {
  const canvas = document.querySelector('#termites');
  const ctx = canvas.getContext('2d');
  const damage = document.createElement('canvas');
  const eaten = damage.getContext('2d');
  if (!ctx || !eaten) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(any-pointer: fine)');
  const IDLE_DELAY = 10000;
  const MAX_TERMITES = 10;
  const MAX_GRASS = 96, MAX_BUTTERFLIES = 6;
  let timer, frame, lastTime = null, lastPaint = 0, nextSpawn = 0, active = false;
  let width = 0, height = 0, termites = [], grass = [], butterflies = [];
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
  function insect(x, y, angle) {
    return {x,y,angle,phase:Math.random()*Math.PI*2,speed:1.4+Math.random(),
      turn:0,untilTurn:0,nibble:0};
  }
  function addTermite() {
    const edge = Math.floor(Math.random()*4);
    const horizontal = edge < 2;
    const x = horizontal ? (edge===0 ? 10 : width-10) : 10+Math.random()*(width-20);
    const y = horizontal ? 10+Math.random()*(height-20) : (edge===2 ? 10 : height-10);
    const angle = [0,Math.PI,Math.PI/2,-Math.PI/2][edge];
    const t = insect(x,y,angle);
    termites.push(t);
    bite(horizontal ? (edge===0 ? 0 : width) : x,
      horizontal ? y : (edge===2 ? 0 : height),23,t.phase);
  }
  function seedGrass(x=15+Math.random()*(width-30),y=45+Math.random()*(height-45)) {
    if(grass.length>=MAX_GRASS)return;
    grass.push({x,y,growth:0,duration:18+Math.random()*16,phase:Math.random()*Math.PI*2,
      blades:Array.from({length:7},() => ({
        root:(Math.random()-.5)*12,lean:(Math.random()-.5)*30,
        height:16+Math.random()*28,color:['#356b49','#5b874f','#87a965'][Math.floor(Math.random()*3)],
      }))});
  }
  function addButterfly() {
    const left=Math.random()<.5;
    butterflies.push({x:left ? 0 : width,y:30+Math.random()*(height-60),
      angle:left ? 0 : Math.PI,speed:12+Math.random()*10,phase:Math.random()*Math.PI*2,
      size:.65+Math.random()*.3,color:['#e9ab5d','#81aee0','#e4cc79','#db8b92'][Math.floor(Math.random()*4)],
      targetX:width/2,targetY:height/2,untilTurn:0,age:0});
  }
  function fly(b,elapsed) {
    b.age+=elapsed;b.untilTurn-=elapsed;
    if(b.untilTurn<=0 || Math.hypot(b.targetX-b.x,b.targetY-b.y)<35) {
      b.targetX=24+Math.random()*(width-48);
      b.targetY=24+Math.random()*(height-48);
      b.untilTurn=3+Math.random()*4;
    }
    const heading=Math.atan2(b.targetY-b.y,b.targetX-b.x);
    const turn=Math.atan2(Math.sin(heading-b.angle),Math.cos(heading-b.angle));
    b.angle+=Math.max(-elapsed*.8,Math.min(elapsed*.8,turn));
    const drift=Math.sin(b.age*2.5+b.phase)*2;
    b.x+=(Math.cos(b.angle)*b.speed-Math.sin(b.angle)*drift)*elapsed;
    b.y+=(Math.sin(b.angle)*b.speed+Math.cos(b.angle)*drift)*elapsed;
    // Wrap beyond the visible wings so a crossing never teleports on screen.
    if(b.x < -24)b.x=width+24;else if(b.x>width+24)b.x=-24;
    if(b.y < -24)b.y=height+24;else if(b.y>height+24)b.y=-24;
  }
  function wander(t, elapsed) {
    t.untilTurn -= elapsed;
    if(t.untilTurn<=0) {
      t.turn = (Math.random()-.5)*1.8;
      t.untilTurn = .8+Math.random()*1.2;
    }
    t.angle += t.turn*elapsed;
    t.x += Math.cos(t.angle)*elapsed*t.speed;
    t.y += Math.sin(t.angle)*elapsed*t.speed;
    if(t.x<10 || t.x>width-10) {
      t.x=Math.max(10,Math.min(width-10,t.x));
      t.angle=Math.PI-t.angle;
      t.turn=-t.turn;
    }
    if(t.y<10 || t.y>height-10) {
      t.y=Math.max(10,Math.min(height-10,t.y));
      t.angle=-t.angle;
      t.turn=-t.turn;
    }
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
    for(let i=0;i<3;i++)addTermite();
    for(let i=0;i<5;i++)seedGrass(width*(i+.5)/5,height-2);
    for(let i=0;i<2;i++)addButterfly();
    active=true;lastTime=null;lastPaint=nextSpawn=0;
    canvas.setAttribute('data-active','');
    frame=requestAnimationFrame(tick);
  }
  function drawTermite(t,now) {
    ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.angle);
    ctx.strokeStyle='#8e7048';ctx.lineWidth=1;
    const walk=Math.sin(now*.005+t.phase)*2;
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
  function drawGrass(g,now) {
    ctx.save();ctx.globalAlpha=.25+.6*g.growth;
    const sway=Math.sin(now*.0007+g.phase)*2*g.growth;
    for(const blade of g.blades) {
      const x=g.x+blade.root,height=blade.height*g.growth;
      const lean=blade.lean*g.growth+sway;
      ctx.fillStyle=blade.color;
      ctx.beginPath();ctx.moveTo(x-1,g.y);
      ctx.quadraticCurveTo(x+lean*.15-1,g.y-height*.6,x+lean,g.y-height);
      ctx.quadraticCurveTo(x+lean*.35+1,g.y-height*.45,x+1,g.y);
      ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }
  function drawButterfly(b,now) {
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle+Math.PI/2);ctx.scale(b.size,b.size);
    const flap=.2+.8*(Math.sin(now*.012+b.phase)+1)/2;
    ctx.save();ctx.scale(flap,1);
    for(const side of [-1,1]) {
      ctx.save();ctx.scale(side,1);
      ctx.fillStyle=b.color;ctx.strokeStyle='#584338';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(1,-3);
      ctx.bezierCurveTo(7,-17,20,-19,18,-6);
      ctx.bezierCurveTo(17,0,11,4,2,2);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(2,1);
      ctx.bezierCurveTo(13,-1,16,7,10,11);
      ctx.bezierCurveTo(5,14,2,8,1,4);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='#78573f';ctx.lineWidth=.45;
      ctx.beginPath();ctx.moveTo(2,-2);ctx.lineTo(14,-11);
      ctx.moveTo(2,1);ctx.lineTo(13,-3);ctx.moveTo(2,3);ctx.lineTo(9,8);ctx.stroke();
      ctx.fillStyle='#f5e2b7';
      for(const [x,y] of [[14,-12],[16,-8],[12,7]]) {
        ctx.beginPath();ctx.arc(x,y,1.1,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
    ctx.strokeStyle='#39302c';ctx.lineWidth=1.7;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,6);ctx.stroke();
    ctx.lineWidth=.6;
    ctx.beginPath();ctx.moveTo(0,-4);ctx.quadraticCurveTo(-4,-8,-2,-10);
    ctx.moveTo(0,-4);ctx.quadraticCurveTo(4,-8,2,-10);ctx.stroke();
    ctx.restore();
  }
  function tick(now) {
    if(!active)return;
    frame=requestAnimationFrame(tick);
    if(now-lastPaint<80)return;
    const elapsed=lastTime===null ? 0 : Math.min((now-lastTime)/1000,.2);
    lastTime=lastPaint=now;
    if(!nextSpawn)nextSpawn=now+1000;
    if(now>=nextSpawn) {
      // One independent coin per species per second; never replay missed ticks.
      const termiteCoin=Math.random()<.5, butterflyCoin=Math.random()<.5;
      if(termiteCoin && termites.length<MAX_TERMITES)addTermite();
      if(butterflyCoin && butterflies.length<MAX_BUTTERFLIES)addButterfly();
      seedGrass();seedGrass();
      nextSpawn+= (Math.floor((now-nextSpawn)/1000)+1)*1000;
    }
    for(const t of termites) {
      wander(t,elapsed);
      t.nibble+=elapsed;
      if(t.nibble>.55) {
        t.nibble=0;
        bite(t.x+Math.cos(t.angle)*8,t.y+Math.sin(t.angle)*8,13+Math.random()*7,now*.004+t.phase);
      }
    }
    for(const b of butterflies)fly(b,elapsed);
    for(const g of grass)g.growth=Math.min(1,g.growth+elapsed/g.duration);
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(damage,0,0,width,height);
    for(const g of grass)drawGrass(g,now);
    for(const t of termites)drawTermite(t,now);
    for(const b of butterflies)drawButterfly(b,now);
  }
  function clear() {
    clearTimeout(timer);cancelAnimationFrame(frame);
    if(active) {ctx.clearRect(0,0,width,height);eaten.clearRect(0,0,width,height);}
    active=false;termites=[];grass=[];butterflies=[];canvas.removeAttribute('data-active');
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
