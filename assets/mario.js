// The homepage's game invite: the castaway runs to "Want to play a game?" and jumps onto
// it, again and again (the run itself is assets/runner.js). Stops for reduced motion, the
// pause button and background tabs.
(() => {
  const stage = document.querySelector('#game-invite');
  const runner = Runner.attach(stage, {
    sprite: document.querySelector('#mario-runner'),
    link: document.querySelector('#game-link'),
    onDone: schedule,
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;

  function schedule() {
    clearTimeout(timer);
    runner.stop();
    if (reduced.matches || document.documentElement.dataset.motion === 'paused') runner.still();
    else if (!document.hidden) timer = setTimeout(runner.play, 650);
  }
  reduced.addEventListener('change', schedule);
  document.addEventListener('motionchange', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(timer); runner.stop(); }
    else schedule();
  });
  addEventListener('resize', () => {
    runner.still();
    schedule();
  }, {passive: true});
  Runner.ready().then(schedule, runner.still);
})();
