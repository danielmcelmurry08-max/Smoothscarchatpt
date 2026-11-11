const webinarForm = document.querySelector('#webinar-form');
webinarForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!webinarForm.reportValidity()) return;
  const button = webinarForm.querySelector('button');
  const label = button.textContent;
  button.disabled = true; button.textContent = 'Joining the list…';
  const error = document.querySelector('#webinar-error'); error.textContent = '';
  try {
    const response = await fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams(new FormData(webinarForm))});
    if (!response.ok) throw new Error('Please try again or email helixbiodyne@rayesolutions.com.');
    window.dispatchEvent(new CustomEvent('smoothscar:analytics', {detail:{event:'webinar_signup'}}));
    location.assign('/webinar-thank-you');
  } catch (err) {error.textContent = err.message || 'Please try again.';button.disabled=false;button.textContent=label;}
});
