const tablist = document.querySelector('.about-tabs');
if (tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  function select(tab, focus = false) {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    }
    if (focus) tab.focus();
  }
  tablist.hidden = false;
  select(location.hash === '#questions-answers' ? tabs[1] : tabs[0]);
  for (const tab of tabs) {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab);
      let target;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') target = tabs[(index + 1) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length - 1];
      if (target) { event.preventDefault(); select(target, true); }
    });
  }
  window.addEventListener('hashchange', () => {
    if (location.hash === '#questions-answers') select(tabs[1]);
    if (location.hash === '#our-story') select(tabs[0]);
  });
}
