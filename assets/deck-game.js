// The deck as a platformer, for decks whose front matter says "game: mario"
// (docs/deck-format.md). Two layers:
// - Classic mode, the slides: a HUD on every slide (world, day of the week, data lives)
//   and short game-style transitions between slides, drawn with Regular Mario's original
//   castaway art (assets/mario).
// - Mario mode: the overview's "Play as a game" (or #mode=mario in the URL) hides the
//   slides and mounts the same talk as a level, from the regular-mario library. A bundled
//   deck (scripts/build-decks.mjs) defines globalThis.DeckGame, which loads the library
//   and the deck's talk script on demand; an unbundled page has no Mario mode.
// Slides opt in to the HUD and transitions from slides.md:
//   :: section world="3 Kernel Caverns" day=2 transition=card
//   :: content transition=ouch     (an incident: costs one data life)
// Transitions: card (world intro card), run (the castaway wipes the slide), iris (a circle
// closes on the castaway and opens on the next slide), pipe (down the pipe, into reality)
// and ouch (an enemy knocks the castaway off the screen). Slides.go() plays them only going
// forward while presenting, and never under prefers-reduced-motion or the pause button.
(() => {
  const deck = document.querySelector('.deck');
  if (!deck || !globalThis.Slides) return;
  const art = new URL('mario/', document.currentScript?.src ?? new URL('/assets/', location.href));
  const src = name => new URL(`${name}.png`, art).href;
  const WALK = ['walk-1', 'walk-1-bob', 'walk-1-sway', 'walk-2', 'walk-2-bob', 'walk-2-sway'].map(pose => `castaway-${pose}`);
  const LIVES = 5;
  const DAYS = 7;

  // Decode every image once (on a game deck's first slide), so no transition waits on the
  // network.
  let preloaded = null;
  const preload = () => preloaded ||= Promise.all([...WALK, 'castaway-idle', 'castaway-jump', 'castaway-ouch', 'castaway-crouch',
    'grumbler-idle', 'tile-crate', 'tile-pipe-top-left', 'tile-pipe-top-right', 'tile-pipe-left', 'tile-pipe-right',
    'scenery-cloud-left', 'scenery-cloud-middle', 'scenery-cloud-right']
    .map(name => { const image = new Image(); image.src = src(name); return image.decode().catch(() => {}); }));

  // ---- HUD: each slide's world, day and lives, written into the slide itself ----
  function world(value) {
    const [, number, name] = String(value).match(/^\s*(\S+)\s*(.*)$/) || [];
    return {number, name};
  }
  function hud() {
    let state = null;
    for (const frame of deck.querySelectorAll('.slide-frame')) {
      if (frame.dataset.world) state = {...(state || {lives: LIVES}), world: world(frame.dataset.world)};
      if (state && frame.dataset.day) state.day = frame.dataset.day;
      if (state && frame.dataset.lives) state.lives = Number(frame.dataset.lives);
      if (state && frame.dataset.transition === 'ouch') state.lives = Math.max(0, state.lives - 1);
      if (state) frame.dataset.livesNow = state.lives;
      const slide = frame.querySelector('.slide');
      if (!state || !slide || slide.querySelector('.game-hud')) continue;
      const bar = document.createElement('div');
      bar.className = 'game-hud';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML = `<span class="game-hud-world">World ${esc(state.world.number)}<b>${esc(state.world.name)}</b></span>` +
        (state.day ? `<span class="game-hud-day">Day ${esc(state.day)}/${DAYS}</span>` : '<span></span>') +
        `<span class="game-hud-lives"><img src="${src('castaway-idle')}" alt="">× ${state.lives}</span>`;
      slide.prepend(bar);
    }
  }
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
  let built = false;
  const isGame = () => deck.dataset.game === 'mario';
  deck.addEventListener('slidechange', () => {
    if (built || !isGame()) return;
    built = true;
    preload();
    hud();
    offerGame();
  });
  // an edited slide is re-rendered without its HUD: redraw them all
  deck.addEventListener('slidesupdate', () => {
    if (!isGame()) return;
    for (const bar of deck.querySelectorAll('.game-hud')) bar.remove();
    hud();
  });

  // ---- the stage: a layer over the presented slide, in its pixels ----
  function stage(frame, signal) {
    const rect = frame.querySelector('.slide').getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'game-layer';
    layer.setAttribute('aria-hidden', 'true');
    Object.assign(layer.style, {left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`});
    // one game pixel, so a 16-pixel sprite is about a ninth of the slide's height
    const px = Math.max(2, Math.round(rect.height / 150));
    layer.style.setProperty('--px', `${px}px`);
    document.body.append(layer);
    const animations = new Set();
    const timers = new Set();
    const api = {
      layer, px, w: rect.width, h: rect.height, ground: rect.height - 16 * px,
      sprite(name, x, y, className = '') {
        const image = document.createElement('img');
        image.src = src(name);
        image.alt = '';
        image.className = `game-sprite ${className}`;
        image.style.transform = `translate(${x}px, ${y}px)`;
        layer.append(image);
        return image;
      },
      animate(element, keyframes, options) {
        const animation = element.animate(keyframes, {fill: 'forwards', easing: 'linear', ...options});
        animations.add(animation);
        return animation.finished;
      },
      // cycles a sprite through poses until the returned stop() is called
      cycle(image, names, every = 80) {
        let i = 0;
        const timer = setInterval(() => { image.src = src(names[++i % names.length]); }, every);
        timers.add(timer);
        return () => { clearInterval(timer); timers.delete(timer); };
      },
      wait(ms) {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, ms);
          timers.add(timer);
          signal.addEventListener('abort', () => reject(signal.reason), {once: true});
        });
      },
      // a circle that closes to (x, y) or opens from it, over everything else in the layer
      iris(x, y, closing, duration) {
        const shade = document.createElement('div');
        shade.className = 'game-iris';
        shade.style.setProperty('--x', `${x}px`);
        shade.style.setProperty('--y', `${y}px`);
        layer.append(shade);
        const far = `${Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) + 2}px`;
        const frames = [{'--iris': far}, {'--iris': '0px'}];
        return api.animate(shade, closing ? frames : frames.reverse(), {duration, easing: closing ? 'ease-in' : 'ease-out'});
      },
      done() {
        for (const animation of animations) animation.cancel();
        for (const timer of timers) { clearTimeout(timer); clearInterval(timer); }
        layer.remove();
      },
    };
    signal.addEventListener('abort', api.done, {once: true});
    return api;
  }

  async function play(from, signal, body) {
    await preload();
    if (signal.aborted) return;
    const scene = stage(from, signal);
    try { await body(scene); } finally { scene.done(); }
  }

  const T = Slides.transitions;

  // A black card, as at the start of a level: the world, the day and the lives left.
  T.card = ({from, to, swap, signal}) => play(from, signal, async scene => {
    const {number, name} = world(to.dataset.world || '');
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `<p>World ${esc(number || '')}</p><p class="game-card-name">${esc(name || '')}</p>` +
      `${to.dataset.day ? `<p>Day ${esc(to.dataset.day)} / ${DAYS}</p>` : ''}` +
      `<p class="game-card-lives"><img src="${src('castaway-idle')}" alt="">× ${esc(to.dataset.livesNow ?? LIVES)}</p>`;
    scene.layer.append(card);
    await scene.animate(card, [{opacity: 0}, {opacity: 1}], {duration: 120});
    swap();
    await scene.wait(1300);
    await scene.animate(card, [{opacity: 1}, {opacity: 0}], {duration: 220});
  });

  // The castaway runs across the bottom, pulling the next slide in behind him.
  T.run = ({from, swap, signal}) => play(from, signal, async scene => {
    const size = 16 * scene.px;
    const curtain = document.createElement('div');
    curtain.className = 'game-curtain';
    scene.layer.append(curtain);
    const runner = scene.sprite(WALK[0], -size, scene.ground);
    const stop = scene.cycle(runner, WALK, 70);
    const half = 420;
    await Promise.all([
      scene.animate(runner, [{transform: `translate(${-size}px, ${scene.ground}px)`}, {transform: `translate(${scene.w / 2 - size / 2}px, ${scene.ground}px)`}], {duration: half}),
      scene.animate(curtain, [{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 50% 0 0)'}], {duration: half}),
    ]);
    swap();
    await Promise.all([
      scene.animate(runner, [{transform: `translate(${scene.w / 2 - size / 2}px, ${scene.ground}px)`}, {transform: `translate(${scene.w}px, ${scene.ground}px)`}], {duration: half}),
      scene.animate(curtain, [{clipPath: 'inset(0 50% 0 0)'}, {clipPath: 'inset(0 0 0 100%)'}], {duration: half}),
    ]);
    stop();
  });

  // A circle closes on the castaway standing at the left, then opens on the next slide.
  T.iris = ({from, swap, signal}) => play(from, signal, async scene => {
    const size = 16 * scene.px, x = scene.w * .2;
    scene.sprite('castaway-idle', x, scene.ground);
    await scene.iris(x + size / 2, scene.ground + size / 2, true, 420);
    swap();
    for (const sprite of scene.layer.querySelectorAll('.game-sprite')) sprite.remove();
    await scene.iris(x + size / 2, scene.ground + size / 2, false, 420);
  });

  // Down the pipe: a pipe rises, the castaway walks to it, hops on and sinks in; the
  // screen closes on the pipe's mouth and opens on the next slide (the reality under the story).
  T.pipe = ({from, swap, signal}) => play(from, signal, async scene => {
    const size = 16 * scene.px, cx = scene.w / 2, height = 2 * size;
    const pipe = document.createElement('div');
    pipe.className = 'game-pipe';
    pipe.innerHTML = `<img src="${src('tile-pipe-top-left')}" alt=""><img src="${src('tile-pipe-top-right')}" alt="">` +
      `<img src="${src('tile-pipe-left')}" alt=""><img src="${src('tile-pipe-right')}" alt="">`;
    pipe.style.left = `${cx - size}px`;
    const walker = scene.sprite(WALK[0], -size, scene.ground);
    scene.layer.append(pipe);
    const top = scene.h - height;
    await scene.animate(pipe, [{transform: `translateY(${height}px)`}, {transform: 'translateY(0)'}], {duration: 220, easing: 'ease-out'});
    const stop = scene.cycle(walker, WALK, 70);
    const beside = cx - size * 2;
    await scene.animate(walker, [{transform: `translate(${-size}px, ${scene.ground}px)`}, {transform: `translate(${beside}px, ${scene.ground}px)`}], {duration: 420});
    stop();
    walker.src = src('castaway-jump');
    const onTop = top - size;
    await scene.animate(walker, [
      {transform: `translate(${beside}px, ${scene.ground}px)`},
      {transform: `translate(${(beside + cx - size / 2) / 2}px, ${onTop - size}px)`, offset: .55},
      {transform: `translate(${cx - size / 2}px, ${onTop}px)`},
    ], {duration: 260, easing: 'ease-out'});
    walker.src = src('castaway-crouch');
    // the pipe is drawn after the castaway, so it hides him as he sinks below its mouth
    await scene.animate(walker, [{transform: `translate(${cx - size / 2}px, ${onTop}px)`}, {transform: `translate(${cx - size / 2}px, ${top + size}px)`}], {duration: 380, easing: 'ease-in'});
    await scene.iris(cx, top, true, 260);
    swap();
    pipe.remove();
    walker.remove();
    await scene.iris(cx, scene.h / 2, false, 360);
  });

  // An incident: a grumbler walks in, the castaway is hit, hops up and falls off the screen,
  // and a data life is gone (the HUD on the next slide shows one fewer).
  T.ouch = ({from, swap, signal}) => play(from, signal, async scene => {
    const size = 16 * scene.px, x = scene.w * .35;
    const hero = scene.sprite('castaway-idle', x, scene.ground);
    const enemy = scene.sprite('grumbler-idle', scene.w, scene.ground);
    await scene.animate(enemy, [{transform: `translate(${scene.w}px, ${scene.ground}px) scaleX(-1)`}, {transform: `translate(${x + size * .8}px, ${scene.ground}px) scaleX(-1)`}], {duration: 520});
    hero.src = src('castaway-ouch');
    const flash = document.createElement('div');
    flash.className = 'game-flash';
    scene.layer.append(flash);
    scene.animate(flash, [{opacity: .55}, {opacity: 0}], {duration: 260});
    await scene.wait(260);
    await scene.animate(hero, [
      {transform: `translate(${x}px, ${scene.ground}px)`},
      {transform: `translate(${x}px, ${scene.ground - size * 2.5}px)`, offset: .35, easing: 'ease-in'},
      {transform: `translate(${x}px, ${scene.h + size}px)`},
    ], {duration: 700, easing: 'ease-out'});
    await scene.iris(scene.w / 2, scene.h / 2, true, 260);
    swap();
    hero.remove();
    enemy.remove();
    await scene.iris(scene.w / 2, scene.h / 2, false, 320);
  });

  // ---- Mario mode: the talk as a level (the regular-mario library) ----
  // The slide on screen, from the hash (#12, or slide=12 beside other fields).
  const hashFields = () => new URLSearchParams(location.hash.slice(1).replace(/^(\d+)$/, 'slide=$1'));
  const slideNow = () => Math.max(1, Number(hashFields().get('slide')) || 1);
  let playing = null;

  function offerGame() {
    const loader = globalThis.DeckGame;
    const controls = document.querySelector('.page-controls');
    if (!loader || !controls || controls.querySelector('#play-game')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button when-overview';
    button.id = 'play-game';
    button.textContent = 'Play as a game';
    button.addEventListener('click', () => openGame(slideNow()));
    controls.prepend(button);
    addEventListener('hashchange', () => { if (!playing && hashFields().get('mode') === 'mario') openGame(slideNow()); });
    if (hashFields().get('mode') === 'mario') openGame(slideNow());
  }

  async function openGame(slide) {
    if (playing) return;
    const view = document.createElement('div');
    view.className = 'game-mode';
    view.setAttribute('role', 'region');
    view.setAttribute('aria-label', 'The talk as a game');
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'button game-mode-back';
    back.textContent = 'Back to slides';
    const stage = document.createElement('div');
    stage.className = 'game-mode-stage';
    view.append(back, stage);
    document.body.append(view);
    deck.hidden = true;
    document.documentElement.dataset.gameMode = '';
    let current = slide;
    const mark = () => history.replaceState(null, '', `#slide=${current}&mode=mario`);
    mark();
    const state = {talk: null, closed: false};
    playing = state;
    const close = () => {
      if (state.closed) return;
      state.closed = true;
      state.talk?.dispose();
      view.remove();
      delete document.documentElement.dataset.gameMode;
      deck.hidden = false;
      playing = null;
      // through the hash, so the slides show where the castaway stopped
      history.replaceState(null, '', location.pathname + location.search);
      location.hash = String(current);
      document.querySelector('#play-game')?.focus();
    };
    back.addEventListener('click', close);
    try {
      const [library, script] = await Promise.all([globalThis.DeckGame.library(), globalThis.DeckGame.talk()]);
      if (state.closed) return;
      state.talk = await library.mountTalk(stage, script, {
        slide,
        onSlideChange: n => { current = n; mark(); },
        onExit: close,
      });
      if (state.closed) state.talk.dispose();
    } catch (error) {
      const message = document.createElement('p');
      message.className = 'game-mode-error';
      message.textContent = `The game could not start: ${error.message}`;
      stage.replaceChildren(message);
    }
  }
})();
