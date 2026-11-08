const invite = document.querySelector('#webinar-invite');
function showInvitation() {
  if (location.hash || document.activeElement !== document.body) return;
  try {
    if (sessionStorage.getItem('webinar-invited') || sessionStorage.getItem('biorna-receipt')) return;
    sessionStorage.setItem('webinar-invited', '1');
  } catch {}
  invite.showModal();
}
document.querySelector('#join-webinar').addEventListener('click', () => {
  invite.close();
  location.hash = 'apply';
  document.querySelector('#provider [name="name"]').focus();
});
setTimeout(showInvitation, 2500);
