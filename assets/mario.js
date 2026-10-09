(() => {
  const stage = document.querySelector('#game-invite');
  const sprite = document.querySelector('#mario-runner');
  const link = document.querySelector('#game-link');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const poses = ['walk-1','walk-1-bob','walk-1-sway','walk-2','walk-2-bob','walk-2-sway'];
  const source = pose => `assets/mario/castaway-${pose}.png`;
  let frame, timer, ready = false;

  function pose(name) {
    if (sprite.dataset.pose === name) return;
    sprite.dataset.pose = name;
    sprite.src = source(name);
  }
  function stop() {
    clearTimeout(timer);
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
    if (!ready || reduced.matches || document.hidden) return;
    sprite.hidden = false;
    sprite.style.transform = '';
    sprite.style.opacity = '';
    const bounds = stage.getBoundingClientRect(), target = link.getBoundingClientRect();
    const takeoff = Math.max(0, target.left - bounds.left - sprite.width - 8);
    const landing = target.left - bounds.left + target.width / 2 - sprite.width / 2;
    const landingY = target.top - bounds.bottom + parseFloat(getComputedStyle(link).fontSize) * .3 + 2;
    const run = Math.max(600, takeoff / 80 * 1000), jump = 760, rest = 180, vanish = 220;
    let started;
    function tick(now) {
      started ??= now;
      const elapsed = now - started;
      let x, y = 0, opacity = 1, scale = 1, state;
      if (elapsed < run) {
        state = 'run';
        x = takeoff * elapsed / run;
        pose(poses[Math.floor(elapsed / 90) % poses.length]);
      } else if (elapsed < run + jump) {
        state = 'jump';
        const t = (elapsed - run) / jump;
        x = takeoff + (landing - takeoff) * t;
        y = landingY * t - 4 * 44 * t * (1 - t);
        pose('jump');
      } else {
        x = landing; y = landingY;
        pose('idle');
        const t = Math.max(0, (elapsed - run - jump - rest) / vanish);
        state = t > 0 ? 'vanish' : 'land';
        opacity = Math.max(0, 1 - t);
        scale = 1 - .2 * Math.min(1, t);
        y -= 6 * Math.min(1, t);
        if (t >= 1) {
          sprite.hidden = true;
          stage.dataset.state = 'waiting';
          schedule();
          return;
        }
      }
      if (stage.dataset.state !== state) stage.dataset.state = state;
      sprite.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      sprite.style.opacity = opacity;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    stop();
    if (reduced.matches) still();
    else if (!document.hidden) timer = setTimeout(play, 650);
  }
  reduced.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else schedule();
  });
  addEventListener('resize', () => {
    still();
    schedule();
  }, {passive:true});
  const images = [...poses, 'jump', 'idle'].map(name => {
    const image = new Image();
    image.src = source(name);
    return image.decode();
  });
  Promise.all([...images, document.fonts.ready]).then(() => {
    ready = true;
    schedule();
  }).catch(still);
})();
