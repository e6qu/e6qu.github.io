(() => {
  const canvas = document.querySelector('#termites');
  const ctx = canvas.getContext('2d');
  const damage = document.createElement('canvas');
  const eaten = damage.getContext('2d');
  if (!ctx || !eaten) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(any-pointer: fine)');
  const IDLE_DELAY = 10000;
  const MAX_PER_SPECIES = 10;
  let timer, frame, lastTime = null, lastPaint = 0, nextSpawn = 0, active = false;
  let width = 0, height = 0, termites = [], ants = [];
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
  function insect(x, y, angle, margin=10) {
    return {x,y,angle,phase:Math.random()*Math.PI*2,speed:1.4+Math.random(),
      turn:0,untilTurn:0,nibble:0,margin};
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
  function addAnt() {
    const edge=Math.floor(Math.random()*4);
    const position=Math.random();
    const x=edge<2 ? (edge===0 ? 0 : width) : 20+position*(width-40);
    const y=edge<2 ? 20+position*(height-40) : (edge===2 ? 0 : height);
    const ant=insect(x,y,[0,Math.PI,Math.PI/2,-Math.PI/2][edge],0);
    ant.untilTurn=3;
    ants.push(ant);
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
    if(t.x<t.margin || t.x>width-t.margin) {
      t.x=Math.max(t.margin,Math.min(width-t.margin,t.x));
      t.angle=Math.PI-t.angle;
      t.turn=-t.turn;
    }
    if(t.y<t.margin || t.y>height-t.margin) {
      t.y=Math.max(t.margin,Math.min(height-t.margin,t.y));
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
  function drawAnt(t,now) {
    ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.angle);
    ctx.lineCap='round';ctx.lineJoin='round';
    // Alternating tripods: front/rear on one side, middle on the other.
    for(const side of [-1,1]) {
      for(let i=0;i<3;i++) {
        const stride=Math.sin(now*.005+t.phase+(i===1 ? Math.PI : 0)+(side===1 ? Math.PI : 0));
        const root=.4+i*1.9, knee=[-3,1,7][i], foot=[-7,-1,10][i];
        ctx.strokeStyle='#9c6140';ctx.lineWidth=.9;
        ctx.beginPath();ctx.moveTo(root,side*1.1);
        ctx.lineTo(knee+stride*.6,side*4);
        ctx.lineTo(foot+stride*1.3,side*(7.5-stride*.6));ctx.stroke();
        ctx.strokeStyle='#6e422f';ctx.lineWidth=.65;
        ctx.beginPath();ctx.moveTo(foot+stride*1.3,side*(7.5-stride*.6));
        ctx.lineTo(foot-1.5+stride*1.6,side*9.5);ctx.stroke();
      }
    }
    ctx.strokeStyle='#a26c49';ctx.lineWidth=.6;
    ctx.fillStyle='#39251e';
    ctx.beginPath();ctx.ellipse(-7.2,0,5,3.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // A raised petiole separates the abdomen from the leg-bearing thorax.
    ctx.fillStyle='#895034';
    ctx.beginPath();ctx.ellipse(-1.5,0,1.1,.85,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#683c28';
    ctx.beginPath();ctx.moveTo(-.3,-1.2);
    ctx.bezierCurveTo(1,-2.8,4.2,-2.4,5.5,-1.3);
    ctx.bezierCurveTo(6,.4,4.7,2.1,3,1.9);
    ctx.bezierCurveTo(1.6,1.6,.1,1.7,-.3,1.2);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#76432b';
    ctx.beginPath();ctx.ellipse(8,0,3,2.6,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // Fine reflections make the shell rounded without obscuring its silhouette.
    ctx.strokeStyle='#bc8b61';ctx.lineWidth=.45;
    ctx.beginPath();ctx.ellipse(-7.4,-.6,3.5,2,0,Math.PI*1.1,Math.PI*1.8);ctx.stroke();
    ctx.beginPath();ctx.moveTo(1,-1.4);ctx.quadraticCurveTo(3,-1.9,4.2,-1.3);ctx.stroke();
    ctx.fillStyle='#160e0b';
    for(const side of [-1,1]) {
      ctx.beginPath();ctx.ellipse(8.8,side*2,.55,.8,side*.3,0,Math.PI*2);ctx.fill();
      const feel=Math.sin(now*.0018+t.phase+side)*.55;
      ctx.strokeStyle='#aa7350';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(9,side*1.5);
      ctx.lineTo(12,side*5+feel);ctx.lineTo(17,side*6.5+feel);ctx.stroke();
      ctx.strokeStyle='#855132';
      ctx.beginPath();ctx.moveTo(10.5,side*.9);
      ctx.lineTo(12.5,side*.8);ctx.lineTo(11.8,side*.2);ctx.stroke();
    }
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
      const termiteCoin=Math.random()<.5, antCoin=Math.random()<.5;
      if(termiteCoin && termites.length<MAX_PER_SPECIES)addTermite();
      if(antCoin && ants.length<MAX_PER_SPECIES)addAnt();
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
    for(const ant of ants)wander(ant,elapsed);
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(damage,0,0,width,height);
    for(const t of termites)drawTermite(t,now);
    for(const ant of ants)drawAnt(ant,now);
  }
  function clear() {
    clearTimeout(timer);cancelAnimationFrame(frame);
    if(active) {ctx.clearRect(0,0,width,height);eaten.clearRect(0,0,width,height);}
    active=false;termites=[];ants=[];canvas.removeAttribute('data-active');
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
