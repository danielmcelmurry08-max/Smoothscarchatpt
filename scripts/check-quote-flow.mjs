import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const code=await readFile('site/quote.js','utf8');
function mount(query){
 const listeners={};
 const product={value:'',addEventListener:(name,fn)=>{listeners[name]=fn;}};
 const quantity={value:'',addEventListener:(name,fn)=>{listeners['quantity:'+name]=fn;}};
 const size={value:'',addEventListener:(name,fn)=>{listeners['size:'+name]=fn;}};
 const form={elements:{product,quantity,size},addEventListener:(name,fn)=>{listeners['form:'+name]=fn;},getAttribute:()=>'/customer-confirmation'};
 const doc={querySelector:(selector)=>({'[data-quote-form]':form}[selector]??null)};
 const location={pathname:'/customer/',search:query,hash:'',replace:()=>{},assign:()=>{}};
 runInNewContext(code,{URLSearchParams,location,document:doc,window:{addEventListener:()=>{}},crypto:{randomUUID:()=> '12345678-1234-1234-1234-123456789000'}});
 return {product,quantity,size};
}
assert.equal(mount('?product=c').product.value,'BioRNA-C');
assert.equal(mount('?product=daily').product.value,'BioRNA AntiScar');
assert.equal(mount('?product=antiscar').product.value,'BioRNA AntiScar');
assert.equal(mount('?product=antiscar&size=24').size.value,'24');
assert.equal(mount('?product=c&size=24').size.value,'24');
assert.equal(mount('?product=c&size=8').size.value,'8');
assert.equal(mount('?product=antiscar&size=2').size.value,'2');
assert.equal(mount('?product=c&size=2').size.value,'2');
assert.equal(mount('?product=c&quantity=4').quantity.value,'4');
for(const quantity of ['0','-1','5','2.5','invalid'])assert.equal(mount('?product=c&quantity='+quantity).quantity.value,'');
assert.doesNotMatch(await readFile('site/customer/index.html','utf8'),/name="promo_code"|SMOOTH20/);
assert.doesNotMatch(await readFile('site/provider/index.html','utf8'),/promo_code|SMOOTH20/);
console.log('Verified product selection and quantity, with no promo code field.');
