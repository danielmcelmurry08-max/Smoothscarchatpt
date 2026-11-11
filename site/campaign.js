
const $=s=>document.querySelector(s);
const params=new URLSearchParams(location.search);
const testMode=params.has('test');
if(testMode)$('#test-option').classList.remove('hidden');
document.querySelectorAll('[data-product]').forEach(a=>a.addEventListener('click',()=>{$('#product').value=a.dataset.product;}));
const bar=document.querySelector('.bottom');
if(bar&&'IntersectionObserver' in window){const seen=new Set();const io=new IntersectionObserver(entries=>{for(const en of entries)en.isIntersecting?seen.add(en.target):seen.delete(en.target);bar.classList.toggle('away',seen.size>0);});for(const el of [$('.hero'),$('#apply'),$('footer')])if(el)io.observe(el);}
const form=$('#provider'),submit=$('#submit');let submitLabel=submit.textContent;
form.addEventListener('submit',async e=>{
  e.preventDefault();
  $('#form-error').textContent='';
  if(!form.checkValidity()){form.reportValidity();return;}
  submit.disabled=true;submit.textContent='Sending your request…';
  const data=Object.fromEntries(new FormData(form));
  data.test=testMode&&form.test.checked;
  try{
    const reference='BIO-'+(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)).replace(/-/g,'').slice(0,8).toUpperCase();
    const encoded=new URLSearchParams(new FormData(form));
    encoded.set('reference',reference);
    encoded.set('form-name',data.test?'provider-test':'provider-access');
    encoded.set('test',String(data.test));
    for(const [k,v] of params)if(k.startsWith('utm_'))encoded.set(k,v.slice(0,200));
    let r;
    try{r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encoded});}
    catch{throw Error('We couldn’t reach the server. Check your connection and try again.');}
    if(!r.ok)throw Error('Your request couldn’t be sent. Please try again or email helixbiodyne@rayesolutions.com.');
    const receipt={reference,test:data.test,submittedAt:new Date().toISOString(),name:data.name,email:data.email,practice:data.practice,product:data.product,inquiryType:data.inquiry_type,event:'Product and provider inquiry',eventDate:'TBD',offer:'SMOOTH20: $300 per box from $375 regular; consumer first order; no stacking'};
    if(!data.test)track('generate_lead',{inquiry_type:data.inquiry_type,product:data.product});
    try{sessionStorage.setItem('biorna-receipt',JSON.stringify(receipt));}catch{}
    location.assign('/thank-you?ref='+encodeURIComponent(reference)+(data.test?'&test=1':''));
    return;
  }catch(err){$('#form-error').textContent=err.message;submit.disabled=false;submit.textContent=submitLabel;}
});
window.addEventListener('pageshow',()=>{submit.disabled=false;submit.textContent=submitLabel;});

function track(name,detail={}){window.dispatchEvent(new CustomEvent('smoothscar:analytics',{detail:{event:name,...detail}}));if(typeof window.gtag==='function')window.gtag('event',name,detail);}
const inquiryType=document.querySelector('#inquiry-type');
if(params.get('intent')==='provider'){inquiryType.value='provider';form.querySelector('[name=offer_code]').value='';submit.textContent='Request private provider pricing';submitLabel=submit.textContent;}
document.querySelectorAll('[data-intent="provider"]').forEach(a=>a.addEventListener('click',()=>{inquiryType.value='provider';track('provider_inquiry_click');}));
document.querySelectorAll('[data-product]').forEach(a=>a.addEventListener('click',()=>track('product_inquiry_click',{product:a.dataset.product})));
let started=false;form.addEventListener('input',()=>{if(!started){started=true;track('inquiry_start',{inquiry_type:inquiryType.value});}});

const requestedProduct=params.get('product');
if(['BioRNA Antiscar','BioRNA-C'].includes(requestedProduct))document.querySelector('#product').value=requestedProduct;
