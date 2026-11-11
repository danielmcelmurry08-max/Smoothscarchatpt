(() => {
 const params=new URLSearchParams(location.search);
 if(location.pathname==='/' && ['#portfolio','#apply','#biorna-daily','#biorna-c','#webinar','#science'].includes(location.hash) && params.get('intent')!=='provider'){location.replace('/customer/'+location.search+location.hash);return;}
 if(location.pathname==='/' && params.get('intent')==='provider'){location.replace('/provider/#apply');return;}
 const form=document.querySelector('[data-quote-form]'); if(!form)return;
 const product=form.elements.product,offer=document.querySelector('#c-offer'),code=document.querySelector('#offer-code');
 function updateOffer(){if(!offer)return;const on=product.value==='BioRNA-C';offer.hidden=!on;code.disabled=!on;if(!on)code.value='';}
 const requested=params.get('product');if(requested==='daily'||requested==='BioRNA Antiscar'||requested==='BioRNA Daily (Antiscar)')product.value='BioRNA Daily (Antiscar)';if(requested==='c'||requested==='BioRNA-C')product.value='BioRNA-C';
 product.addEventListener('change',updateOffer);updateOffer();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const button=form.querySelector('button'),label=button.textContent,error=document.querySelector('#form-error');button.disabled=true;button.textContent='Sending your request…';error.textContent='';
  const data=new URLSearchParams(new FormData(form));data.set('reference','BIO-'+crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase());
  try{const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data});if(!response.ok)throw Error('Your request could not be sent. Try again or email helixbiodyne@rayesolutions.com.');location.assign(form.getAttribute('action'));}
  catch(err){error.textContent=err.message;button.disabled=false;button.textContent=label;}
 });
})();

window.addEventListener('pageshow',()=>{const form=document.querySelector('[data-quote-form]');if(!form)return;const button=form.querySelector('button[type="submit"]');if(button){button.disabled=false;button.textContent='' || (form.getAttribute('name')==='provider-access'?'Request private provider pricing':'Request my quote');}});
