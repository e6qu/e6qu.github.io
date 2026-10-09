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
  // Three thoracic attachment sites; dimensions are display pixels, not measurements.
  const LEG_PAIRS = [
    {hip:3.2,foot:6.1,spread:6.2,bend:1},
    {hip:1,foot:.4,spread:7,bend:1},
    {hip:-1.2,foot:-4.8,spread:6.2,bend:-1},
  ];
  const FEMUR = 3.7, TIBIA = 4.6;
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
    const t={x,y,angle,phase:Math.random()*Math.PI*2,speed:1.4+Math.random(),
      turn:0,targetTurn:0,untilTurn:0,nibble:0,feeding:0,feedIn:2+Math.random()*3,
      strides:0,vx:0,vy:0,yaw:0};
    t.legs=[-1,1].flatMap(side => LEG_PAIRS.map((pair,index) => {
      // Each foot begins at its own stance position, without a shared gait clock.
      const point=worldPoint(t,pair.foot-.6+Math.random()*2.6,side*pair.spread);
      return {pair,side,index,...point,lift:0,swing:null,rest:Math.random()*.18,
        threshold:.75+Math.random()*.5,recovery:.26+Math.random()*.12,
        anticipation:.9+Math.random()*.2};
    }));
    return t;
  }
  function worldPoint(t,x,y) {
    const c=Math.cos(t.angle),s=Math.sin(t.angle);
    return {x:t.x+c*x-s*y,y:t.y+s*x+c*y};
  }
  function localPoint(t,x,y) {
    const c=Math.cos(t.angle),s=Math.sin(t.angle),dx=x-t.x,dy=y-t.y;
    return {x:c*dx+s*dy,y:-s*dx+c*dy};
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
    const before={x:t.x,y:t.y,angle:t.angle};
    if(t.feeding>0) {
      t.feeding=Math.max(0,t.feeding-elapsed);
      if(!t.feeding)t.feedIn=3+Math.random()*4;
      t.vx=t.vy=t.yaw=0;
      return;
    }
    t.feedIn-=elapsed;
    if(t.feedIn<=0) {
      t.feeding=1.1+Math.random()*.6;t.nibble=0;
      t.vx=t.vy=t.yaw=0;
      return;
    }
    t.untilTurn -= elapsed;
    if(t.untilTurn<=0) {
      // Persistent forward exploration, with small, gradually changing turns.
      t.targetTurn = (Math.random()+Math.random()-1)*.22;
      t.untilTurn = 2+Math.random()*3;
    }
    t.turn+=(t.targetTurn-t.turn)*(1-Math.exp(-elapsed*2));
    const c=Math.cos(t.angle),s=Math.sin(t.angle);
    const atEdge=(t.x<26&&c<0)||(t.x>width-26&&c>0)||
      (t.y<26&&s<0)||(t.y>height-26&&s>0);
    if(atEdge) {
      const inward=Math.atan2(height/2-t.y,width/2-t.x);
      const delta=Math.atan2(Math.sin(inward-t.angle),Math.cos(inward-t.angle));
      t.turn=Math.sign(delta||1)*.3;
    }
    t.angle += t.turn*elapsed;
    t.x=Math.max(10,Math.min(width-10,t.x+Math.cos(t.angle)*elapsed*t.speed));
    t.y=Math.max(10,Math.min(height-10,t.y+Math.sin(t.angle)*elapsed*t.speed));
    // Don't drag a support foot or extend a joint beyond its physical reach.
    for(let i=0;i<12 && t.legs.some(leg => stanceReach(t,leg)>8.1);i++) {
      t.x=(t.x+before.x)/2;t.y=(t.y+before.y)/2;t.angle=(t.angle+before.angle)/2;
    }
    t.vx=elapsed ? (t.x-before.x)/elapsed : 0;
    t.vy=elapsed ? (t.y-before.y)/elapsed : 0;
    t.yaw=elapsed ? (t.angle-before.angle)/elapsed : 0;
  }
  function stepLegs(t,elapsed) {
    for(const leg of t.legs) {
      leg.rest=Math.max(0,leg.rest-elapsed);
      if(!leg.swing)continue;
      const step=leg.swing;
      step.age=Math.min(step.duration,step.age+elapsed);
      const p=step.age/step.duration,ease=p*p*p*(10+p*(-15+6*p));
      // Minimum-jerk advance, slight inward recovery, and a lifted tarsus.
      const arc=Math.sin(Math.PI*p)**2; // Zero lift velocity at contact and touchdown.
      leg.x=step.from.x+(step.to.x-step.from.x)*ease+step.lateral.x*arc;
      leg.y=step.from.y+(step.to.y-step.from.y)*ease+step.lateral.y*arc;
      leg.lift=.85*arc;
      if(p===1) {leg.lift=0;leg.swing=null;leg.rest=.09;}
    }
    if(t.feeding>0)return;
    const velocity=localPoint({x:0,y:0,angle:t.angle},t.vx,t.vy);
    const candidates=[];
    for(const leg of t.legs) {
      if(leg.swing || leg.rest>0)continue;
      const foot=localPoint(t,leg.x,leg.y),pair=leg.pair;
      const vx=velocity.x-t.yaw*leg.side*pair.spread,vy=velocity.y+t.yaw*pair.foot;
      const speed=Math.hypot(vx,vy),reach=stanceReach(t,leg);
      const lag=speed>.01 ? ((pair.foot-foot.x)*vx+(leg.side*pair.spread-foot.y)*vy)/speed : 0;
      const urgency=Math.max(lag/leg.threshold,(reach-6.9)/.8);
      if(urgency>=1)candidates.push({leg,urgency,vx,vy});
    }
    candidates.sort((a,b) => b.urgency-a.urgency);
    for(const {leg,vx,vy} of candidates) {
      const offset=leg.side===-1 ? 0 : 3;
      const opposite=t.legs[(offset+3)%6+leg.index];
      const neighbors=t.legs.filter(other => other.side===leg.side && Math.abs(other.index-leg.index)===1);
      // Local support feedback: adjacent and opposing legs inhibit each other.
      // Other feet may recover independently, with four or more contacts retained.
      if(opposite.swing || neighbors.some(other => other.swing) ||
        t.legs.filter(other => other.swing).length>=2 || !supportsBody(t,leg))continue;
      const leadX=Math.max(-2.8,Math.min(2.8,vx*leg.anticipation));
      const leadY=Math.max(-1.1,Math.min(1.1,vy*leg.anticipation));
      leg.swing={age:0,duration:leg.recovery*(.94+Math.random()*.12),
        from:{x:leg.x,y:leg.y},to:worldPoint(t,leg.pair.foot+leadX,leg.side*leg.pair.spread+leadY),
        lateral:{x:Math.sin(t.angle)*leg.side*.35,y:-Math.cos(t.angle)*leg.side*.35}};
      t.strides++;
    }
  }
  function supportsBody(t,lifting) {
    // Contacts must surround the projected body center, rather than all lie on one side.
    const angles=t.legs.filter(leg => leg!==lifting && !leg.swing).map(leg => {
      const foot=localPoint(t,leg.x,leg.y);
      return Math.atan2(foot.y,foot.x+1.5);
    }).sort((a,b) => a-b);
    return angles.every((angle,i) =>
      (i+1<angles.length ? angles[i+1] : angles[0]+Math.PI*2)-angle<Math.PI-.08);
  }
  function stanceReach(t,leg) {
    const foot=localPoint(t,leg.x,leg.y);
    return Math.hypot(foot.x-.55-leg.pair.hip-leg.pair.bend*.3,
      foot.y-leg.side*(1.6+.65+.8),leg.lift+.06-1.55);
  }
  function legJoints(t,leg) {
    const foot={...localPoint(t,leg.x,leg.y),z:leg.lift};
    const root={x:leg.pair.hip,y:leg.side*1.6,z:1.7};
    const hip={x:root.x+leg.pair.bend*.3,y:root.y+leg.side*.65,z:1.55};
    const ankle={x:foot.x-.55,y:foot.y-leg.side*.8,z:foot.z+.06};
    const delta={x:ankle.x-hip.x,y:ankle.y-hip.y,z:ankle.z-hip.z};
    const reach=Math.hypot(delta.x,delta.y,delta.z);
    const unit={x:delta.x/reach,y:delta.y/reach,z:delta.z/reach};
    // Two-link inverse kinematics in 3D; knees flex instead of stretching bones.
    const distance=Math.max(Math.abs(FEMUR-TIBIA)+.001,Math.min(FEMUR+TIBIA-.001,reach));
    const along=(FEMUR*FEMUR-TIBIA*TIBIA+distance*distance)/(2*distance);
    const height=Math.sqrt(Math.max(0,FEMUR*FEMUR-along*along));
    const pole={x:leg.pair.bend,y:leg.side*.35,z:1.2};
    const dot=pole.x*unit.x+pole.y*unit.y+pole.z*unit.z;
    const normal={x:pole.x-dot*unit.x,y:pole.y-dot*unit.y,z:pole.z-dot*unit.z};
    const norm=Math.hypot(normal.x,normal.y,normal.z);
    const knee={x:hip.x+unit.x*along+normal.x/norm*height,
      y:hip.y+unit.y*along+normal.y/norm*height,
      z:hip.z+unit.z*along+normal.z/norm*height};
    return {root,hip,knee,ankle,foot,reach};
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
    ctx.lineCap='round';ctx.lineJoin='round';
    for(const leg of t.legs) {
      const {root,hip,knee,ankle,foot}=legJoints(t,leg);
      ctx.strokeStyle='#896c46';ctx.lineWidth=.7;
      ctx.beginPath();
      ctx.moveTo(root.x,root.y);ctx.lineTo(hip.x,hip.y);ctx.lineTo(knee.x,knee.y);ctx.stroke();
      ctx.strokeStyle='#b69a6f';ctx.lineWidth=.55;
      ctx.beginPath();ctx.moveTo(knee.x,knee.y);ctx.lineTo(ankle.x,ankle.y);ctx.stroke();
      ctx.strokeStyle='#806441';ctx.lineWidth=.4;
      ctx.beginPath();ctx.moveTo(ankle.x,ankle.y);ctx.lineTo(foot.x,foot.y);
      ctx.lineTo(foot.x+.35,foot.y+leg.side*.2);ctx.stroke();
      ctx.fillStyle=leg.lift>0 ? '#d9c29b' : '#806441';
      ctx.beginPath();ctx.arc(knee.x,knee.y,.4,0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle='#8e7048';ctx.lineWidth=.65;
    ctx.fillStyle='#e9d4a7';
    ctx.beginPath();ctx.ellipse(-5,0,5.5,3.8,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // Soft segmented worker abdomen, broad waist, and three thoracic plates.
    ctx.strokeStyle='rgba(142,112,72,.48)';ctx.lineWidth=.45;
    for(const x of [-8,-6.5,-5,-3.5]) {
      const span=3.65*Math.sqrt(1-((x+5)/5.5)**2);
      ctx.beginPath();ctx.moveTo(x,-span);ctx.quadraticCurveTo(x+.8,0,x,span);ctx.stroke();
    }
    ctx.strokeStyle='#8e7048';ctx.lineWidth=.6;ctx.fillStyle='#dfc697';
    for(const [x,rx,ry] of [[-1.1,1.6,2.5],[1,1.4,2.3],[3,1.5,2.5]]) {
      ctx.beginPath();ctx.ellipse(x,0,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    }
    ctx.fillStyle='#c4935d';
    ctx.beginPath();ctx.arc(6,0,3,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,241,206,.45)';
    ctx.beginPath();ctx.ellipse(6,-.7,1.9,1.1,-.2,0,Math.PI*2);ctx.fill();
    // Independent, bead-like antennae probe ahead rather than wagging with feet.
    for(const side of [-1,1]) {
      const scan=.19*Math.sin(now*.0017+t.phase+side*1.4)+.09*Math.sin(now*.0031+side);
      const direction=side*(.55+scan);
      ctx.strokeStyle='#997646';ctx.lineWidth=.4;
      ctx.beginPath();ctx.moveTo(7.8,side*1.5);
      for(let i=1;i<=12;i++) {
        const a=direction+side*i*.012;
        const x=7.8+Math.cos(a)*i*.57,y=side*1.5+Math.sin(a)*i*.57;
        ctx.lineTo(x,y);
      }
      ctx.stroke();ctx.fillStyle='#ba955f';
      for(let i=2;i<=12;i++) {
        const a=direction+side*i*.012;
        ctx.beginPath();ctx.arc(7.8+Math.cos(a)*i*.57,side*1.5+Math.sin(a)*i*.57,.23,0,Math.PI*2);ctx.fill();
      }
    }
    const chew=t.feeding>0 ? .25+.45*(1+Math.sin(now*.018+t.phase))/2 : .25;
    ctx.strokeStyle='#725136';ctx.lineWidth=.55;
    for(const side of [-1,1]) {
      ctx.beginPath();ctx.moveTo(8.4,side*.8);ctx.lineTo(9.5,side*chew);ctx.stroke();
    }
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
    if(now-lastPaint<33)return;
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
      stepLegs(t,elapsed);
      if(t.feeding>0)t.nibble+=elapsed;
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
