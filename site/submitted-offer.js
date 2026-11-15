(() => {
 const panel=document.querySelector('#submitted-offer');if(!panel)return;
 let submitted=0;try{submitted=Number(sessionStorage.getItem('smoothscar-contact-submitted'));}catch{}
 if(!submitted||Date.now()-submitted>30*60*1000||submitted>Date.now())return;
 panel.innerHTML='<h2>Your first-order offer</h2><p>Eligible first-time consumer orders of BioRNA-C: <strong>$300 per box with SMOOTH20</strong> — 20% off the regular $375 price.</p><p>Cannot be combined with other discounts. We confirm eligibility, shipping and tax in your itemized quote. No order has been placed and no payment has been taken.</p>';
 panel.hidden=false;
})();
