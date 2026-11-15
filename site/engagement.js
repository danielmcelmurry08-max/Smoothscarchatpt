(() => {
 const path=location.pathname;
 if(path.startsWith('/provider')||path.includes('confirmation')||path.includes('thank-you')||path.includes('feedback'))return;
 const firstKey='smoothscar-first-landing',seenKey='smoothscar-patch-popup-seen';
 const now=Date.now();let first=now;
 try{if(sessionStorage.getItem(seenKey)==='1')return;const stored=Number(sessionStorage.getItem(firstKey));if(stored>0&&stored<=now)first=stored;else sessionStorage.setItem(firstKey,String(now));}catch{}
 const dialog=document.createElement('dialog');dialog.className='patch-discovery';dialog.setAttribute('aria-labelledby','patch-discovery-title');dialog.setAttribute('aria-describedby','patch-discovery-copy');
 dialog.innerHTML='<button type="button" class="popup-close" aria-label="Close patch guide">×</button><div class="eyebrow">SmoothScar · Your next step</div><h2 id="patch-discovery-title">Find your scar-care routine.</h2><p id="patch-discovery-copy">Explore the patches and follow the step-by-step instructions for fully closed scars.</p><div class="actions"><a class="btn" href="/customer/#portfolio">Find your patch</a><a class="btn outline" href="/customer/#patient-protocol">Learn more</a></div><p class="note"><a href="/customer/#apply">Contact us for product guidance and current offers</a>.</p>';
 document.body.append(dialog);
 const close=()=>dialog.close();dialog.querySelector('.popup-close').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 dialog.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
 const show=()=>{
  try{if(sessionStorage.getItem(seenKey)==='1')return;}catch{}
  const active=document.activeElement;
  if(document.visibilityState==='hidden'||active?.matches('input,select,textarea')||document.querySelector('dialog[open]')){setTimeout(show,1000);return;}
  if(typeof dialog.showModal!=='function')return;
  dialog.showModal();try{sessionStorage.setItem(seenKey,'1');}catch{}
 };
 setTimeout(show,Math.max(0,15000-(now-first)));
})();
