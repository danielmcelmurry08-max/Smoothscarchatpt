(() => {
 const form = document.querySelector('form[name="customer-quotes"]');
 if (!form) return;
 const review = document.querySelector('#inquiry-review');
 const details = document.querySelector('#inquiry-details');
 const start = document.querySelector('#review-inquiry');
 const edit = document.querySelector('#edit-inquiry');
 if (!review || !details || !start || !edit) return;
 const amount = value => '$' + value.toLocaleString('en-US');
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
  setText('[data-review-subtotal]', quantity && fields.product.value ? amount(quantity * (daily ? 300 : 375)) : 'Confirmed in your quote');
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
