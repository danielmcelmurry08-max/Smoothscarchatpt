(() => {
 const panel = document.querySelector('#submitted-offer');
 if (!panel) return;
 let submitted = 0;
 try { submitted = Number(sessionStorage.getItem('smoothscar-contact-submitted')); } catch {}
 if (!submitted || Date.now() - submitted > 30 * 60 * 1000 || submitted > Date.now()) return;
 const bundles = [
  { boxes: 1, total: 375, perBox: 375, weeks: 4 },
  { boxes: 2, total: 600, perBox: 300, weeks: 8 },
  { boxes: 3, total: 825, perBox: 275, weeks: 12 },
  { boxes: 4, total: 1000, perBox: 250, weeks: 16 }
 ];
 const money = value => '$' + value.toLocaleString('en-US');
 panel.innerHTML = `
  <style>
   #submitted-offer{margin-top:32px}
   #submitted-offer .bundle-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:20px 0}
   #submitted-offer .bundle-option{display:block;min-width:0;padding:16px;border:1px solid #b6c9dc;border-radius:16px;background:#fff;cursor:pointer}
   #submitted-offer .bundle-option:has(:checked){background:#eef5fb;border-color:#193c60;box-shadow:inset 0 0 0 1px #193c60}
   #submitted-offer input{float:right;width:auto;accent-color:#193c60}
   #submitted-offer .bundle-option strong,#submitted-offer .bundle-option small{display:block}
   #submitted-offer .bundle-price{font-size:1.65rem;margin:8px 0}
   #submitted-offer .bundle-option small{font-size:.85rem}
   @media(max-width:400px){#submitted-offer .bundle-options{gap:8px}#submitted-offer .bundle-option{padding:10px}}
  </style>
  <h2>Choose your BioRNA-C box quantity</h2>
  <p>Each box contains 8 patches. At one patch per application, twice a week, one box lasts 4 weeks. Larger scars may need more than one patch per application.</p>
  <fieldset class="bundle-options"><legend>Select your box quantity</legend>
   ${bundles.map(bundle => `<label class="bundle-option"><input type="radio" name="biorna-c-bundle" value="${bundle.boxes}" ${bundle.boxes === 2 ? 'checked' : ''}><strong>${bundle.boxes} ${bundle.boxes === 1 ? 'box' : 'boxes'}</strong><small>${bundle.weeks} weeks at one patch per use</small><strong class="bundle-price">${money(bundle.total)}</strong><small>${money(bundle.perBox)} per box${bundle.boxes === 4 ? ' · Lowest per box' : ''}</small>${bundle.boxes === 1 ? '<small>$300 on an eligible first order with SMOOTH20</small>' : ''}</label>`).join('')}
  </fieldset>
  <a class="btn" data-bundle-request href="mailto:contact@smoothscar.com">Request my selected bundle</a>
  <p class="note">Email our team to add your selected quantity to your inquiry. We reply by the next business day.</p>
  <p class="note">Shipping and tax are confirmed in your quote. No payment is taken on this site. No obligation. Bundle prices and the first-order offer cannot be combined. Eligibility is confirmed in your itemized quote.</p>
  <p class="note">Weeks describe patch supply, based on one patch per application. Follow the supplied product instructions and your care team's advice about how long to continue.</p>`;
 const request = panel.querySelector('[data-bundle-request]');
 function updateRequest() {
  const selected = Number(panel.querySelector('input:checked').value);
  const bundle = bundles.find(item => item.boxes === selected);
  const quantity = bundle.boxes + (bundle.boxes === 1 ? ' box' : ' boxes');
  request.textContent = 'Request my quote for ' + quantity;
  const body = 'Please update my BioRNA-C inquiry to ' + quantity + ' at ' + money(bundle.total) + ' before shipping and tax. Please confirm any first-order eligibility and the final quote.';
  request.href = 'mailto:contact@smoothscar.com?subject=' + encodeURIComponent('BioRNA-C bundle quote — ' + quantity) + '&body=' + encodeURIComponent(body);
 }
 panel.addEventListener('change', updateRequest);
 updateRequest();
 panel.hidden = false;
})();
