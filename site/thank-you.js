(()=>{
  const $=s=>document.querySelector(s);
  const params=new URLSearchParams(location.search);
  let receipt=null;
  try{receipt=JSON.parse(sessionStorage.getItem('biorna-receipt')||'null');}catch{}
  const ref=(receipt&&receipt.reference)||params.get('ref')||'';
  const test=params.get('test')==='1'||!!(receipt&&receipt.test);
  if(/^BIO-[A-Z0-9]{1,16}$/.test(ref)){const el=$('#ref');el.textContent=(test?'Test request · ':'')+'Your reference number: '+ref;el.classList.remove('hidden');}
  if(receipt&&receipt.name){const first=String(receipt.name).trim().split(/\s+/)[0].slice(0,40);if(first)$('#title').textContent='Thank you, '+first+'!';}
  if (receipt && !test && receipt.reference === params.get('ref')) {
    const offer = document.createElement('p');
    offer.textContent = 'Consumer first-order option: quote SMOOTH20 for 20% off the regular $375 price ($300 per box). Cannot be combined with specials or bundles. Our team confirms eligibility and payment before ordering.';
    document.querySelector('#ref').after(offer);
  }
  // Prefill the Calendly booking form with the details the prospect already entered.
  const cal=new URL('https://calendly.com/daniel-mcelmurry08/30min');
  cal.searchParams.set('hide_gdpr_banner','1');
  cal.searchParams.set('embed_type','Inline');
  cal.searchParams.set('embed_domain',location.hostname);
  if(receipt){if(receipt.name)cal.searchParams.set('name',String(receipt.name).slice(0,100));if(receipt.email)cal.searchParams.set('email',String(receipt.email).slice(0,200));if(ref)cal.searchParams.set('utm_content',ref);}
  $('#calendly').src=cal.toString();
  if(test)$('#again').classList.remove('hidden');
  if(receipt){
    const btn=$('#download');btn.classList.remove('hidden');
    btn.addEventListener('click',()=>{
      const lines=['SmoothScar inquiry','Reference: '+receipt.reference,'Submitted: '+new Date(receipt.submittedAt).toLocaleString(),'Name: '+receipt.name,'Email: '+receipt.email,'Practice: '+receipt.practice,'Product interest: '+receipt.product,'Event date: TBD','Consumer first-order option: 20% off $375 regular price ($300 per box); no stacking. '+(test?'Test registration.':'Quote SMOOTH20 when ordering with our team.')+''];
      if(receipt.test)lines.push('Type: Test request');
      lines.push('','Book a call: https://calendly.com/daniel-mcelmurry08/30min','Questions? Contact helixbiodyne@rayesolutions.com');
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain'}));a.download='BioRNA-request-'+receipt.reference+'.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    });
  }
})();
