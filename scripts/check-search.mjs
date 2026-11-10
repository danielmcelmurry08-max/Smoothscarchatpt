import assert from 'node:assert/strict';
import {readFile, readdir, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root='site', origin='https://smoothscar.com';
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk(root), toml=await readFile('netlify.toml','utf8');
const sitemap=await readFile('site/sitemap.xml','utf8');
const indexed=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const pages=files.filter(file=>file.endsWith('.html'));
for(const file of pages){
  const html=await readFile(file,'utf8');
  for(const m of html.matchAll(/<(?:a|link|img|script)\b[^>]*\b(?:href|src)="(\/[^"?#]*)/g)){
    const target=path.join(root,m[1]);
    try {await access(target);} catch {await access(path.join(target,'index.html'));}
  }
  for(const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)){
    JSON.parse(m[1]);
    const hash=createHash('sha256').update(m[1]).digest('base64');
    assert.ok(toml.includes(`sha256-${hash}`),`${file}: JSON-LD blocked by CSP`);
  }
  if(/name="robots" content="noindex/.test(html))continue;
  const route=file==='site/index.html'?'/':'/'+path.relative(root,path.dirname(file)).split(path.sep).join('/')+'/';
  const canonical=origin+route;
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`),`${file}: canonical missing or wrong`);
  assert.ok(indexed.includes(canonical),`${file}: absent from sitemap`);
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,`${file}: exactly one H1 required`);
  assert.ok(html.includes('src="/attribution.js"'),`${file}: landing-page attribution missing`);
}
const main=await readFile('site/index.html','utf8');
assert.ok(main.includes('data-intent="provider" href="#apply">Provider information'), 'Provider header CTA must preserve intent');
console.log('Validated public canonicals, sitemap coverage, JSON-LD/CSP, internal assets, headings and landing attribution.');
// A visitor can land on a product, browse, then inquire on the homepage.
const {runInNewContext}=await import('node:vm');
const attribution=await readFile('site/attribution.js','utf8');
const store=new Map();
const storage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};
const fields=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>[k,{value:''}]));
function landing(search,form=null,sessionStorage=storage){runInNewContext(attribution,{URLSearchParams,location:{search},sessionStorage,document:{querySelector:()=>form}});}
landing('?utm_source=instagram&utm_medium=organic_social&utm_campaign=product_questions');
landing('',{elements:fields});
assert.equal(fields.utm_source.value,'instagram');assert.equal(fields.utm_campaign.value,'product_questions');
landing('?utm_source=linkedin&utm_campaign=provider_questions');
landing('',{elements:fields});assert.equal(fields.utm_source.value,'linkedin');assert.equal(fields.utm_campaign.value,'provider_questions');
const disabled={getItem(){throw Error('disabled');},setItem(){throw Error('disabled');}};
landing('?utm_source=facebook',{elements:fields},disabled);assert.equal(fields.utm_source.value,'facebook');
console.log('Validated attribution across product-to-inquiry navigation and storage-disabled fallback.');
