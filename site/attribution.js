(() => {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const params = new URLSearchParams(location.search);
  try {
    const incoming = Object.fromEntries(keys.filter(key => params.has(key)).map(key => [key, params.get(key).slice(0, 200)]));
    if (Object.keys(incoming).length) sessionStorage.setItem('smoothscar-attribution', JSON.stringify(incoming));
    const stored = JSON.parse(sessionStorage.getItem('smoothscar-attribution') || '{}');
    const form = document.querySelector('#provider');
    if (form) for (const key of keys) {
      if (typeof stored[key] === 'string' && form.elements[key]) form.elements[key].value = stored[key].slice(0, 200);
    }
  } catch {
    // Storage can be disabled. The current page's campaign details still reach its form.
    const form = document.querySelector('#provider');
    if (form) for (const key of keys) if (params.has(key) && form.elements[key]) form.elements[key].value = params.get(key).slice(0, 200);
  }
})();
