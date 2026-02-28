'use strict';

let counter = 0;
let pressStart = null;
let resetTimer = null;

const app = document.getElementById('app');
const display = document.getElementById('counter');

function render() {
  display.textContent = counter;
}

function increment() {
  counter++;
  render();
  triggerTapAnimation();
}

function reset() {
  counter = 0;
  render();
  clearPressState();
}

function triggerTapAnimation() {
  app.classList.remove('tapped');
  // Force reflow to restart animation
  void app.offsetWidth;
  app.classList.add('tapped');
}

function clearPressState() {
  app.classList.remove('pressing');
  clearTimeout(resetTimer);
  resetTimer = null;
  pressStart = null;
}

function onPressStart(e) {
  e.preventDefault();
  pressStart = Date.now();
  app.classList.add('pressing');
  resetTimer = setTimeout(() => {
    reset();
  }, 3000);
}

function onPressEnd(e) {
  e.preventDefault();
  if (pressStart === null) return;

  const elapsed = Date.now() - pressStart;
  if (elapsed < 3000) {
    clearTimeout(resetTimer);
    resetTimer = null;
    app.classList.remove('pressing');
    pressStart = null;
    increment();
  }
  // If elapsed >= 5000, reset() already fired via timer
}

function onPressCancel(e) {
  clearPressState();
}

// Touch events (primary for mobile)
app.addEventListener('touchstart', onPressStart, { passive: false });
app.addEventListener('touchend', onPressEnd, { passive: false });
app.addEventListener('touchcancel', onPressCancel, { passive: false });

// Mouse events (desktop fallback)
app.addEventListener('mousedown', onPressStart);
app.addEventListener('mouseup', onPressEnd);
app.addEventListener('mouseleave', onPressCancel);

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {
    // SW registration failure is non-fatal
  });
}
