import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const code = await readFile('site/submitted-offer.js', 'utf8');
function mount({timestamp = '1999000', product = 'BioRNA-C', quantity = '', ok = true, values: existing} = {}) {
 const values = existing || new Map([
  ['smoothscar-contact-submitted', timestamp],
  ['smoothscar-quote-context', JSON.stringify({name:'Sample Customer', email:'sample@example.com', product, quantity, reference:'BIO-1234ABCD', country:'United States', postal_code:'00000'})]
 ]);
 const nodes = new Map();
 const node = selector => {
  if (!nodes.has(selector)) nodes.set(selector, {hidden:false, value:'', textContent:'', innerHTML:'', checked:false, disabled:false, listeners:{}, addEventListener(type, fn){this.listeners[type]=fn;}, setAttribute(name, value){this[name]=value;}, focus(){}, checkValidity:()=>true, reportValidity:()=>true});
  return nodes.get(selector);
 };
 const panel = node('panel');panel.hidden = true;panel.querySelector = node;
 const requests = [];
 runInNewContext(code, {
  document:{querySelector:()=>panel,querySelectorAll:()=>[]}, Date:{now:()=>2000000}, crypto:{randomUUID:()=> 'abcd1234-abcd-abcd-abcd-abcd12345678'},
  sessionStorage:{getItem:key=>values.get(key)??null, setItem:(key,value)=>values.set(key,value), removeItem:key=>values.delete(key)},
  URLSearchParams, fetch:async(url, options)=>{requests.push({url, data:new URLSearchParams(options.body)});return {ok};}
 });
 const change = (name, value, checked = false) => panel.listeners.change({target:{name, value, checked, id:name}});
 const click = selector => node(selector).listeners.click();
 return {values, panel, node, change, click, requests};
}
assert.equal(mount({timestamp:null}).panel.hidden, true);
assert.equal(mount({timestamp:'1'}).panel.hidden, true);
assert.equal(mount({timestamp:'3000000'}).panel.hidden, true);
let flow = mount();
assert.equal(flow.panel.hidden, false);
assert.match(flow.node('.bundle-options').innerHTML, /value="2" checked/);
for (const [quantity, total] of [[1,'$375'],[2,'$600'],[3,'$825'],[4,'$1,000']]) {
 flow.change('bundle-quantity', String(quantity));flow.click('#review-bundle');
 assert.equal(flow.node('[data-order-total]').textContent, total);
 flow.click('#edit-bundle');
}
flow.change('bundle-quantity','1');flow.change('first-order-check','',true);flow.click('#review-bundle');
assert.equal(flow.node('[data-order-total]').textContent,'$300');
flow.click('#edit-bundle');flow.change('bundle-quantity','4');flow.click('#review-bundle');
assert.equal(flow.node('[data-order-total]').textContent,'$1,000','First-order discounts never stack with bundle pricing');
await flow.click('#send-bundle');
assert.equal(flow.requests.length,1);
assert.equal(flow.requests[0].data.get('quantity'),'4');
assert.equal(flow.requests[0].data.get('offer_code'),'');
assert.equal(flow.requests[0].data.get('reference'),'BIO-1234ABCD-BUNDLE');
assert.equal(flow.requests[0].data.get('email'),'sample@example.com');
assert.match(flow.requests[0].data.get('comments'),/1,000/);
assert.equal(flow.values.has('smoothscar-quote-context'),false,'Clear contact context after successful follow-up');
assert.match(flow.panel.innerHTML,/Your selection is with our team/);
assert.match(mount({values:flow.values}).panel.innerHTML,/Your selection is with our team/,'Refresh preserves completion');
flow=mount({ok:false});flow.click('#review-bundle');await flow.click('#send-bundle');
assert.equal(flow.node('#send-bundle').disabled,false);
assert.equal(flow.values.has('smoothscar-bundle-confirmed'),false);
assert.equal(flow.node('#bundle-status').role,'alert');
flow=mount({product:'BioRNA Daily (Antiscar)'});
for(const quantity of [1,2,3,4]){
 flow.change('bundle-quantity',String(quantity));flow.click('#review-bundle');
 assert.equal(flow.node('[data-order-total]').textContent,'$'+(300*quantity).toLocaleString('en-US'));
 flow.click('#edit-bundle');
}
flow.change('bundle-product','c');flow.change('bundle-quantity','1');flow.change('first-order-check','',true);flow.click('#review-bundle');await flow.click('#send-bundle');
assert.equal(flow.requests[0].data.get('offer_code'),'SMOOTH20');
// The inquiry review introduces no new fields into the existing form schema.
const html=await readFile('site/customer/index.html','utf8');
assert.match(html,/id="inquiry-review" hidden/);
assert.match(html,/type="submit" data-direct-submit/);
assert.ok(html.indexOf('src="/purchase-flow.js"')<html.indexOf('src="/quote.js"'));
console.log('Validated all bundle totals, first-order isolation, Daily pricing, review/edit, submission payload, retry and refresh completion. No external requests made.');
