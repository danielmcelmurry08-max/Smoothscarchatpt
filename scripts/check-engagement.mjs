import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const popup=await readFile('site/engagement.js','utf8');
function popupMount({first,seen,path='/',now=200000}={}){
 const values=new Map();if(first)values.set('smoothscar-first-landing',String(first));if(seen)values.set('smoothscar-patch-popup-seen','1');
 const timers=[],dialog={setAttribute(){},querySelector(){return {addEventListener(){}}},querySelectorAll(){return []},addEventListener(){},showModal(){this.opened=true},close(){this.opened=false}};
 const document={body:{append(){}},createElement:()=>dialog,visibilityState:'visible',activeElement:null,querySelector:()=>null};
 runInNewContext(popup,{location:{pathname:path},Date:{now:()=>now},sessionStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},document,setTimeout:(fn,ms)=>timers.push({fn,ms})});return {values,timers,dialog};
}
let x=popupMount();assert.equal(x.timers[0].ms,15000);assert.ok(!x.dialog.opened);x.timers[0].fn();assert.equal(x.dialog.opened,true);assert.equal(x.values.get('smoothscar-patch-popup-seen'),'1');
x=popupMount({first:190000});assert.equal(x.timers[0].ms,5000,'Navigation must not restart the fifteen-second landing timer');
assert.equal(popupMount({seen:true}).timers.length,0,'Do not repeat in the same session');
assert.equal(popupMount({path:'/provider/'}).timers.length,0,'Do not interrupt provider inquiries');
const offer=await readFile('site/submitted-offer.js','utf8');
function offerMount(timestamp){const panel={hidden:true,innerHTML:''};runInNewContext(offer,{document:{querySelector:()=>panel},sessionStorage:{getItem:()=>timestamp??null},Date:{now:()=>2000000}});return panel;}
assert.equal(offerMount().hidden,true,'Direct confirmation-page visits do not reveal the offer');assert.equal(offerMount('1').hidden,true,'Expired completion flags do not reveal offers');assert.equal(offerMount('1999000').hidden,false);
const quote=await readFile('site/quote.js','utf8');
async function submit(ok){const values=new Map(),listeners={},product={value:'BioRNA-C',addEventListener(){}};const button={textContent:'Request my quote'},error={textContent:''};const form={name:'customer-quotes',elements:{product},addEventListener:(n,fn)=>listeners[n]=fn,reportValidity:()=>true,querySelector:()=>button,getAttribute:()=>'/customer-confirmation'};
 const document={querySelector:s=>s==='[data-quote-form]'?form:s==='#form-error'?error:null};let assigned='';
 runInNewContext(quote,{URLSearchParams,Date,FormData:class extends Map{constructor(){super([['form-name','customer-quotes']])}},location:{pathname:'/customer/',search:'',hash:'',assign:p=>assigned=p},document,window:{addEventListener(){}},sessionStorage:{setItem:(k,v)=>values.set(k,v)},crypto:{randomUUID:()=> '12345678-1234-1234-1234-123456789000'},fetch:async()=>({ok})});
 await listeners.submit({preventDefault(){}});return {values,assigned,error};}
x=await submit(false);assert.equal(x.values.has('smoothscar-contact-submitted'),false);assert.equal(x.assigned,'');x=await submit(true);assert.equal(x.values.has('smoothscar-contact-submitted'),true);assert.equal(x.assigned,'/customer-confirmation');
console.log('Verified 15-second landing timer, session dismissal, confirmation-only offer display and successful-submission gating without network calls.');
