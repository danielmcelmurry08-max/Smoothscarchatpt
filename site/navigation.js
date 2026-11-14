(() => {
 const header=document.querySelector('header'), links=header?.querySelector('.navlinks');
 if(!header||!links)return;
 links.id='smoothscar-navigation';
 const button=document.createElement('button');
 button.type='button';button.className='glass-menu-toggle';
 button.setAttribute('aria-label','Open navigation menu');
 button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',links.id);
 button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><g class="menu-lines"><path d="M4 8h16M4 16h16"/></g><g class="menu-close"><path d="m6 6 12 12M18 6 6 18"/></g></svg>';
 header.querySelector('nav').append(button);
 function setOpen(open){header.classList.toggle('nav-open',open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');}
 button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
 header.addEventListener('keydown',event=>{if(event.key==='Escape'){setOpen(false);button.focus();}});
 links.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false);});
 document.addEventListener('click',event=>{if(!header.contains(event.target))setOpen(false);});
 header.classList.add('glass-nav-ready');
})();
