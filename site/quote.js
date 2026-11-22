(() => {
 const params=new URLSearchParams(location.search);
 if(location.hash==='#webinar'){location.replace('/customer/#apply');return;}
 if(location.pathname==='/' && ['#portfolio','#apply','#biorna-daily','#biorna-c','#science'].includes(location.hash) && params.get('intent')!=='provider'){location.replace('/customer/'+location.search+location.hash);return;}
 if(location.pathname==='/' && params.get('intent')==='provider'){location.replace('/provider/#apply');return;}
 const form=document.querySelector('[data-quote-form]'); if(!form)return;
 const product=form.elements.product;
 const requested=params.get('product');if(requested==='daily'||requested==='BioRNA Antiscar'||requested==='BioRNA Daily (Antiscar)')product.value='BioRNA Daily (Antiscar)';if(requested==='c'||requested==='BioRNA-C')product.value='BioRNA-C';
 const requestedQuantity=Number(params.get('quantity'));if(form.elements.quantity&&Number.isInteger(requestedQuantity)&&requestedQuantity>=1&&requestedQuantity<=4)form.elements.quantity.value=String(requestedQuantity);
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const button=form.querySelector('#inquiry-review:not([hidden]) button[type="submit"]')||form.querySelector('button[type="submit"]')||form.querySelector('button'),label=button.textContent,error=document.querySelector('#form-error');button.disabled=true;button.textContent='Sending your request…';error.textContent='';
  const data=new URLSearchParams(new FormData(form));data.set('reference','BIO-'+crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase());
  try{const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data});if(!response.ok)throw Error('Your request could not be sent. Try again or email '+(form.name==='provider-access'?'providers@smoothscar.com':'contact@smoothscar.com')+'.');if(form.name==='customer-quotes'){try{for(const key of ['smoothscar-contact-submitted','smoothscar-quote-context','smoothscar-bundle-confirmed'])sessionStorage.removeItem(key);}catch{}}location.assign(form.getAttribute('action'));}
  catch(err){error.textContent=err.message;button.disabled=false;button.textContent=label;}
 });
})();

window.addEventListener('pageshow',()=>{const form=document.querySelector('[data-quote-form]');if(!form)return;const reviewButton=form.querySelector('#inquiry-review:not([hidden]) button[type="submit"]');const button=reviewButton||form.querySelector('button[type="submit"]');if(button){button.disabled=false;button.textContent=reviewButton?'Send my quote request':form.getAttribute('name')==='provider-access'?'Request private provider pricing':'Request my quote';}});

// Reflect selection without adding or changing any form field.
(() => {
 const form=document.querySelector('[data-quote-form]');
 const summary=document.querySelector('#quote-product-summary');
 if(!form||!summary)return;
 const daily='<p><strong>BioRNA Daily (Antiscar) — $300/box, 7 patches, nightly 8 hours.</strong></p>';
 const c='<p><strong>BioRNA-C — $375 MSRP/box, 8 patches, twice a week.</strong> Wear 8–12 hours overnight.</p>';
 const bundles={'BioRNA Daily (Antiscar)':{single:300,packs:{1:300,2:515,3:710,4:880}},'BioRNA-C':{single:375,packs:{1:375,2:600,3:825,4:1000}}};
 const money=n=>'$'+n.toLocaleString('en-US');
 const update=()=>{
  const value=form.elements.product.value;
  const base=value==='BioRNA-C'?c:value==='BioRNA Daily (Antiscar)'?daily:daily+c;
  const qty=Math.floor(Number(form.elements.quantity&&form.elements.quantity.value));
  const price=bundles[value];
  if(!price||!Number.isInteger(qty)||qty<1){summary.innerHTML=base;return;}
  const total=qty<=4?price.packs[qty]:price.packs[4]+(qty-4)*price.single;
  const save=qty*price.single-total;
  const boxes=qty===1?'1 box':qty+' boxes';
  summary.innerHTML=base+'<p><strong>'+boxes+': '+money(total)+' total'+(save>0?' · Save '+money(save)+' vs individual boxes':'')+'.</strong></p>';
 };
 form.elements.product.addEventListener('change',update);
 if(form.elements.quantity)form.elements.quantity.addEventListener('input',update);
 update();
})();

// Keep the floating shortcut out of the way while the quote section is visible.
(() => {
 const dock=document.querySelector('.quote-dock'),apply=document.querySelector('#apply');
 if(!dock||!apply||typeof IntersectionObserver==='undefined')return;
 const observer=new IntersectionObserver(entries=>{dock.hidden=entries[0].isIntersecting;});
 observer.observe(apply);
})();
