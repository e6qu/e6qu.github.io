const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function simulation() {
  const listeners = {}, timers = new Map();
  let id = 0, random = () => .5, damageFills = 0, damageClears = 0;
  const drawing = new Proxy({}, {get: (target, key) => target[key] || (() => {})});
  const damage = new Proxy({fill: () => damageFills++, clearRect: () => damageClears++},
    {get: (target, key) => target[key] || (() => {})});
  const canvas = {getContext: () => drawing, setAttribute() {}, removeAttribute() {}};
  const reduced = {matches: false, addEventListener: (name, fn) => listeners.reduced = fn};
  const fine = {matches: true, addEventListener: (name, fn) => listeners.fine = fn};
  const document = {hidden: false, querySelector: () => canvas,
    createElement: () => ({getContext: () => damage}),
    addEventListener: (name, fn) => listeners[name] = fn};
  const math = Object.create(Math);
  math.random = () => random();
  const context = vm.createContext({document, Math: math, innerWidth: 800, innerHeight: 600,
    devicePixelRatio: 1, matchMedia: query => query.includes('reduced') ? reduced : fine,
    addEventListener: (name, fn) => listeners[name] = fn,
    requestAnimationFrame: () => ++id, cancelAnimationFrame() {},
    setTimeout: (fn, delay) => {timers.set(++id, {fn, delay}); return id;},
    clearTimeout: id => timers.delete(id)});
  const source = fs.readFileSync('assets/termites.js', 'utf8');
  // Inspect the closure only in this VM; the shipped script exposes no test API.
  const ending = '  reset();\n})();';
  assert.ok(source.endsWith(ending + '\n'));
  vm.runInContext(source.replace(ending, `
    globalThis.inspect = () => ({active, termites, grass, butterflies});
    globalThis.paint = tick;
    globalThis.reposition = (t,x,y,angle) => Object.assign(t,insect(x,y,angle));
    globalThis.walk = (t,dt) => {wander(t,dt);stepLegs(t,dt);};
    globalThis.joints = legJoints;
    reset();
  })();`), context);
  return {
    state: () => context.inspect(), tick: time => context.paint(time),
    place: (t,x=400,y=300,angle=0) => context.reposition(t,x,y,angle),
    walk: (t,dt) => context.walk(t,dt), joints: (t,leg) => context.joints(t,leg),
    random: fn => random = fn, timers, listeners, reduced, document,
    fills: () => damageFills, clears: () => damageClears,
    start() {const timer = [...timers.values()][0]; timers.clear(); timer.fn(); this.tick(100);},
  };
}

test('waits ten seconds, clears the idle scene and damage, restarts idle timer', () => {
  const s=simulation();
  assert.equal([...s.timers.values()][0].delay,10000);
  assert.equal(s.state().active,false);
  s.start();s.random(() => 0);s.tick(1100);
  assert.equal(s.state().termites.length,4);
  s.listeners.pointermove();
  assert.equal(s.state().active,false);
  assert.equal(s.state().termites.length+s.state().grass.length+s.state().butterflies.length,0);
  assert.equal(s.clears(),1);
  assert.equal([...s.timers.values()][0].delay,10000);
});

test('independent coins run once per second and preserve the population limits', () => {
  const s=simulation();s.start();s.random(() => .9);s.tick(1100);
  assert.equal(s.state().termites.length,3);
  assert.equal(s.state().butterflies.length,2);
  let values=[1,0];s.random(() => values.length ? values.shift() : .5);s.tick(2100);
  assert.equal(s.state().termites.length,3);
  assert.equal(s.state().butterflies.length,3);
  values=[0,1];s.tick(3100);
  assert.equal(s.state().termites.length,4);
  assert.equal(s.state().butterflies.length,3);
  s.random(() => 0);s.tick(3500);
  assert.equal(s.state().termites.length,4);
  assert.equal(s.state().butterflies.length,3);
  for(let now=4100;now<=24100;now+=1000)s.tick(now);
  assert.equal(s.state().termites.length,10);
  assert.equal(s.state().butterflies.length,6);
});

test('termites keep slow random walks, dark bites and viewport boundaries', () => {
  const s=simulation();s.start();s.random(() => .9);
  const t=s.state().termites[0];s.place(t);
  const fills=s.fills();
  for(let now=200;now<=5100;now+=100) {
    const before={x:t.x,y:t.y};s.tick(now);
    assert.ok(Math.hypot(t.x-before.x,t.y-before.y)<=.240001);
    assert.ok(t.x>=10 && t.x<=790 && t.y>=10 && t.y<=590);
  }
  assert.notEqual(t.angle,0);
  assert.ok(s.fills()>fills);
  s.place(t,10,10,Math.PI*1.25);t.feedIn=100;
  for(let now=5200;now<=17100;now+=100) {
    const angle=t.angle;s.tick(now);
    assert.ok(t.x>=10 && t.y>=10);
    assert.ok(Math.abs(t.angle-angle)<=.030001,'edge turns must not snap the body');
  }
  assert.ok(Math.cos(t.angle)>0 && Math.sin(t.angle)>0);
});

test('slow gait advances hind-middle-front on each side with five planted supports', () => {
  const s=simulation();s.start();const t=s.state().termites[0];s.place(t);
  t.feedIn=100;t.untilTurn=100;
  const order=[];
  for(let i=0;i<650;i++) {
    const before=t.legs.map(leg => ({x:leg.x,y:leg.y,swing:leg.swing}));
    s.walk(t,1/30);
    assert.ok(t.legs.filter(leg => leg.swing).length<=1);
    t.legs.forEach((leg,index) => {
      if(!before[index].swing && leg.swing)order.push(index);
      if(!before[index].swing && !leg.swing) {
        assert.equal(leg.x,before[index].x,'stance foot must stay fixed on the page');
        assert.equal(leg.y,before[index].y,'stance foot must stay fixed on the page');
      }
    });
  }
  assert.ok(order.length>=18,'exercise at least three complete walking cycles');
  for(let i=0;i<order.length;i++)assert.equal(order[i],[2,1,0,5,4,3][i%6]);
});

test('joint lengths stay fixed in 3D while feet lift, flex and settle during turns', () => {
  const s=simulation();s.start();const t=s.state().termites[0];s.place(t);
  t.speed=2.4;t.feedIn=1000;t.untilTurn=1000;t.turn=t.targetTurn=.19;
  let lifted=0,flexMin=Infinity,flexMax=0,outside=0,inside=0;
  const distance=(a,b) => Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
  for(let i=0;i<1500;i++) {
    const before=t.legs.map(leg => ({x:leg.x,y:leg.y,swing:leg.swing}));
    s.walk(t,1/30);
    for(const [index,leg] of t.legs.entries()) {
      const j=s.joints(t,leg);
      assert.ok(j.reach<8.3 && j.reach>.9,`joint reach ${j.reach} at frame ${i}, leg ${index}`);
      assert.ok(Math.abs(distance(j.hip,j.knee)-3.7)<1e-9,'femur cannot stretch');
      assert.ok(Math.abs(distance(j.knee,j.ankle)-4.6)<1e-9,'tibia cannot stretch');
      assert.ok(Math.abs(distance(j.ankle,j.foot)-Math.hypot(.55,.8,.06))<1e-9);
      assert.ok(leg.lift>=0 && leg.lift<=.85);
      if(leg.lift>0)lifted++;
      flexMin=Math.min(flexMin,j.reach);flexMax=Math.max(flexMax,j.reach);
      if(!before[index].swing && !leg.swing) {
        assert.equal(leg.x,before[index].x);assert.equal(leg.y,before[index].y);
      }
      if(!before[index].swing && leg.swing) {
        const length=Math.hypot(leg.swing.to.x-leg.x,leg.swing.to.y-leg.y);
        if(leg.side<0)outside+=length;else inside+=length;
      }
    }
  }
  assert.ok(lifted>100 && flexMax-flexMin>2,'joint flexion must follow the step');
  assert.ok(outside>inside,'outer legs must cover more distance in a turn');
});

test('feeding pauses the body and settles the last swing without walking in place', () => {
  const s=simulation();s.start();const t=s.state().termites[0];s.place(t);
  t.feedIn=100;t.untilTurn=100;
  for(let i=0;i<60 && !t.legs.some(leg => leg.swing);i++)s.walk(t,1/30);
  assert.ok(t.legs.some(leg => leg.swing));
  t.feedIn=0;s.walk(t,1/30);
  const body={x:t.x,y:t.y,angle:t.angle},strides=t.strides;
  for(let i=0;i<25;i++) {
    s.walk(t,1/30);
    assert.equal(t.x,body.x);assert.equal(t.y,body.y);assert.equal(t.angle,body.angle);
    assert.equal(t.strides,strides);
  }
  assert.ok(t.legs.every(leg => !leg.swing && leg.lift===0));
});

test('edge recovery and irregular frame intervals preserve joint reach and support', () => {
  const s=simulation();s.start();let seed=734;
  s.random(() => ((seed=(seed*1664525+1013904223)>>>0)/2**32));
  for(const [x,y,angle] of [[10,10,Math.PI*1.25],[790,590,Math.PI/4],[400,300,0]]) {
    const t=s.state().termites[0];s.place(t,x,y,angle);t.speed=2.4;
    for(let i=0;i<2000;i++) {
      s.walk(t,[1/30,.08,.2][i%3]);
      assert.ok(t.legs.filter(leg => leg.swing).length<=1);
      for(const leg of t.legs) {
        const j=s.joints(t,leg);
        assert.ok(j.reach<8.3 && j.reach>.9,`unreachable foot: ${j.reach}, frame ${i}`);
        assert.ok(Object.values(j.knee).every(Number.isFinite));
      }
    }
  }
});

test('termites still enter from each screen edge facing inward', () => {
  for(let edge=0;edge<4;edge++) {
    const s=simulation();s.start();
    const values=[0,1,(edge+.1)/4,.5];
    s.random(() => values.length ? values.shift() : .5);s.tick(1100);
    const t=s.state().termites.at(-1);
    const distance=[t.x-10,790-t.x,t.y-10,590-t.y][edge];
    assert.ok(distance>=0 && distance<=.48);
    assert.equal(t.angle,[0,Math.PI,Math.PI/2,-Math.PI/2][edge]);
  }
});

test('hidden tabs and reduced motion clear insects and prevent idle activation', () => {
  const s = simulation(); s.start();
  s.document.hidden = true; s.listeners.visibilitychange();
  assert.equal(s.state().active, false); assert.equal(s.timers.size, 0);
  s.document.hidden = false; s.listeners.visibilitychange();
  assert.equal(s.timers.size, 1);
  s.reduced.matches = true; s.listeners.reduced();
  assert.equal(s.timers.size, 0);
});

test('grass sprouts slowly across the viewport and stops at a bounded population', () => {
  const s=simulation();s.start();
  const first=s.state().grass[0];
  assert.equal(first.growth,0);
  s.tick(200);assert.ok(first.growth>0 && first.growth<.01);
  s.random(() => 0);
  for(let now=1200;now<=101200;now+=1000)s.tick(now);
  assert.equal(s.state().grass.length,96);
  assert.ok(s.state().grass.some(g => g.y<100));
  assert.ok(s.state().grass.some(g => g.y>500));
  for(const g of s.state().grass)assert.ok(g.growth>=0 && g.growth<=1);
  assert.equal(s.state().butterflies.length,6);
  s.listeners.pointermove();
  assert.equal(s.state().grass.length+s.state().butterflies.length,0);
});

test('butterflies follow changing curved flight paths without eating the page', () => {
  const s=simulation();s.start();
  s.state().termites.length=0;
  const b=s.state().butterflies[0];b.x=400;b.y=300;b.angle=0;b.untilTurn=0;
  const values=[.1,.1,.1];
  s.random(() => values.length ? values.shift() : .9);
  const fills=s.fills();
  const positions=[];
  for(let now=200;now<=1500;now+=100) {
    const before={x:b.x,y:b.y,angle:b.angle};s.tick(now);
    assert.ok(Math.hypot(b.x-before.x,b.y-before.y)<=2.40001);
    assert.ok(Math.abs(b.angle-before.angle)<=.080001);
    assert.ok(b.x>=-24 && b.x<=824 && b.y>=-24 && b.y<=624);
    positions.push([b.x,b.y]);
  }
  const target={x:b.targetX,y:b.targetY};
  s.random(() => .9);b.untilTurn=0;s.tick(1600);
  assert.ok(b.targetX!==target.x && b.targetY!==target.y);
  assert.ok(positions.at(-1)[0]!==positions[0][0] && positions.at(-1)[1]!==positions[0][1]);
  assert.equal(s.fills(),fills);
});
