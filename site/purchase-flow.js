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
  const product = fields.product.value;
  const size = fields.size && fields.size.value || '8';
  setText('[data-review-product]', product || 'Help me choose');
  setText('[data-review-size]', product ? (size === '24' ? '24 patches per box' : size === '2' ? '2 patches per box' : '8 patches per box') : 'Confirm with our team');
  setText('[data-review-quantity]', quantity ? quantity + (quantity === 1 ? ' box' : ' boxes') : 'Confirm with our team');
  setText('[data-review-contact]', fields.email.value);
  setText('[data-review-shipping]', [fields.country.value, fields.postal_code.value].filter(Boolean).join(' · ') || 'Confirm with our team');
  setText('[data-review-price]', product ? '$' + (size === '24' ? '1,250' : size === '2' ? '135' : '500') + ' per box' : 'AntiScar $500 · BioRNA-C $500');
  const prices = size === '24' ? [1250, 2250, 3000] : size === '2' ? [135] : [500, 900, 1250, 1600];
  const maxQuantity = size === '24' ? 3 : size === '2' ? 1 : 4;
  const total = Number.isInteger(quantity) && quantity >= 1 && quantity <= maxQuantity && product ? prices[quantity - 1] : null;
  setText('[data-review-bundle]', total ? '$' + total.toLocaleString('en-US') + ' before shipping and tax' : 'Confirmed in your itemized quote');
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
