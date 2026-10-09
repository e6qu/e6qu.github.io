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
    globalThis.inspect = () => ({active, termites, ants, grass, butterflies});
    globalThis.paint = tick;
    reset();
  })();`), context);
  return {
    state: () => context.inspect(), tick: time => context.paint(time),
    random: fn => random = fn, timers, listeners, reduced, document,
    fills: () => damageFills, clears: () => damageClears,
    start() {const timer = [...timers.values()][0]; timers.clear(); timer.fn(); this.tick(100);},
  };
}

test('waits ten seconds, clears both species and damage, restarts idle timer', () => {
  const s = simulation();
  assert.equal([...s.timers.values()][0].delay, 10000);
  assert.equal(s.state().active, false);
  s.start(); s.random(() => 0); s.tick(1100);
  assert.equal(s.state().ants.length, 1);
  s.listeners.pointermove();
  assert.equal(s.state().active, false);
  assert.equal(s.state().termites.length + s.state().ants.length, 0);
  assert.equal(s.state().grass.length + s.state().butterflies.length, 0);
  assert.equal(s.clears(), 1);
  assert.equal([...s.timers.values()][0].delay, 10000);
});

test('independent coins run once per second and cap each species at ten', () => {
  const s = simulation(); s.start(); s.random(() => 1);
  s.tick(1100);
  assert.equal(s.state().termites.length, 3);
  assert.equal(s.state().ants.length, 0);
  // Termite coin fails, ant coin succeeds. Other random draws use .5.
  let values = [1, 0]; s.random(() => values.length ? values.shift() : .5);
  s.tick(2100);
  assert.equal(s.state().termites.length, 3);
  assert.equal(s.state().ants.length, 1);
  values = [0, 1]; s.tick(3100);
  assert.equal(s.state().termites.length, 4);
  assert.equal(s.state().ants.length, 1);
  s.random(() => 0); s.tick(3500);
  assert.equal(s.state().termites.length, 4);
  assert.equal(s.state().ants.length, 1);
  for(let now = 4100; now <= 24100; now += 1000)s.tick(now);
  assert.equal(s.state().termites.length, 10);
  assert.equal(s.state().ants.length, 10);
});

test('ants walk without adding damage; random walks are slow and stay in bounds', () => {
  const s = simulation(); s.start();
  let values = [1, 0]; s.random(() => values.length ? values.shift() : .5);
  s.tick(1100);
  s.state().termites.length = 0;
  const ant = s.state().ants[0]; ant.untilTurn = 0;
  s.random(() => 1);
  const start = {x: ant.x, y: ant.y, angle: ant.angle}, fills = s.fills();
  for(let now = 1200; now <= 10100; now += 100) {
    const before = {x: ant.x, y: ant.y}; s.tick(now);
    assert.ok(Math.hypot(ant.x-before.x, ant.y-before.y) <= .240001);
    assert.ok(ant.x>=0 && ant.x<=800 && ant.y>=0 && ant.y<=600);
  }
  assert.notEqual(ant.angle, start.angle);
  assert.ok(Math.hypot(ant.x-start.x, ant.y-start.y) > 0);
  assert.equal(s.fills(), fills);
  ant.x = 0; ant.y = 0; ant.angle = Math.PI*1.25; ant.turn = 0; ant.untilTurn = 10;
  s.tick(10200);
  assert.ok(ant.x>=0 && ant.y>=0);
  s.random(() => 0); s.tick(11100);
  const termite = s.state().termites[0];
  assert.ok(termite.speed<=2.4);
  for(let now = 11200; now <= 12200; now += 100)s.tick(now);
  assert.ok(s.fills()>fills);
});

test('ants enter from each screen edge facing inward without biting', () => {
  for(let edge=0; edge<4; edge++) {
    const s=simulation(); s.start();
    const fills=s.fills();
    const values=[1,0,(edge+.1)/4,.5];
    s.random(() => values.length ? values.shift() : .5);
    s.tick(1100);
    const ant=s.state().ants[0];
    assert.ok(ant);
    const distance=[ant.x,800-ant.x,ant.y,600-ant.y][edge];
    assert.ok(distance>=0 && distance<=.48);
    assert.equal(ant.angle,[0,Math.PI,Math.PI/2,-Math.PI/2][edge]);
    assert.equal(s.fills(),fills);
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

test('ant tripods alternate, support feet stay planted, and steps stop with the body', () => {
  const s=simulation(); s.start();
  const values=[1,0,0,.5];
  s.random(() => values.length ? values.shift() : .5); s.tick(1100);
  const ant=s.state().ants[0],shift=400-ant.x;
  ant.x+=shift;
  for(const foot of ant.legs)foot.x+=shift;
  const tripodA=[0,2,4],tripodB=[1,3,5];
  let swingsA=0,swingsB=0,plantedChecks=0;
  for(let now=1200;now<=7100;now+=100) {
    const before=ant.legs.map(foot => ({...foot})); s.tick(now);
    const a=tripodA.every(i => ant.legs[i].stance);
    const b=tripodB.every(i => ant.legs[i].stance);
    assert.ok(a || b, 'one full tripod supports the body');
    assert.ok(tripodA.every(i => ant.legs[i].stance===a));
    assert.ok(tripodB.every(i => ant.legs[i].stance===b));
    if(!a)swingsA++; if(!b)swingsB++;
    ant.legs.forEach((foot,i) => {
      if(foot.stance && before[i].stance) {
        assert.equal(foot.x,before[i].x); assert.equal(foot.y,before[i].y);
        plantedChecks++;
      }
    });
  }
  assert.ok(swingsA>0 && swingsB>0 && plantedChecks>0);
  ant.speed=0;
  const gait=ant.gait,feet=ant.legs.map(foot => ({x:foot.x,y:foot.y}));
  for(let now=7200;now<=8100;now+=100)s.tick(now);
  assert.equal(ant.gait,gait);
  ant.legs.forEach((foot,i) => assert.deepEqual({x:foot.x,y:foot.y},feet[i]));
});

test('ant turns preserve planted feet and avoid instant heading reversals', () => {
  const s=simulation(); s.start();
  const values=[1,0,0,.5];
  s.random(() => values.length ? values.shift() : .5); s.tick(1100);
  const ant=s.state().ants[0],shift=400-ant.x;
  ant.x+=shift; for(const foot of ant.legs)foot.x+=shift;
  ant.turnTarget=.75; ant.untilTurn=10;
  for(let now=1200;now<=3100;now+=100) {
    const angle=ant.angle,feet=ant.legs.map(foot => ({...foot})); s.tick(now);
    assert.ok(Math.abs(ant.angle-angle)<.08);
    ant.legs.forEach((foot,i) => {
      if(foot.stance && feet[i].stance) {
        assert.equal(foot.x,feet[i].x); assert.equal(foot.y,feet[i].y);
      }
    });
  }
  assert.ok(ant.angle>.5);
});

test('turning in place still takes steps to reposition the supporting tripods', () => {
  const s=simulation(); s.start();
  const values=[1,0,0,.5];
  s.random(() => values.length ? values.shift() : .5); s.tick(1100);
  const ant=s.state().ants[0],shift=400-ant.x;
  ant.x+=shift; for(const foot of ant.legs)foot.x+=shift;
  ant.speed=0;ant.turnTarget=.75;ant.untilTurn=10;
  const start={x:ant.x,y:ant.y,gait:ant.gait};
  let swing=false;
  for(let now=1200;now<=3100;now+=100) {
    s.tick(now); swing ||= ant.legs.some(foot => !foot.stance);
  }
  assert.equal(ant.x,start.x); assert.equal(ant.y,start.y);
  assert.ok(ant.gait>start.gait && swing);
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
