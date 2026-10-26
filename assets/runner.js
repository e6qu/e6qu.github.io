// Regular Mario's castaway runs along a line of text and jumps onto a link, then vanishes:
// the game invite on the homepage, and the closing slide of a deck. Runner.attach(stage)
// takes an element holding an img.runner-sprite and the target link; with `stay` the
// castaway remains standing on the link instead of vanishing. Distances scale with
// the sprite's rendered size, so the same run works at 32 px on the page and in em on a
// slide. Nothing moves under prefers-reduced-motion or the pause button (motion.js).
(() => {
  const root = document.documentElement;
  const base = new URL('mario/', document.currentScript.src);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const poses = ['walk-1', 'walk-1-bob', 'walk-1-sway', 'walk-2', 'walk-2-bob', 'walk-2-sway'];
  const source = pose => new URL(`castaway-${pose}.png`, base).href;
  const paused = () => reduced.matches || root.dataset.motion === 'paused';
  let preload;

  // Decode every pose once, so a run never waits on an image.
  function ready() {
    preload ??= Promise.all([...poses, 'jump', 'idle'].map(name => {
      const image = new Image();
      image.src = source(name);
      return image.decode();
    }).concat(document.fonts.ready));
    return preload;
  }

  function attach(stage, {sprite = stage.querySelector('.runner-sprite'), link = stage.querySelector('a'), stay = false, onDone} = {}) {
    let frame;
    function pose(name) {
      if (sprite.dataset.pose === name) return;
      sprite.dataset.pose = name;
      sprite.src = source(name);
    }
    function stop() {
      cancelAnimationFrame(frame);
    }
    function still() {
      stop();
      stage.dataset.state = 'idle';
      sprite.hidden = false;
      sprite.style.transform = '';
      sprite.style.opacity = '';
      pose('idle');
    }
    function play() {
      stop();
      if (paused() || document.hidden) { still(); return; }
      sprite.hidden = false;
      sprite.style.transform = '';
      sprite.style.opacity = '';
      const bounds = stage.getBoundingClientRect(), target = link.getBoundingClientRect();
      const size = sprite.getBoundingClientRect().width, scale = size / 32;
      const takeoff = Math.max(0, target.left - bounds.left - size - 8 * scale);
      const landing = target.left - bounds.left + target.width / 2 - size / 2;
      // on the homepage it lands in the text's x-height; staying, it stands on top of the link
      const font = parseFloat(getComputedStyle(link).fontSize);
      const landingY = target.top - bounds.bottom + (stay ? font * .18 : font * .3 + 2 * scale);
      const run = Math.max(600, takeoff / scale / 80 * 1000), jump = 760, rest = 180, vanish = 220;
      let started;
      function tick(now) {
        started ??= now;
        const elapsed = now - started;
        let x, y = 0, opacity = 1, shrink = 1, state;
        if (elapsed < run) {
          state = 'run';
          x = takeoff * elapsed / run;
          pose(poses[Math.floor(elapsed / 90) % poses.length]);
        } else if (elapsed < run + jump) {
          state = 'jump';
          const t = (elapsed - run) / jump;
          x = takeoff + (landing - takeoff) * t;
          y = landingY * t - 4 * 44 * scale * t * (1 - t);
          pose('jump');
        } else {
          x = landing; y = landingY;
          pose('idle');
          const t = Math.max(0, (elapsed - run - jump - rest) / vanish);
          state = t > 0 ? 'vanish' : 'land';
          if (stay && t > 0) {
            stage.dataset.state = 'land';
            sprite.style.transform = `translate(${x}px, ${y}px)`;
            onDone?.();
            return;
          }
          opacity = Math.max(0, 1 - t);
          shrink = 1 - .2 * Math.min(1, t);
          y -= 6 * scale * Math.min(1, t);
          if (t >= 1) {
            sprite.hidden = true;
            stage.dataset.state = 'waiting';
            onDone?.();
            return;
          }
        }
        if (stage.dataset.state !== state) stage.dataset.state = state;
        sprite.style.transform = `translate(${x}px, ${y}px) scale(${shrink})`;
        sprite.style.opacity = opacity;
        frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }
    return {play: () => ready().then(play, still), still, stop};
  }

  globalThis.Runner = {attach, ready};
})();
