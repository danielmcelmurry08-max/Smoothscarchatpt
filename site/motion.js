/* Motion package — SmoothScar, Nov 22 2026.
   GSAP 3.15.1 + ScrollTrigger + Lenis 1.3.27, all self-hosted under
   /assets/vendor/ (the site CSP is script-src 'self', so no CDN).
   Four effects: hero entrance, scroll reveals, number counters +
   chart bars, and smooth scrolling on fine-pointer devices.
   Additive only: nothing is hidden by CSS. Every starting state is
   applied by JS, so if a library fails to load — or the visitor
   prefers reduced motion — the page renders exactly as before. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  /* Smooth scroll (Lenis) — desktop/laptop pointers only. Touch keeps
     the native scroll, so the mobile drag sliders are untouched. */
  var lenis = null;
  if (window.matchMedia('(pointer: fine)').matches && window.Lenis) {
    try {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } catch (e) { lenis = null; }
  }

  function scrollToEl(el) {
    if (lenis) { lenis.scrollTo(el, { offset: -100, duration: 1.1 }); }
    else { el.scrollIntoView({ behavior: 'smooth' }); }
  }

  /* Same-page anchor links glide through Lenis when it is running. */
  document.addEventListener('click', function (event) {
    if (!lenis) return;
    var a = event.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.length < 2) return;
    var el = document.querySelector(href);
    if (!el) return;
    event.preventDefault();
    scrollToEl(el);
  });

  /* Landing on a #hash (e.g. /customer/#apply from a product page):
     hold the exact anchor position instead of letting Lenis start at top. */
  function holdHash() {
    if (!lenis || !location.hash || location.hash.length < 2) return;
    var el = document.querySelector(location.hash);
    if (el) lenis.scrollTo(el, { offset: -100, immediate: true, force: true });
  }
  holdHash();
  window.addEventListener('load', function () {
    holdHash();
    window.ScrollTrigger.refresh();
  });

  /* Hero entrance — homepage .hero; product pages use .product-detail. */
  var heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    var heroKids = heroCopy.querySelectorAll(':scope > *');
    var heroArt = document.querySelector('.hero-art');
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(heroKids, { y: 28, opacity: 0, duration: 0.9, stagger: 0.09 }, 0.1);
    if (heroArt) tl.from(heroArt, { y: 24, opacity: 0, scale: 0.985, duration: 1.0 }, 0.25);
  }
  var productSplit = document.querySelector('.product-detail .split');
  if (productSplit) {
    var cells = productSplit.querySelectorAll(':scope > *');
    gsap.from(cells, { y: 28, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
  }

  /* Scroll reveals — fade up once as each block enters view. Never the
     quote form, the drag sliders, the header/footer, or anything the
     hero entrance already animates. */
  var revealSelector = [
    'main section > h2', 'main section > h3',
    '.card', '.testimonial-card', '.evidence-stat', '.study-highlight',
    '.metric', '.chart-row', '.product-photo', '.bundle-option',
    '.result-photos', '.feature-comparison', '.study-chart'
  ].join(', ');
  var revealEls = Array.prototype.filter.call(
    document.querySelectorAll(revealSelector),
    function (el) {
      if (el.closest('#apply .formbox')) return false;
      if (el.closest('.mobile-slider, .slider-option, .comparison-stage')) return false;
      if (el.closest('.pairs-carousel')) return false;
      if (el.closest('header, footer')) return false;
      if (el.closest('.hero-copy, .product-detail .split')) return false;
      return true;
    }
  );
  revealEls.forEach(function (el) {
    gsap.from(el, {
      y: 24, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* Number counters — .evidence-stat > strong (95%, 8/10, 85%, 30%)
     and .chart-row > strong (83.8%, 74.1%, 100, 70). Prefix and suffix
     text ("Up to ", "%", "/10") is preserved; only the number moves. */
  function animateNumber(el) {
    var text = el.textContent;
    var m = text.match(/(-?[\d.]+)/);
    if (!m) return;
    var target = parseFloat(m[1]);
    var decimals = (m[1].split('.')[1] || '').length;
    var prefix = text.slice(0, m.index);
    var suffix = text.slice(m.index + m[1].length);
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: function () { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; }
    });
  }
  document.querySelectorAll('.evidence-stat > strong, .chart-row > strong').forEach(animateNumber);

  /* Chart bars grow from 0 to their inline width when they enter view. */
  document.querySelectorAll('.chart-bar').forEach(function (bar) {
    gsap.from(bar, {
      width: '0%', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: bar.closest('.chart-row') || bar, start: 'top 88%', once: true }
    });
  });
})();
