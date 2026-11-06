// timer.js
// Countdown timer logic for the active workout screen.

/**
 * Creates a countdown timer that calls onTick each second and onComplete when done.
 * Returns a controller object with pause/resume/reset/destroy methods.
 *
 * @param {number} totalSeconds - Total seconds for the countdown
 * @param {(remaining: number, total: number) => void} onTick - Called each second
 * @param {() => void} onComplete - Called when countdown reaches 0
 * @returns {{ pause: () => void, resume: () => void, reset: (newTotal?: number) => void, destroy: () => void, isPaused: () => boolean }}
 */
export function createTimer(totalSeconds, onTick, onComplete) {
  let remaining = totalSeconds;
  let total = totalSeconds;
  let intervalId = null;
  let paused = true;

  function tick() {
    if (remaining <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      paused = true;
      onTick(0, total);
      onComplete();
      return;
    }
    remaining--;
    onTick(remaining, total);
  }

  function resume() {
    if (!paused || remaining <= 0) return;
    paused = false;
    // Emit current state immediately
    onTick(remaining, total);
    intervalId = setInterval(tick, 1000);
  }

  function pause() {
    if (paused) return;
    paused = true;
    clearInterval(intervalId);
    intervalId = null;
  }

  function reset(newTotal) {
    pause();
    if (typeof newTotal === 'number' && newTotal > 0) {
      total = newTotal;
    }
    remaining = total;
    onTick(remaining, total);
  }

  function destroy() {
    pause();
    remaining = 0;
    total = 0;
  }

  function isPaused() {
    return paused;
  }

  // Emit initial state
  onTick(remaining, total);

  return { pause, resume, reset, destroy, isPaused };
}
