
const $=s=>document.querySelector(s);
const params=new URLSearchParams(location.search);
const testMode=params.has('test');
if(testMode)$('#test-option').classList.remove('hidden');
const cases={
 csection:{before:'/assets/csection-before.webp',after:'/assets/csection-after.webp',first:'Day 0 · 24 Mar 2025',last:'After 6 weeks',className:'is-csection',title:'C-section scar · Source case photographs',note:'Source: BioRNA Clinician Deck, C-section case, page 17. Surgery dated 8 March 2025; baseline dated 24 March 2025; follow-up labeled after six weeks of BioRNA use. Individual case photographs; outcomes vary.',focus:'Original source photos with different angles and lighting. Side-by-side view preserves the full photographs. Drag comparison is available for visual exploration.',altBefore:'C-section scar at baseline, 24 March 2025, from the BioRNA clinician deck',altAfter:'C-section scar follow-up labeled after six weeks of BioRNA use in the clinician deck'},

 case:{before:'/assets/scar-day-1.jpeg',after:'/assets/scar-day-3.jpeg',first:'Day 1',last:'Day 3',className:'',title:'16-year-old scar · Day 1 and Day 3',note:'Day labels and scar age supplied by the owner. This individual example does not establish a treatment effect or predict results. Photographs have not been retouched.',focus:'Owner-supplied photographs. The limb angle and scar position differ between the photographs. Compare the full views side by side, or choose Drag comparison to explore.',altBefore:'Day 1 photograph of the owner-supplied 16-year-old scar',altAfter:'Day 3 photograph of the owner-supplied 16-year-old scar'},
 tka:{before:'/assets/scar-concept.webp',after:'/assets/scar-concept.webp',first:'Earlier illustration',last:'Later illustration',className:'is-knee',title:'TKA · Illustrative scar appearances',note:'AI-generated illustration only. Not patient photographs, a clinical timeline, a before-and-after treatment result or evidence of BioRNA efficacy.',focus:'Knee arthroplasty illustration: explore two fictional scar appearances. These images do not show a patient outcome.',altBefore:'AI-generated earlier knee scar illustration',altAfter:'AI-generated later knee scar illustration'},
 tha:{before:'/assets/tha-scar-comparison-ai.png',after:'/assets/tha-scar-comparison-ai.png',first:'Raised illustration',last:'Minimal illustration',className:'is-hip',title:'THA · Illustrative scar appearances',note:'AI-generated fictional hip illustration only. Not patient photographs, a before-and-after treatment result or evidence of BioRNA efficacy.',focus:'Hip arthroplasty illustration: raised scar appearance on the left and minimal appearance on the right. These images do not show a patient outcome.',altBefore:'AI-generated hip with a raised scar',altAfter:'AI-generated hip with a minimal scar'}
};
let selected='case',sideBySide=false,dragging=false;
const stage=$('#comparison-stage'),range=$('#comparison-range'),shell=$('#comparison-panel');
function setPosition(value){const v=Math.max(0,Math.min(100,Math.round(Number(value)||0)));range.value=String(v);stage.style.setProperty('--position',v+'%');$('#comparison-position').value=v+'%';range.setAttribute('aria-valuetext',v+' percent '+cases[selected].first+', '+(100-v)+' percent '+cases[selected].last);}
function selectTab(id,moveFocus=false){if(!cases[id])return;selected=id;for(const key of Object.keys(cases)){const on=key===id;$('#'+key).setAttribute('aria-selected',String(on));$('#'+key).tabIndex=on?0:-1;}const c=cases[id];stage.className='comparison-stage '+c.className;for(const [target,src,alt] of [['before-photo',c.before,c.altBefore],['after-photo',c.after,c.altAfter]]){const img=$('#'+target);img.src=src;img.alt=alt;}for(const id of ['before-label','before-side'])$('#'+id).textContent=c.first;for(const id of ['after-label','after-side'])$('#'+id).textContent=c.last;$('#show-before').textContent='Show '+c.first;$('#show-after').textContent='Show '+c.last;$('#comparison-title').textContent=c.title;$('#comparison-note').textContent=c.note;$('#focus').textContent=c.focus;shell.setAttribute('aria-labelledby',id);range.setAttribute('aria-label','Amount of '+c.first+' image visible');setView(id==='case'||id==='csection');setPosition(50);if(moveFocus)$('#'+id).focus();}
for(const id of Object.keys(cases)){const tab=$('#'+id);tab.addEventListener('click',()=>selectTab(id));tab.addEventListener('keydown',e=>{const ids=Object.keys(cases);let i=ids.indexOf(id);if(e.key==='ArrowRight')i=(i+1)%ids.length;else if(e.key==='ArrowLeft')i=(i+ids.length-1)%ids.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=ids.length-1;else return;e.preventDefault();selectTab(ids[i],true);});}
function setView(side){sideBySide=side;shell.classList.toggle('is-side-by-side',side);$('#slider-view').setAttribute('aria-pressed',String(!side));$('#side-view').setAttribute('aria-pressed',String(side));}
selectTab('case');
$('#slider-view').addEventListener('click',()=>setView(false));$('#side-view').addEventListener('click',()=>setView(true));range.addEventListener('input',()=>setPosition(range.value));
function moveDivider(e){const rect=stage.getBoundingClientRect();if(rect.width)setPosition((e.clientX-rect.left)/rect.width*100);}
stage.addEventListener('pointerdown',e=>{if(sideBySide||e.button!==0)return;dragging=true;stage.setPointerCapture(e.pointerId);moveDivider(e);});stage.addEventListener('pointermove',e=>{if(dragging&&!sideBySide)moveDivider(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,()=>{dragging=false;});
$('#show-before').addEventListener('click',()=>setPosition(100));$('#show-after').addEventListener('click',()=>setPosition(0));$('#reset-comparison').addEventListener('click',()=>setPosition(50));
document.querySelectorAll('[data-product]').forEach(a=>a.addEventListener('click',()=>{$('#product').value=a.dataset.product;}));
const bar=document.querySelector('.bottom');
if(bar&&'IntersectionObserver' in window){const seen=new Set();const io=new IntersectionObserver(entries=>{for(const en of entries)en.isIntersecting?seen.add(en.target):seen.delete(en.target);bar.classList.toggle('away',seen.size>0);});for(const el of [$('.hero'),$('#apply'),$('footer')])if(el)io.observe(el);}
const form=$('#provider'),submit=$('#submit'),submitLabel=submit.textContent;
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
if(params.get('intent')==='provider')inquiryType.value='provider';
document.querySelectorAll('[data-intent="provider"]').forEach(a=>a.addEventListener('click',()=>{inquiryType.value='provider';track('provider_inquiry_click');}));
document.querySelectorAll('[data-product]').forEach(a=>a.addEventListener('click',()=>track('product_inquiry_click',{product:a.dataset.product})));
let started=false;form.addEventListener('input',()=>{if(!started){started=true;track('inquiry_start',{inquiry_type:inquiryType.value});}});

const requestedProduct=params.get('product');
if(['BioRNA Antiscar','BioRNA-C'].includes(requestedProduct))document.querySelector('#product').value=requestedProduct;
// Preserve campaign attribution when visitors explore a product before inquiring.
try {
  const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const incoming=Object.fromEntries(keys.filter(k=>params.has(k)).map(k=>[k,params.get(k).slice(0,200)]));
  if(Object.keys(incoming).length)sessionStorage.setItem('smoothscar-attribution',JSON.stringify(incoming));
  const attribution=JSON.parse(sessionStorage.getItem('smoothscar-attribution')||'{}');
  for(const k of keys)if(typeof attribution[k]==='string')form.elements[k].value=attribution[k].slice(0,200);
} catch {}
