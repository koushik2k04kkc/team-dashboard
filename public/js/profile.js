const profileContainer = document.getElementById('profile');

function getUserIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchUserById(id) {
  const response = await fetch(`/api/users/${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error(response.status === 404 ? 'User not found.' : 'Unable to load the user profile.');
  }
  return response.json();
}

function renderLoading() {
  if (!profileContainer) return;
  profileContainer.innerHTML = '<div class="loading">Loading...</div>';
}

function renderError(message) {
  if (!profileContainer) return;
  profileContainer.innerHTML = `
    <div class="message error">
      <h2>Oops!</h2>
      <p>${message}</p>
    </div>
  `;
}

function renderUserProfile(user) {
  if (!profileContainer) return;
  const initial = user.name ? user.name.trim().charAt(0).toUpperCase() : '?';
  profileContainer.innerHTML = `
    <section class="profile-card">
      <div class="avatar">${escapeHtml(initial)}</div>
      <div class="profile-details">
        <h1>${escapeHtml(user.name)}</h1>
        <p class="role">${escapeHtml(user.role)}</p>
      </div>
      <div class="info-row">
        <span>Email</span>
        <a href="mailto:${encodeURIComponent(user.email)}">${escapeHtml(user.email)}</a>
      </div>
      <div class="bio">
        <h2>About</h2>
        <p>${escapeHtml(user.bio || 'No bio available.')}</p>
      </div>
    </section>
  `;
}

function escapeHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function initProfilePage() {
  if (!profileContainer) return;

  const id = getUserIdFromQuery();
  if (!id) {
    renderError('No user ID was provided in the URL. Please open this page from a profile link with an id query parameter.');
    return;
  }

  renderLoading();

  try {
    const user = await fetchUserById(id);
    renderUserProfile(user);
  } catch (error) {
    renderError(error.message);
  }
}

document.addEventListener('DOMContentLoaded', initProfilePage);
