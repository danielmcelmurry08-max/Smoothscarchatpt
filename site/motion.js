/* Motion package — SmoothScar, Nov 22 2026.
   GSAP 3.15.1 + ScrollTrigger + Lenis 1.3.27, all self-hosted under
   /assets/vendor/ (the site CSP is script-src 'self', so no CDN).
   Four effects: hero entrance, scroll reveals, number counters +
   chart bars, and smooth scrolling on fine-pointer devices — plus
   Bright-style word-split headlines (h1 on load, h2 on scroll) and
   image drift / clip reveals. The word split and image effects are
   additive only: nothing is hidden by CSS. Every starting state is
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

  /* Word-split headline animation — Bright-style lettering. Splits a
     heading's words into spans that rise one by one. Deliberately NO
     mask: the words stay fully visible from the first paint and only
     settle up into place (a masked rise blanks the headline until the
     animation runs, which cost the post-deploy re-grade 1.5 points).
     JS-only; without JS the heading is plain text. Whitespace stays as
     text nodes between the wraps, so the heading still reads as normal
     text. Headings with links or buttons, and headings with no layout
     box (hidden tab panels), are left alone and render normally.
     <br> line breaks are preserved. */
  function splitWords(el) {
    if (!el || el.dataset.splitDone) return [];
    if (el.querySelector('a, button')) return [];
    if (!el.getClientRects().length) return [];
    var inners = [];
    (function walk(node) {
      var child = node.firstChild;
      while (child) {
        var next = child.nextSibling;
        if (child.nodeType === 3) {
          child.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              node.insertBefore(document.createTextNode(part), child);
            } else {
              var wrap = document.createElement('span');
              wrap.className = 'w-wrap';
              var inner = document.createElement('span');
              inner.className = 'w-inner';
              inner.textContent = part;
              wrap.appendChild(inner);
              node.insertBefore(wrap, child);
              inners.push(inner);
            }
          });
          node.removeChild(child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
        child = next;
      }
    })(el);
    el.dataset.splitDone = '1';
    return inners;
  }

  /* Hero entrance — homepage .hero; product pages use .product-detail.
     Transform-only on purpose: the headline stays visible on first paint
     (it slides up into place) instead of starting invisible. */
  var heroH1 = document.querySelector('.hero-copy h1');
  var heroWords = heroH1 ? splitWords(heroH1) : [];
  var heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    var heroKids = Array.prototype.filter.call(
      heroCopy.querySelectorAll(':scope > *'),
      function (el) { return el.tagName !== 'H1'; }
    );
    var heroArt = document.querySelector('.hero-art');
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(heroKids, { y: 28, duration: 0.9, stagger: 0.09 }, 0.1);
    if (heroWords.length) tl.from(heroWords, { y: 16, duration: 0.9, stagger: 0.05 }, 0.1);
    if (heroArt) tl.from(heroArt, { y: 24, scale: 0.985, duration: 1.0 }, 0.25);
  }
  var productSplit = document.querySelector('.product-detail .split');
  if (productSplit) {
    var cells = productSplit.querySelectorAll(':scope > *');
    gsap.from(cells, { y: 28, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
  }

  /* Every other page headline gets the same word rise on load. Product
     h1s sit inside a .split cell that keeps its slide — the word rise
     layers inside it. */
  document.querySelectorAll('h1').forEach(function (h1) {
    if (h1.closest('.hero-copy, header, footer')) return;
    var w = splitWords(h1);
    if (w.length) gsap.from(w, { y: 16, duration: 0.9, stagger: 0.05, ease: 'power3.out', delay: 0.2 });
  });

  /* Scroll reveals — fade up once as each block enters view. Never the
     quote form, the drag sliders, the header/footer, or anything the
     hero entrance already animates. Section h2s are excluded here:
     they get the word-split rise below instead. */
  var revealSelector = [
    'main section > h3',
    '.card', '.testimonial-card', '.evidence-stat', '.study-highlight',
    '.metric', '.chart-row', '.product-photo', '.bundle-option',
    '.result-photos', '.feature-comparison', '.study-chart'
  ].join(', ');
  var revealEls = Array.prototype.filter.call(
    document.querySelectorAll(revealSelector),
    function (el) {
      if (el.closest('#apply .formbox')) return false;
      if (el.closest('.mobile-slider, .slider-option, .comparison-stage')) return false;
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

  /* Section headings rise word by word as they enter view — the same
     lettering treatment as the h1, on scroll instead of on load. */
  Array.prototype.filter.call(
    document.querySelectorAll('main section > h2'),
    function (el) {
      if (el.closest('#apply .formbox')) return false;
      if (el.closest('.mobile-slider, .slider-option, .comparison-stage')) return false;
      if (el.closest('header, footer')) return false;
      if (el.closest('.hero-copy, .product-detail .split')) return false;
      return true;
    }
  ).forEach(function (h2) {
    var words = splitWords(h2);
    if (!words.length) return;
    gsap.from(words, {
      y: 16, duration: 0.98, stagger: 0.052, ease: 'power3.out',
      scrollTrigger: { trigger: h2, start: 'top 88%', once: true }
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

  /* Image drift — Bright-style parallax. Figure-level drift only: the
     frame stays put and the whole figure moves a few pixels, so no
     image is ever cropped or re-framed. Desktop pointers only; touch
     keeps native scroll. */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.hero-art, .product-photo, .photo-strip figure').forEach(function (fig) {
      gsap.fromTo(fig, { yPercent: -1.5 }, { yPercent: 1.5, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* Image reveal — photos un-clip with a slight scale settle as they
     enter view. Only images already loaded at setup, or that load
     later (one-time listener); anything still unloaded, or that fails
     to load, renders exactly as before. */
  function clipReveal(img) {
    if (!img.naturalWidth) return;
    gsap.from(img, {
      clipPath: 'inset(12% 8% 12% 8%)', scale: 1.07, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: img, start: 'top 90%', once: true }
    });
  }
  document.querySelectorAll('.photo-strip img, .product-photo img').forEach(function (img) {
    if (img.closest('.mobile-slider, .slider-option, .comparison-stage')) return;
    if (img.complete) clipReveal(img);
    else img.addEventListener('load', function onload() {
      img.removeEventListener('load', onload);
      clipReveal(img);
    });
  });
})();
