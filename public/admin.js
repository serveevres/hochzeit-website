let token = sessionStorage.getItem('admin_token');

// ── Startup ────────────────────────────────────────────────
(function init() {
  if (token) {
    showAdmin();
  }
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('add-gift-form').addEventListener('submit', handleAddGift);
  document.getElementById('edit-gift-form').addEventListener('submit', handleEditGift);
  document.getElementById('edit-modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeEditModal();
  });
})();

// ── Auth ───────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = '…';

  try {
    const res = await api('/api/admin/login', 'POST', { password });
    if (res.ok) {
      const data = await res.json();
      token = data.token;
      sessionStorage.setItem('admin_token', token);
      showAdmin();
    } else {
      const data = await res.json().catch(() => ({}));
      showLoginAlert(data.error || 'Falsches Passwort');
      btn.disabled = false;
      btn.textContent = 'Anmelden';
    }
  } catch {
    showLoginAlert('Keine Verbindung zum Server.');
    btn.disabled = false;
    btn.textContent = 'Anmelden';
  }
}

function logout() {
  sessionStorage.removeItem('admin_token');
  token = null;
  document.getElementById('admin-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'block';
}

function showAdmin() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-screen').style.display = 'block';
  loadGifts();
  loadRsvps();
}

// ── Tabs ───────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', ['gifts', 'rsvps'][i] === name);
  });
  document.getElementById('tab-gifts').classList.toggle('active', name === 'gifts');
  document.getElementById('tab-rsvps').classList.toggle('active', name === 'rsvps');
}

// ── Gifts ──────────────────────────────────────────────────
async function loadGifts() {
  const res = await authApi('/api/admin/gifts');
  if (!res) return;
  const gifts = await res.json();
  renderGiftsTable(gifts);
}

function renderGiftsTable(gifts) {
  const tbody = document.getElementById('gifts-tbody');
  if (gifts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem">Noch keine Geschenke.</td></tr>';
    return;
  }
  tbody.innerHTML = gifts.map(g => `
    <tr id="gift-row-${g.id}">
      <td>
        ${g.image_url
          ? `<img src="${esc(g.image_url)}" class="gift-table-image" onerror="this.style.display='none'">`
          : '<span style="color:var(--text-muted)">&#8212;</span>'}
      </td>
      <td>
        <strong>${esc(g.name)}</strong>
        ${g.description ? `<br><small style="color:var(--text-muted)">${esc(g.description)}</small>` : ''}
      </td>
      <td>${g.price_range ? esc(g.price_range) : '&#8212;'}</td>
      <td>
        ${g.claimed
          ? '<span class="badge badge-claimed">Vergeben</span>'
          : '<span class="badge badge-free">Frei</span>'}
      </td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal(${g.id})">Bearbeiten</button>
        ${g.claimed
          ? `<button class="btn btn-secondary btn-sm" onclick="unclaimGift(${g.id})">Freigeben</button>`
          : ''}
        <button class="btn btn-danger btn-sm" onclick="deleteGift(${g.id})">Löschen</button>
      </td>
    </tr>
  `).join('');
}

async function handleAddGift(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;

  const body = {
    name: document.getElementById('g-name').value.trim(),
    description: document.getElementById('g-desc').value.trim(),
    price_range: document.getElementById('g-price').value.trim(),
    image_url: document.getElementById('g-image').value.trim(),
    shop_url: document.getElementById('g-shop').value.trim(),
  };

  const res = await authApi('/api/admin/gifts', 'POST', body);
  if (res && res.ok) {
    e.target.reset();
    showAdminAlert('Geschenk wurde hinzugefügt!', 'success');
    loadGifts();
  } else {
    const data = res ? await res.json().catch(() => ({})) : {};
    showAdminAlert(data.error || 'Fehler beim Hinzufügen.', 'error');
  }
  btn.disabled = false;
}

// Edit modal
let editGifts = {};

async function openEditModal(id) {
  const res = await authApi('/api/admin/gifts');
  if (!res) return;
  const gifts = await res.json();
  const g = gifts.find(x => x.id === id);
  if (!g) return;
  editGifts[id] = g;

  document.getElementById('e-id').value = id;
  document.getElementById('e-name').value = g.name || '';
  document.getElementById('e-price').value = g.price_range || '';
  document.getElementById('e-desc').value = g.description || '';
  document.getElementById('e-image').value = g.image_url || '';
  document.getElementById('e-shop').value = g.shop_url || '';
  document.getElementById('edit-modal-overlay').classList.add('open');
}

function closeEditModal() {
  document.getElementById('edit-modal-overlay').classList.remove('open');
}

async function handleEditGift(e) {
  e.preventDefault();
  const id = document.getElementById('e-id').value;
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;

  const body = {
    name: document.getElementById('e-name').value.trim(),
    description: document.getElementById('e-desc').value.trim(),
    price_range: document.getElementById('e-price').value.trim(),
    image_url: document.getElementById('e-image').value.trim(),
    shop_url: document.getElementById('e-shop').value.trim(),
  };

  const res = await authApi(`/api/admin/gifts/${id}`, 'PUT', body);
  if (res && res.ok) {
    closeEditModal();
    showAdminAlert('Geschenk aktualisiert!', 'success');
    loadGifts();
  } else {
    const data = res ? await res.json().catch(() => ({})) : {};
    showAdminAlert(data.error || 'Fehler beim Speichern.', 'error');
  }
  btn.disabled = false;
}

async function deleteGift(id) {
  if (!confirm('Dieses Geschenk wirklich löschen?')) return;
  const res = await authApi(`/api/admin/gifts/${id}`, 'DELETE');
  if (res && res.ok) {
    showAdminAlert('Geschenk gelöscht.', 'success');
    loadGifts();
  }
}

async function unclaimGift(id) {
  if (!confirm('Dieses Geschenk wieder als verfügbar markieren?')) return;
  const res = await authApi(`/api/admin/gifts/${id}/unclaim`, 'POST');
  if (res && res.ok) {
    showAdminAlert('Geschenk freigegeben.', 'success');
    loadGifts();
  }
}

// ── RSVPs ──────────────────────────────────────────────────
let allRsvps = [];

async function loadRsvps() {
  const res = await authApi('/api/admin/rsvps');
  if (!res) return;
  allRsvps = await res.json();
  renderRsvpsTable(allRsvps);
  updateRsvpSummary(allRsvps);
}

function renderRsvpsTable(rsvps) {
  const tbody = document.getElementById('rsvps-tbody');
  if (rsvps.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem">Noch keine Zusagen.</td></tr>';
    return;
  }
  tbody.innerHTML = rsvps.map(r => `
    <tr>
      <td><strong>${esc(r.name)}</strong></td>
      <td><span class="badge ${r.attending ? 'badge-yes' : 'badge-no'}">${r.attending ? 'Ja' : 'Nein'}</span></td>
      <td>${r.food_restrictions ? esc(r.food_restrictions) : '<span style="color:var(--text-muted)">&#8212;</span>'}</td>
      <td style="max-width:220px;word-break:break-word">${r.message ? esc(r.message) : '<span style="color:var(--text-muted)">&#8212;</span>'}</td>
      <td style="white-space:nowrap;color:var(--text-muted)">${formatDate(r.created_at)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRsvp(${r.id})">x</button></td>
    </tr>
  `).join('');
}

function updateRsvpSummary(rsvps) {
  const yes = rsvps.filter(r => r.attending).length;
  const no = rsvps.filter(r => !r.attending).length;
  document.getElementById('rsvp-stats').textContent =
    `${rsvps.length} Antworten \u00b7 ${yes} zusagen \u00b7 ${no} absagen`;
  document.getElementById('rsvp-summary').textContent =
    `${rsvps.length} Zusagen (${yes} kommen)`;
}

async function deleteRsvp(id) {
  if (!confirm('Diesen Eintrag löschen?')) return;
  const res = await authApi(`/api/admin/rsvps/${id}`, 'DELETE');
  if (res && res.ok) loadRsvps();
}

function exportRsvpsCsv() {
  const rows = [['Name', 'Kommt', 'Essen/Allergien', 'Nachricht', 'Datum']];
  allRsvps.forEach(r => rows.push([
    r.name,
    r.attending ? 'Ja' : 'Nein',
    r.food_restrictions || '',
    r.message || '',
    r.created_at,
  ]));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zusagen.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ────────────────────────────────────────────────
async function api(url, method = 'GET', body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  return fetch(url, opts);
}

async function authApi(url, method = 'GET', body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(url, opts);
    if (res.status === 401) {
      logout();
      return null;
    }
    return res;
  } catch {
    showAdminAlert('Verbindungsfehler.', 'error');
    return null;
  }
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.endsWith('Z') ? iso : iso + 'Z');
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function showLoginAlert(msg) {
  document.getElementById('login-alert').innerHTML =
    `<div class="alert alert-error" style="margin-bottom:1rem">${esc(msg)}</div>`;
}

function showAdminAlert(msg, type) {
  const area = document.getElementById('admin-alert');
  area.innerHTML = `<div class="alert alert-${type}">${esc(msg)}</div>`;
  setTimeout(() => { area.innerHTML = ''; }, 4000);
}
