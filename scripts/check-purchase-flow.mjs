import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const customer = await readFile('site/customer/index.html', 'utf8');
const product = await readFile('site/products/biorna-c/index.html', 'utf8');
const confirmation = await readFile('site/customer-confirmation.html', 'utf8');
const code = await readFile('site/purchase-flow.js', 'utf8');
for (const html of [customer, product]) {
 const bundles = html.split('id="bundles"')[1].split('</section>')[0];
 for (const [quantity, total, unit] of [[1,'375','375'], [2,'600','300'], [3,'825','275'], [4,'1,000','250']]) {
  assert.ok(bundles.includes('$' + total + '<span'));
  assert.ok(bundles.includes('$' + unit + ' per box'));
  assert.ok(bundles.includes('quantity=' + quantity + '#apply'));
 }
}
const quote = customer.split('id="apply"')[1].split('id="silicone-comparison"')[0];
assert.deepEqual([...new Set([...quote.matchAll(/\$([\d,]+)/g)].map(match => match[1]))].sort(), ['18','25','300','375']);
assert.ok(!quote.includes('data-review-subtotal'));
assert.ok(!confirmation.includes('submitted-offer') && !confirmation.includes('Choose your supply'));
assert.match(customer,/id="inquiry-review" hidden/);
assert.match(customer,/type="submit" data-direct-submit/);
function mount(product, quantity) {
 const nodes = new Map();
 const node = selector => {
  if (!nodes.has(selector)) nodes.set(selector, {hidden:selector==='#inquiry-review', textContent:'', listeners:{}, addEventListener(name,fn){this.listeners[name]=fn;}, focus(){}});
  return nodes.get(selector);
 };
 const fields = Object.fromEntries(Object.entries({product,quantity,name:'Sample Customer',email:'sample@example.com',country:'United States',postal_code:'00000'}).map(([name,value])=>[name,{value}]));
 const form = node('form[name="customer-quotes"]');
 form.elements = fields;form.reportValidity = ()=>true;form.querySelector = node;
 const review = node('#inquiry-review');review.querySelector = node;
 runInNewContext(code, {document:{querySelector:node}});
 node('#review-inquiry').listeners.click();
 return {node,form};
}
for(const [product, quantity, price, bundle] of [['BioRNA-C','1','$375 MSRP per box','$375 before shipping and tax'],['BioRNA-C','4','$375 MSRP per box','$1,000 before shipping and tax'],['BioRNA-C','10000','$375 MSRP per box','Confirmed in your itemized quote'],['BioRNA Daily (Antiscar)','1','$300 per box','$300 before shipping and tax'],['BioRNA Daily (Antiscar)','2','$300 per box','$515 before shipping and tax'],['BioRNA Daily (Antiscar)','4','$300 per box','$880 before shipping and tax']]) {
 let flow = mount(product,quantity);
 assert.equal(flow.node('[data-review-price]').textContent,price);
 assert.equal(flow.node('[data-review-bundle]').textContent,bundle);
 assert.equal(flow.node('#inquiry-review').hidden,false);
 flow.node('#edit-inquiry').listeners.click();
 assert.equal(flow.node('#inquiry-review').hidden,true);
}
assert.equal(mount('','').node('[data-review-price]').textContent,'Daily $300 · BioRNA-C $375 MSRP');
assert.equal(mount('','').node('[data-review-bundle]').textContent,'Confirmed in your itemized quote');
console.log('Verified public bundle totals and links, bundle-total quote review at all quantities, review/edit and plain confirmation.');
