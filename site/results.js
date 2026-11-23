document.querySelectorAll('.result-range').forEach(range => {
  const stage = range.closest('.slider-option, .mobile-slider').querySelector('.result-slider');
  const beforeLabel = range.dataset.beforeLabel || 'Day 0';
  range.addEventListener('input', () => {
    stage.style.setProperty('--reveal', range.value + '%');
    range.setAttribute('aria-valuetext', range.value + '% ' + beforeLabel + ' photo revealed');
  });
});
