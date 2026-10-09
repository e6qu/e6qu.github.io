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
    globalThis.inspect = () => ({active, termites, ants});
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
    assert.ok(ant.x>=10 && ant.x<=790 && ant.y>=10 && ant.y<=590);
  }
  assert.notEqual(ant.angle, start.angle);
  assert.ok(Math.hypot(ant.x-start.x, ant.y-start.y) > 0);
  assert.equal(s.fills(), fills);
  ant.x = 10; ant.y = 10; ant.angle = Math.PI*1.25; ant.turn = 0; ant.untilTurn = 10;
  s.tick(10200);
  assert.ok(ant.x>=10 && ant.y>=10);
  s.random(() => 0); s.tick(11100);
  const termite = s.state().termites[0];
  assert.ok(termite.speed<=2.4);
  for(let now = 11200; now <= 12200; now += 100)s.tick(now);
  assert.ok(s.fills()>fills);
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
