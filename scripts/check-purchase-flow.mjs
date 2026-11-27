import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const customer = await readFile('site/customer/index.html', 'utf8');
const product = await readFile('site/products/biorna-c/index.html', 'utf8');
const confirmation = await readFile('site/customer-confirmation.html', 'utf8');
const code = await readFile('site/purchase-flow.js', 'utf8');
for (const html of [customer, product]) {
 const bundles = html.split('id="bundles"')[1].split('</section>')[0];
 for (const [quantity, total, unit] of [[1,'500','500'], [2,'900','450'], [3,'1,250','416.67'], [4,'1,600','400']]) {
  assert.ok(bundles.includes('$' + total + '<span'));
  assert.ok(bundles.includes('$' + unit + ' per box'));
  assert.ok(bundles.includes('quantity=' + quantity + '#apply'));
 }
}
const quote = customer.split('id="apply"')[1].split('id="silicone-comparison"')[0];
assert.deepEqual([...new Set([...quote.matchAll(/\$([\d,]+)/g)].map(match => match[1]))].sort(), ['18','25','500']);
assert.ok(!quote.includes('data-review-subtotal'));
assert.ok(!confirmation.includes('submitted-offer') && !confirmation.includes('Choose your supply'));
assert.match(customer,/id="inquiry-review" hidden/);
assert.match(customer,/type="submit" data-direct-submit/);
function mount(product, quantity, size='8') {
 const nodes = new Map();
 const node = selector => {
  if (!nodes.has(selector)) nodes.set(selector, {hidden:selector==='#inquiry-review', textContent:'', listeners:{}, addEventListener(name,fn){this.listeners[name]=fn;}, focus(){}});
  return nodes.get(selector);
 };
 const fields = Object.fromEntries(Object.entries({product,quantity,size,name:'Sample Customer',email:'sample@example.com',country:'United States',postal_code:'00000'}).map(([name,value])=>[name,{value}]));
 const form = node('form[name="customer-quotes"]');
 form.elements = fields;form.reportValidity = ()=>true;form.querySelector = node;
 const review = node('#inquiry-review');review.querySelector = node;
 runInNewContext(code, {document:{querySelector:node}});
 node('#review-inquiry').listeners.click();
 return {node,form};
}
for(const [product, quantity, size, price, bundle, sizeLabel] of [['BioRNA-C','1','8','$500 per box','$500 before shipping and tax','8 patches per box'],['BioRNA-C','4','8','$500 per box','$1,600 before shipping and tax','8 patches per box'],['BioRNA-C','10000','8','$500 per box','Confirmed in your itemized quote','8 patches per box'],['BioRNA AntiScar','1','8','$500 per box','$500 before shipping and tax','8 patches per box'],['BioRNA AntiScar','2','8','$500 per box','$900 before shipping and tax','8 patches per box'],['BioRNA AntiScar','4','8','$500 per box','$1,600 before shipping and tax','8 patches per box'],['BioRNA AntiScar','1','24','$1,150 per box','$1,150 before shipping and tax','24 patches per box'],['BioRNA-C','3','24','$1,150 per box','$3,000 before shipping and tax','24 patches per box'],['BioRNA AntiScar','4','24','$1,150 per box','Confirmed in your itemized quote','24 patches per box'],['BioRNA AntiScar','1','2','$135 per box','$135 before shipping and tax','2 patches per box'],['BioRNA-C','1','2','$135 per box','$135 before shipping and tax','2 patches per box'],['BioRNA-C','2','2','$135 per box','Confirmed in your itemized quote','2 patches per box']]) {
 let flow = mount(product,quantity,size);
 assert.equal(flow.node('[data-review-price]').textContent,price);
 assert.equal(flow.node('[data-review-bundle]').textContent,bundle);
 assert.equal(flow.node('[data-review-size]').textContent,sizeLabel);
 assert.equal(flow.node('#inquiry-review').hidden,false);
 flow.node('#edit-inquiry').listeners.click();
 assert.equal(flow.node('#inquiry-review').hidden,true);
}
assert.equal(mount('','').node('[data-review-price]').textContent,'AntiScar $500 · BioRNA-C $500');
assert.equal(mount('','').node('[data-review-bundle]').textContent,'Confirmed in your itemized quote');
console.log('Verified public bundle totals and links, bundle-total quote review at all quantities, review/edit and plain confirmation.');
