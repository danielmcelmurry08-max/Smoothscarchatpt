(() => {
 const form = document.querySelector('form[name="customer-quotes"]');
 if (!form) return;
 const review = document.querySelector('#inquiry-review');
 const details = document.querySelector('#inquiry-details');
 const start = document.querySelector('#review-inquiry');
 const edit = document.querySelector('#edit-inquiry');
 if (!review || !details || !start || !edit) return;
 const setText = (selector, value) => { review.querySelector(selector).textContent = value; };
 function openReview() {
  if (!form.reportValidity()) return;
  const fields = form.elements;
  const quantity = fields.quantity.value ? Number(fields.quantity.value) : null;
  const daily = fields.product.value === 'BioRNA Daily (Antiscar)';
  setText('[data-review-product]', fields.product.value || 'Help me choose');
  setText('[data-review-quantity]', quantity ? quantity + (quantity === 1 ? ' box' : ' boxes') : 'Confirm with our team');
  setText('[data-review-contact]', fields.email.value);
  setText('[data-review-shipping]', [fields.country.value, fields.postal_code.value].filter(Boolean).join(' · ') || 'Confirm with our team');
  setText('[data-review-price]', fields.product.value ? daily ? '$300 per box' : '$375 MSRP per box' : 'Daily $300 · BioRNA-C $375 MSRP');
  const promo = fields.promo_code?.value.trim().toUpperCase() || '';
  if (fields.promo_code) fields.promo_code.value = promo;
  let promoMessage = promo || 'None entered';
  if (promo === 'SMOOTH20') {
   promoMessage = fields.product.value === 'BioRNA-C'
    ? 'SMOOTH20 · $300 per box on an eligible first order. Your itemized quote confirms your price.'
    : 'SMOOTH20 applies only to a first BioRNA-C order.';
  }
  setText('[data-review-promo]', promoMessage);
  details.hidden = true;
  review.hidden = false;
  review.querySelector('h3').focus();
 }
 start.addEventListener('click', openReview);
 edit.addEventListener('click', () => {
  details.hidden = false;
  review.hidden = true;
  start.focus();
 });
 // Prevent Enter from bypassing the review step.
 form.addEventListener('submit', event => {
  if (!review.hidden) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openReview();
 }, true);
 start.hidden = false;
 form.querySelector('[data-direct-submit]').hidden = true;
})();
