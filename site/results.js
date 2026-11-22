document.querySelectorAll('.result-range').forEach(range => {
  const stage = range.closest('.slider-option, .mobile-slider').querySelector('.result-slider');
  const beforeLabel = range.dataset.beforeLabel || 'Day 0';
  range.addEventListener('input', () => {
    stage.style.setProperty('--reveal', range.value + '%');
    range.setAttribute('aria-valuetext', range.value + '% ' + beforeLabel + ' photo revealed');
  });
});
/* Pairs carousel — Results page only. The 7 photo comparisons roll
   horizontally, pausing 5 seconds on each, then loop through all of
   them. The drag sliders stay inside every slide. Auto-advance pauses
   while the visitor drags a slider, hovers the carousel, or the
   carousel is off-screen, and never runs for reduced-motion. */
(function () {
  var carousel = document.getElementById('pairs-carousel');
  if (!carousel) return;
  var track = document.getElementById('pairs-track');
  var slides = track.querySelectorAll('.result-pair');
  if (slides.length < 2) return;
  document.documentElement.classList.add('js-carousel');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0, timer = null, resumeTimer = null;
  var visible = true, hovering = false, swipeX = null;
  var dotsWrap = document.getElementById('pairs-dots');
  var prevBtn = document.getElementById('pairs-prev');
  var nextBtn = document.getElementById('pairs-next');
  var dots = [];
  slides.forEach(function (slide, i) {
    var title = slide.querySelector('h2').textContent.trim();
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Show comparison ' + (i + 1) + ': ' + title);
    dot.addEventListener('click', function () { goTo(i); restartAuto(); });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });
  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    dots.forEach(function (dot, j) {
      if (j === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }
  function autoAllowed() {
    return !reduceMotion && visible && !hovering && !document.hidden;
  }
  function schedule() {
    clearTimeout(timer);
    if (!autoAllowed()) return;
    timer = setTimeout(function () { goTo(index + 1); schedule(); }, 5000);
  }
  function restartAuto() {
    clearTimeout(timer);
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(schedule, 8000);
  }
  prevBtn.addEventListener('click', function () { goTo(index - 1); restartAuto(); });
  nextBtn.addEventListener('click', function () { goTo(index + 1); restartAuto(); });
  carousel.addEventListener('mouseenter', function () { hovering = true; clearTimeout(timer); });
  carousel.addEventListener('mouseleave', function () { hovering = false; schedule(); });
  carousel.addEventListener('pointerdown', function (e) {
    clearTimeout(timer);
    if (e.target.closest('input, button, a')) return;
    swipeX = e.clientX;
  });
  carousel.addEventListener('pointerup', function (e) {
    if (swipeX !== null) {
      var dx = e.clientX - swipeX;
      swipeX = null;
      if (dx < -60) goTo(index + 1);
      else if (dx > 60) goTo(index - 1);
    }
    restartAuto();
  });
  carousel.addEventListener('pointercancel', function () { swipeX = null; restartAuto(); });
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { goTo(index + 1); restartAuto(); }
    else if (e.key === 'ArrowLeft') { goTo(index - 1); restartAuto(); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) schedule(); else clearTimeout(timer);
    }, { threshold: 0.3 }).observe(carousel);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(timer); else schedule();
  });
  goTo(0);
  schedule();
})();
