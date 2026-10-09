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
  const ANT_STRIDE = 4, ANT_STANCE = .6;
  const ANT_LEGS = [-1,1].flatMap(side => [0,1,2].map(index => ({
    side,index,root:.4+index*1.9,foot:[-8,-1,10][index],
    offset:((index===1 ? 1 : 0)+(side===1 ? 1 : 0))%2*.5,
  })));
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
    ant.untilTurn=3;ant.turnTarget=0;ant.gait=0;
    ant.legs=ANT_LEGS.map(leg => ({...worldPoint(ant,
      leg.foot+ANT_STRIDE*(ANT_STANCE/2-leg.offset),leg.side*9.5),stance:true,lift:0}));
    ants.push(ant);
  }
  function worldPoint(t,x,y) {
    const cos=Math.cos(t.angle),sin=Math.sin(t.angle);
    return {x:t.x+x*cos-y*sin,y:t.y+x*sin+y*cos};
  }
  function walkAnt(t,elapsed) {
    t.untilTurn-=elapsed;
    if(t.untilTurn<=0) {
      t.turnTarget=(Math.random()-.5)*1.5;
      t.untilTurn=.8+Math.random()*1.2;
    }
    // Turn toward the interior gradually rather than bouncing off the border.
    const fx=Math.max(0,1-t.x/20)-Math.max(0,1-(width-t.x)/20);
    const fy=Math.max(0,1-t.y/20)-Math.max(0,1-(height-t.y)/20);
    const weight=Math.min(.85,Math.hypot(fx,fy));
    const heading=Math.atan2(Math.sin(t.angle)+fy,Math.cos(t.angle)+fx);
    const error=Math.atan2(Math.sin(heading-t.angle),Math.cos(heading-t.angle));
    const target=t.turnTarget*(1-weight)+error*2*weight;
    t.turn+=(target-t.turn)*(1-Math.exp(-elapsed*4));
    t.angle+=t.turn*elapsed;
    const oldX=t.x,oldY=t.y;
    t.x=Math.max(0,Math.min(width,t.x+Math.cos(t.angle)*elapsed*t.speed));
    t.y=Math.max(0,Math.min(height,t.y+Math.sin(t.angle)*elapsed*t.speed));
    t.gait+=Math.hypot(t.x-oldX,t.y-oldY)/ANT_STRIDE;
    for(let i=0;i<ANT_LEGS.length;i++) {
      const leg=ANT_LEGS[i],foot=t.legs[i],phase=(t.gait+leg.offset)%1;
      const stance=phase<ANT_STANCE;
      if(stance) {
        if(!foot.stance)Object.assign(foot,worldPoint(t,leg.foot+ANT_STRIDE*ANT_STANCE/2,leg.side*9.5));
        foot.lift=0;
      }else {
        if(foot.stance)foot.start={x:foot.x,y:foot.y};
        const progress=(phase-ANT_STANCE)/(1-ANT_STANCE);
        const smooth=progress*progress*(3-2*progress);
        foot.lift=Math.sin(progress*Math.PI);
        const landing=worldPoint(t,leg.foot+ANT_STRIDE*ANT_STANCE/2,leg.side*(9.5+foot.lift));
        foot.x=foot.start.x+(landing.x-foot.start.x)*smooth;
        foot.y=foot.start.y+(landing.y-foot.start.y)*smooth;
      }
      foot.stance=stance;
    }
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
    const cos=Math.cos(t.angle),sin=Math.sin(t.angle);
    for(let i=0;i<ANT_LEGS.length;i++) {
      const leg=ANT_LEGS[i],foot=t.legs[i],rootY=leg.side*1.1;
      const wx=foot.x-t.x,wy=foot.y-t.y;
      const x=wx*cos+wy*sin,y=-wx*sin+wy*cos;
      const dx=x-leg.root,dy=y-rootY,d=Math.max(.001,Math.hypot(dx,dy));
      // Two linked segments solve the knee position around the planted foot.
      const femur=[4.5,3.5,4.3][leg.index],tibia=[8,6,7.5][leg.index];
      const along=(femur*femur-tibia*tibia+d*d)/(2*d);
      const bend=Math.sqrt(Math.max(0,femur*femur-along*along))*-leg.side*(leg.index===2 ? -1 : 1);
      const kneeX=leg.root+dx/d*along-dy/d*bend;
      const kneeY=rootY+dy/d*along+dx/d*bend;
      ctx.strokeStyle='#9c6140';ctx.lineWidth=.9;
      ctx.beginPath();ctx.moveTo(leg.root,rootY);ctx.lineTo(kneeX,kneeY);ctx.stroke();
      ctx.strokeStyle='#6e422f';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(kneeX,kneeY);ctx.lineTo(x,y);ctx.stroke();
      ctx.fillStyle=foot.stance ? '#5b3726' : '#ad7853';
      ctx.beginPath();ctx.ellipse(x,y,.55,.45,0,0,Math.PI*2);ctx.fill();
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
    for(const ant of ants)walkAnt(ant,elapsed);
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
