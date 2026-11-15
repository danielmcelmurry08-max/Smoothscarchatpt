(() => {
 if(navigator.globalPrivacyControl||navigator.doNotTrack==='1')return;
 const audience=location.pathname.startsWith('/provider')?'provider':'customer';
 const sent=new Set();
 window.smoothscarTrack=event=>{
  if(!['product_choice','inquiry_start','inquiry_success'].includes(event)||sent.has(event))return;
  sent.add(event);
  // Never read or transmit field values, product selection, query strings or identifiers.
  fetch('/.netlify/functions/conversion-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,audience}),keepalive:true}).catch(()=>{});
 };
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');if(!link)return;
  const href=link.getAttribute('href');
  if(href.startsWith('/customer/?product=')||href.startsWith('/products/biorna-'))window.smoothscarTrack('product_choice');
 });
 const form=document.querySelector('[data-quote-form]');
 form?.addEventListener('input',()=>window.smoothscarTrack('inquiry_start'),{once:true});
})();
