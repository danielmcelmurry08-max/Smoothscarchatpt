document.querySelectorAll('.result-range').forEach(range => {
  const stage = range.closest('.slider-option').querySelector('.result-slider');
  range.addEventListener('input', () => {
    stage.style.setProperty('--reveal', range.value + '%');
    range.setAttribute('aria-valuetext', range.value + '% Day 0 photo revealed');
  });
});
