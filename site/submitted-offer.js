(() => {
 const panel = document.querySelector('#submitted-offer');
 if (!panel) return;
 let submitted = 0;
 let context = {};
 let saved = null;
 try {
  submitted = Number(sessionStorage.getItem('smoothscar-contact-submitted'));
  context = JSON.parse(sessionStorage.getItem('smoothscar-quote-context') || '{}') || {};
  saved = JSON.parse(sessionStorage.getItem('smoothscar-bundle-confirmed') || 'null');
 } catch {}
 if (!submitted || Date.now() - submitted > 30 * 60 * 1000 || submitted > Date.now()) {
  try { sessionStorage.removeItem('smoothscar-quote-context'); } catch {}
  return;
 }
 const totals = [375, 600, 825, 1000];
 const money = value => '$' + value.toLocaleString('en-US');
 const productNames = { c: 'BioRNA-C', daily: 'BioRNA Daily (Antiscar)' };
 let product = context.product === productNames.daily ? 'daily' : 'c';
 let quantity = Number(context.quantity);
 if (!Number.isInteger(quantity) || quantity < 1 || quantity > 4) quantity = product === 'daily' ? 1 : 2;
 let firstOrder = false;
 let sending = false;
 const originalReference = /^BIO-[A-Z0-9]{8}$/.test(context.reference || '') ? context.reference : 'BIO-' + crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
 const updateReference = originalReference + '-BUNDLE';
 function setProgress(step) {
  document.querySelectorAll('.purchase-progress li').forEach((item, index) => {
   item.classList.toggle('complete', index < step);
   if (index === step) item.setAttribute('aria-current', 'step');
   else item.removeAttribute('aria-current');
  });
 }
 function selection() {
  const total = product === 'daily' ? quantity * 300 : firstOrder && quantity === 1 ? 300 : totals[quantity - 1];
  const regular = quantity * (product === 'daily' ? 300 : 375);
  return { product: productNames[product], quantity, total, savings: regular - total, offer: product === 'c' && quantity === 1 && firstOrder ? 'SMOOTH20' : '' };
 }
 function showSuccess(result) {
  setProgress(3);
  panel.innerHTML = '<section class="bundle-success"><p class="eyebrow">Request updated</p><h2 tabindex="-1">Your selection is with our team.</h2><p data-success-selection></p><p>We reply by the next business day with your itemized quote, including shipping, tax and any eligibility confirmation.</p><p class="note">No order has been placed. No payment has been taken.</p><a class="btn" href="/customer/#patient-protocol">See your step-by-step routine</a><p class="note" data-success-reference></p></section>';
  panel.querySelector('[data-success-selection]').textContent = result.product + ' · ' + result.quantity + (result.quantity === 1 ? ' box' : ' boxes') + ' · ' + money(result.total) + ' product subtotal requested.';
  panel.querySelector('[data-success-reference]').textContent = 'Reference ' + result.reference;
  panel.hidden = false;
 }
 if (saved && (!context.reference || saved.reference === updateReference) && saved.at >= submitted && saved.at <= Date.now() && Object.values(productNames).includes(saved.product) && Number.isInteger(saved.quantity) && saved.quantity >= 1 && saved.quantity <= 4 && Number.isFinite(saved.total)) {
  showSuccess(saved);
  return;
 }
 panel.innerHTML = `
  <div id="bundle-selection">
   <fieldset class="bundle-product-switch"><legend>Choose your patch</legend>
    <label><input type="radio" name="bundle-product" value="daily">Daily (Antiscar)</label>
    <label><input type="radio" name="bundle-product" value="c">BioRNA-C</label>
   </fieldset>
   <h2 id="bundle-heading">Choose your box quantity</h2>
   <p class="quote-review-note" id="bundle-supply"></p>
   <fieldset class="bundle-options"><legend>Select your box quantity</legend></fieldset>
   <label class="first-order-check" id="first-order-option" hidden><input type="checkbox" id="first-order-check"><span>This would be my first BioRNA-C order. Request $300 with SMOOTH20, subject to eligibility confirmation.</span></label>
   <p class="quote-review-note" id="bundle-terms"></p>
   <button class="btn" id="review-bundle" type="button">Review my selection</button>
   <p class="quote-review-note">Shipping and tax are confirmed in your quote. No payment taken. No obligation.</p>
  </div>
  <section class="quote-review order-review" id="bundle-review" hidden aria-label="Review your selection">
   <h2 tabindex="-1">Review your selection</h2>
   <dl><div><dt>Product</dt><dd data-order-product></dd></div><div><dt>Quantity</dt><dd data-order-quantity></dd></div><div><dt>Offer</dt><dd data-order-offer></dd></div><div><dt>Product subtotal</dt><dd class="review-total" data-order-total></dd></div><div><dt>Shipping &amp; tax</dt><dd>Confirmed in your quote</dd></div></dl>
   <div id="bundle-contact"><label>Your name<input autocomplete="name" id="bundle-name" maxlength="100" required></label><label>Email for your quote<input autocomplete="email" type="email" id="bundle-email" maxlength="200" required></label></div>
   <p class="quote-review-note" id="bundle-reply"></p>
   <p class="quote-review-note">Send this selection to update your inquiry. Our team will confirm availability, offer eligibility and the final total before you decide to order.</p>
   <div class="review-actions"><button class="btn" id="send-bundle" type="button">Send my updated request</button><button class="purchase-edit" id="edit-bundle" type="button">Edit selection</button></div>
   <p class="note">We reply by the next business day. No payment is taken on this site.</p>
   <p class="bundle-status" id="bundle-status" role="status" aria-live="polite"></p>
  </section>`;
 const find = selector => panel.querySelector(selector);
 const options = find('.bundle-options');
 const contact = find('#bundle-contact');
 const nameInput = find('#bundle-name');
 const emailInput = find('#bundle-email');
 nameInput.value = typeof context.name === 'string' ? context.name : '';
 emailInput.value = typeof context.email === 'string' ? context.email : '';
 contact.hidden = Boolean(nameInput.value && emailInput.value && emailInput.checkValidity());
 panel.querySelector('input[name="bundle-product"][value="' + product + '"]').checked = true;
 function renderOptions() {
  const isDaily = product === 'daily';
  find('#bundle-heading').textContent = 'Choose your ' + (isDaily ? 'Daily' : 'BioRNA-C') + ' supply';
  find('#bundle-supply').textContent = isDaily ? '7 patches per box. A fresh patch each night, worn for 8 hours.' : '8 patches per box. Twice weekly, worn for 8–12 hours overnight.';
  find('#bundle-terms').textContent = isDaily ? 'Daily is $300 per box. Supply estimates assume one patch per night.' : 'Bundle pricing and SMOOTH20 cannot be combined. First-order eligibility is confirmed by our team.';
  options.innerHTML = '<legend>Select your box quantity</legend>' + [1, 2, 3, 4].map(boxes => {
   const total = isDaily ? boxes * 300 : totals[boxes - 1];
   const savings = boxes * (isDaily ? 300 : 375) - total;
   const supply = isDaily ? boxes * 7 + ' nights' : boxes * 4 + ' weeks';
   const label = !isDaily && boxes === 4 ? 'Lowest price per box' : '';
   return '<label class="bundle-option"><input type="radio" name="bundle-quantity" value="' + boxes + '" ' + (boxes === quantity ? 'checked' : '') + '><strong class="bundle-title">' + boxes + (boxes === 1 ? ' box' : ' boxes') + '</strong><small>' + supply + ' at one patch per use</small><strong class="bundle-price">' + money(total) + '</strong><small>' + money(total / boxes) + ' per box</small><small class="bundle-saving">' + (savings ? 'Save ' + money(savings) + ' vs. individual boxes' : isDaily ? '7 patches per box' : '$300 if eligible for the first-order offer') + '</small><small class="bundle-label">' + label + '</small></label>';
  }).join('');
  find('#first-order-option').hidden = isDaily || quantity !== 1;
 }
 panel.addEventListener('change', event => {
  if (event.target.name === 'bundle-product') {
   product = event.target.value;
   firstOrder = false;
   find('#first-order-check').checked = false;
   renderOptions();
  }
  if (event.target.name === 'bundle-quantity') {
   quantity = Number(event.target.value);
   firstOrder = false;
   find('#first-order-check').checked = false;
   find('#first-order-option').hidden = product === 'daily' || quantity !== 1;
  }
  if (event.target.id === 'first-order-check') firstOrder = event.target.checked;
 });
 find('#review-bundle').addEventListener('click', () => {
  const selected = selection();
  setProgress(2);
  find('[data-order-product]').textContent = selected.product;
  find('[data-order-quantity]').textContent = quantity + (quantity === 1 ? ' box' : ' boxes');
  find('[data-order-offer]').textContent = selected.offer ? 'First order · eligibility to be confirmed' : selected.savings ? 'Bundle savings of ' + money(selected.savings) : 'Current per-box price';
  find('[data-order-total]').textContent = money(selected.total);
  find('#bundle-reply').textContent = contact.hidden ? 'Your quote will be sent to ' + emailInput.value + '.' : 'Enter the same contact details used for your inquiry.';
  find('#bundle-selection').hidden = true;
  find('#bundle-review').hidden = false;
  find('#bundle-review h2').focus();
 });
 find('#edit-bundle').addEventListener('click', () => {
  if (sending) return;
  setProgress(1);
  find('#bundle-selection').hidden = false;
  find('#bundle-review').hidden = true;
  find('#review-bundle').focus();
 });
 find('#send-bundle').addEventListener('click', async () => {
  if (sending || !nameInput.reportValidity() || !emailInput.reportValidity()) return;
  const selected = selection();
  const button = find('#send-bundle');
  const status = find('#bundle-status');
  const data = new URLSearchParams({
   'form-name': 'customer-quotes', inquiry_type: 'customer', provider_workflow: 'customer-quotes',
   subject: 'SmoothScar customer bundle update (%{submissionId})', reference: updateReference,
   name: nameInput.value, email: emailInput.value, product: selected.product, quantity: String(quantity),
   country: typeof context.country === 'string' ? context.country : '', postal_code: typeof context.postal_code === 'string' ? context.postal_code : '',
   offer_code: selected.offer, consent: 'on', website: '',
   comments: 'Bundle selection for inquiry ' + originalReference + '. Requested product subtotal ' + money(selected.total) + '. ' + (selected.offer ? 'Customer requests first-order eligibility review for SMOOTH20.' : 'Bundle prices and first-order discounts do not combine.') + ' Shipping, tax and availability require confirmation.'
  });
  sending = true;
  button.disabled = true;
  find('#edit-bundle').disabled = true;
  button.textContent = 'Sending your selection…';
  status.setAttribute('role', 'status');
  status.textContent = '';
  try {
   const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data });
   if (!response.ok) throw new Error('Please try again or email contact@smoothscar.com. Your selection is still here.');
   const result = { ...selected, reference: updateReference, at: Date.now() };
   try {
    sessionStorage.setItem('smoothscar-bundle-confirmed', JSON.stringify(result));
    sessionStorage.removeItem('smoothscar-quote-context');
   } catch {}
   showSuccess(result);
   panel.querySelector('h2').focus();
  } catch {
   sending = false;
   button.disabled = false;
   find('#edit-bundle').disabled = false;
   button.textContent = 'Send my updated request';
   status.setAttribute('role', 'alert');
   status.textContent = 'We could not send your update. Please try again or email contact@smoothscar.com. Your selection is still here.';
  }
 });
 renderOptions();
 panel.hidden = false;
})();
