/**
 * Team Dashboard — dashboard.html logic
 * 1. Fetches the team roster from /api/users
 * 2. Renders each user as a badge-style card
 * 3. Wires up a live name search/filter box
 */

(function () {
  const listEl = document.getElementById("user-list");
  const countEl = document.getElementById("user-count");
  const searchInput = document.getElementById("search-input");
  const emptyState = document.getElementById("empty-state");
  const emptyQuery = document.getElementById("empty-query");

  let allUsers = []; // full roster, kept in memory so search never re-fetches

  init();

  async function init() {
    renderSkeletons(6);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json();

      allUsers = Array.isArray(data) ? data : data.users || [];
      renderUsers(allUsers);
    } catch (err) {
      renderError(err);
    }

    searchInput.addEventListener("input", handleSearch);
  }

  function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      emptyState.hidden = true;
      renderUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter((user) =>
      (user.name || "").toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      listEl.innerHTML = "";
      emptyQuery.textContent = e.target.value.trim();
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      renderUsers(filtered);
    }
  }

  function renderUsers(users) {
    countEl.textContent = users.length;
    listEl.innerHTML = users.map(userCardTemplate).join("");
  }

  function userCardTemplate(user) {
    const id = user.id;
    const name = escapeHtml(user.name || "Unknown");
    const role = escapeHtml(user.role || "Team Member");
    const initials = getInitials(user.name);

    return `
      <article class="user-card">
        <div class="user-card-hole" aria-hidden="true"></div>
        <div class="user-card-top">
          <span class="user-avatar">${initials}</span>
          <div>
            <div class="user-name">${name}</div>
            <span class="user-role">${role}</span>
          </div>
        </div>
        <div class="user-card-footer">
          <span class="user-id">ID · ${escapeHtml(String(id))}</span>
          <a class="user-profile-link" href="/profile.html?id=${encodeURIComponent(id)}">
            View Profile →
          </a>
        </div>
      </article>
    `;
  }

  function renderSkeletons(count) {
    countEl.textContent = "–";
    listEl.innerHTML = Array.from({ length: count })
      .map(() => `<div class="skeleton-card"></div>`)
      .join("");
  }

  function renderError(err) {
    console.error("Failed to load users:", err);
    countEl.textContent = "0";
    listEl.innerHTML = `
      <p class="state-msg error">
        Couldn't load the team roster. Check that /api/users is running, then refresh.
      </p>
    `;
  }

  function getInitials(name) {
    if (!name) return "?";
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();