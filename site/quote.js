(() => {
 const params=new URLSearchParams(location.search);
 if(location.hash==='#webinar'){location.replace('/customer/#apply');return;}
 if(location.pathname==='/' && ['#portfolio','#apply','#biorna-antiscar','#biorna-c','#science'].includes(location.hash) && params.get('intent')!=='provider'){location.replace('/customer/'+location.search+location.hash);return;}
 if(location.pathname==='/' && params.get('intent')==='provider'){location.replace('/provider/#apply');return;}
 const form=document.querySelector('[data-quote-form]'); if(!form)return;
 const product=form.elements.product;
 const requested=params.get('product');if(requested==='daily'||requested==='antiscar'||requested==='BioRNA Antiscar'||requested==='BioRNA Daily (Antiscar)')product.value='BioRNA AntiScar';if(requested==='c'||requested==='BioRNA-C')product.value='BioRNA-C';
 const requestedSize=params.get('size');if(form.elements.size&&(requestedSize==='24'||requestedSize==='8'||requestedSize==='2'))form.elements.size.value=requestedSize;
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
 const bundles={'BioRNA AntiScar':{2:{single:135,packs:{1:135}},8:{single:500,packs:{1:500,2:900,3:1250,4:1600}},24:{single:1150,packs:{1:1150,2:2250,3:3000}}},'BioRNA-C':{2:{single:135,packs:{1:135}},8:{single:500,packs:{1:500,2:900,3:1250,4:1600}},24:{single:1150,packs:{1:1150,2:2250,3:3000}}}};
 const money=n=>'$'+n.toLocaleString('en-US');
 const line=(product,size)=>'<p><strong>'+product+' — $'+bundles[product][size].single.toLocaleString('en-US')+'/box, '+size+' patches, twice weekly 8–12 hours.</strong></p>';
 const update=()=>{
  const value=form.elements.product.value;
  const size=form.elements.size&&form.elements.size.value||'8';
  const base=value==='BioRNA-C'?line(value,size):value==='BioRNA AntiScar'?line(value,size):line('BioRNA AntiScar','8')+line('BioRNA-C','8');
  const qty=Math.floor(Number(form.elements.quantity&&form.elements.quantity.value));
  const ladder=bundles[value]&&bundles[value][size];
  if(!ladder||!Number.isInteger(qty)||qty<1){summary.innerHTML=base;return;}
  const maxPacks=size==='24'?3:size==='2'?1:4;
  const total=qty<=maxPacks?ladder.packs[qty]:ladder.packs[maxPacks]+(qty-maxPacks)*ladder.single;
  const save=qty*ladder.single-total;
  const boxes=qty===1?'1 box':qty+' boxes';
  summary.innerHTML=base+'<p><strong>'+boxes+': '+money(total)+' total'+(save>0?' · Save '+money(save)+' vs individual boxes':'')+'.</strong></p>';
 };
 form.elements.product.addEventListener('change',update);
 if(form.elements.quantity)form.elements.quantity.addEventListener('input',update);
 if(form.elements.size)form.elements.size.addEventListener('change',update);
 update();
})();

// Keep the floating shortcut out of the way while the quote section is visible.
(() => {
 const dock=document.querySelector('.quote-dock'),apply=document.querySelector('#apply');
 if(!dock||!apply||typeof IntersectionObserver==='undefined')return;
 const observer=new IntersectionObserver(entries=>{dock.hidden=entries[0].isIntersecting;});
 observer.observe(apply);
})();
