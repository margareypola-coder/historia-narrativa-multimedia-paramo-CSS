const slider = document.querySelector('#h-scroll');

// velocidad suavizada
let velocity = 0;
let rafId = null;

// Normalizar y suavizar el scroll
slider.addEventListener('wheel', (e) => {
  e.preventDefault();

  let delta = e.deltaY;

  // LIMITAMOS PARA CONTROLAR RUIDO DEL TRACKPAD
  delta = Math.sign(delta) * Math.min(Math.abs(delta), 50);

  // IMPULSO — AJÚSTALO A TU GUSTO
  velocity += delta * 50;   // <---- AQUI

  if (!rafId) animateScroll();

}, { passive: false });

// Animación con inercia
function animateScroll() {
  slider.scrollLeft += velocity;

  // fricción (ajusta entre 0.85 y 0.95 según gusto)
  velocity *= 0.90;

  if (Math.abs(velocity) > 0.5) {
    rafId = requestAnimationFrame(animateScroll);
  } else {
    rafId = null;
  }
}

// Arrastre
let pointerDown = false;
let startX = 0;
let scrollStart = 0;

slider.addEventListener('pointerdown', (e) => {
  pointerDown = true;

  velocity = 0;
  cancelAnimationFrame(rafId);
  rafId = null;

  slider.setPointerCapture(e.pointerId);
  startX = e.clientX;
  scrollStart = slider.scrollLeft;
  e.preventDefault();
});

slider.addEventListener('pointermove', (e) => {
  if (!pointerDown) return;
  const distance = e.clientX - startX;
  slider.scrollLeft = scrollStart - distance;
});

slider.addEventListener('pointerup', () => pointerDown = false);
slider.addEventListener('pointercancel', () => pointerDown = false);