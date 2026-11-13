import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile('site/'+p,'utf8');
const [hub,customer,provider,daily,c,quote]=await Promise.all(['index.html','customer/index.html','provider/index.html','products/biorna-daily/index.html','products/biorna-c/index.html','quote.js'].map(read));
assert.ok(!hub.includes('<form'));
assert.ok(customer.includes('name="customer-quotes"'));
assert.ok(provider.includes('name="provider-access"'));
assert.ok(!customer.includes('name="role"')&&!customer.includes('name="practice"'));
assert.ok(provider.includes('name="practice"')&&provider.includes('name="role"'));
assert.ok(!provider.includes('SMOOTH20')&&!provider.includes('$350')&&!provider.includes('$300'));
assert.ok(!daily.includes('SMOOTH20')&&!daily.includes('20%'));
assert.ok(c.includes('SMOOTH20')&&c.includes('BioRNA-C')&&c.includes('$375 per box'));
for(const section of ['hero']){
 const area=section==='hero'?customer.split('<section class="hero">')[1].split('</section>')[0]:customer.split('id="portfolio"')[1].split('</section>')[0];
 assert.ok(!/\$\d|SMOOTH20/.test(area),'No prices in customer '+section);
}
for(const html of [hub,customer,provider,daily,c]){
 assert.ok(!html.includes('25%'));
 assert.ok(!/BioRNA Daily(?! \(Antiscar\))|BioRNA Antiscar/.test(html),'Full product name required');
 assert.ok(html.includes('mailto:contact@smoothscar.com'));
}
new Function(quote);new Function(await read('webinar.js'));
assert.ok(quote.includes("code.disabled=!on"));
assert.ok(customer.includes('action="/customer-confirmation"'));
assert.ok(provider.includes('action="/provider-confirmation"'));
assert.ok(customer.includes('$300 per box')&&customer.includes('Request Daily quote')&&customer.includes('Request BioRNA-C quote'));
assert.ok(!customer.includes('Reduce scar volume by up to 95%'));
console.log('Validated audience separation, clear retail prices, product quote routes and scoped offers.');
