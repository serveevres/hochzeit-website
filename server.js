require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

app.use(express.json());

// Page routes must come before static middleware so / serves rsvp.html, not index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'rsvp.html')));
app.get('/wunschliste', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/impressum', (req, res) => res.sendFile(path.join(__dirname, 'public', 'impressum.html')));
app.get('/informationen', (req, res) => res.sendFile(path.join(__dirname, 'public', 'informationen.html')));
app.get('/kontakt', (req, res) => res.sendFile(path.join(__dirname, 'public', 'kontakt.html')));

app.use(express.static(path.join(__dirname, 'public')));

// ─── Auth middleware ───────────────────────────────────────────────────────────

function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
}

// ─── Public routes ─────────────────────────────────────────────────────────────

app.get('/api/gifts', (req, res) => {
  res.json(db.getAllGifts());
});

app.post('/api/gifts/:id/claim', (req, res) => {
  const gift = db.getGiftById(req.params.id);
  if (!gift) return res.status(404).json({ error: 'Geschenk nicht gefunden' });
  if (gift.unclaimable) return res.status(409).json({ error: 'Dieses Geschenk kann nicht reserviert werden' });
  if (gift.claimed) return res.status(409).json({ error: 'Bereits vergeben' });
  res.json(db.claimGift(req.params.id));
});

// Public undo – guests can unclaim a gift they reserved in the same session
app.post('/api/gifts/:id/unclaim-guest', (req, res) => {
  const gift = db.getGiftById(req.params.id);
  if (!gift) return res.status(404).json({ error: 'Geschenk nicht gefunden' });
  res.json(db.unclaimGift(req.params.id));
});

app.post('/api/rsvp', (req, res) => {
  const { name, attending, guest_count, children_under3, vegetarian, friday_evening, food_restrictions, message } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name ist erforderlich' });
  }
  if (typeof attending !== 'boolean') {
    return res.status(400).json({ error: 'Zusage ist erforderlich' });
  }
  const rsvp = db.addRsvp({
    name: name.trim(),
    attending,
    guest_count: attending ? (parseInt(guest_count) || 1) : 0,
    children_under3: attending ? (parseInt(children_under3) || 0) : 0,
    vegetarian: attending ? Boolean(vegetarian) : false,
    friday_evening: attending ? Boolean(friday_evening) : false,
    food_restrictions: food_restrictions?.trim() || null,
    message: message?.trim() || null,
  });
  res.status(201).json(rsvp);
});

// ─── Admin auth ────────────────────────────────────────────────────────────────

app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Passwort erforderlich' });

  let valid = false;
  if (ADMIN_PASSWORD_HASH) {
    valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } else {
    // Fallback for first-time setup: accept 'admin' and warn
    valid = password === 'admin';
    if (valid) console.warn('⚠️  Using default password "admin". Set ADMIN_PASSWORD_HASH in .env!');
  }

  if (!valid) return res.status(401).json({ error: 'Falsches Passwort' });

  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// ─── Admin gift routes ─────────────────────────────────────────────────────────

app.get('/api/admin/gifts', requireAdmin, (req, res) => {
  res.json(db.getAllGifts());
});

app.post('/api/admin/gifts', requireAdmin, (req, res) => {
  const { name, description, price_range, image_url, shop_url, unclaimable } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name ist erforderlich' });
  }
  const gift = db.addGift({ name: name.trim(), description, price_range, image_url, shop_url, unclaimable });
  res.status(201).json(gift);
});

app.put('/api/admin/gifts/:id', requireAdmin, (req, res) => {
  const gift = db.getGiftById(req.params.id);
  if (!gift) return res.status(404).json({ error: 'Geschenk nicht gefunden' });
  const { name, description, price_range, image_url, shop_url, unclaimable } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name ist erforderlich' });
  }
  res.json(db.updateGift(req.params.id, { name: name.trim(), description, price_range, image_url, shop_url, unclaimable }));
});

app.delete('/api/admin/gifts/:id', requireAdmin, (req, res) => {
  const gift = db.getGiftById(req.params.id);
  if (!gift) return res.status(404).json({ error: 'Geschenk nicht gefunden' });
  db.deleteGift(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/gifts/:id/unclaim', requireAdmin, (req, res) => {
  const gift = db.getGiftById(req.params.id);
  if (!gift) return res.status(404).json({ error: 'Geschenk nicht gefunden' });
  res.json(db.unclaimGift(req.params.id));
});

// ─── Admin RSVP routes ─────────────────────────────────────────────────────────

app.get('/api/admin/rsvps', requireAdmin, (req, res) => {
  res.json(db.getAllRsvps());
});

app.delete('/api/admin/rsvps/:id', requireAdmin, (req, res) => {
  db.deleteRsvp(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅  Server läuft auf http://localhost:${PORT}`);
  if (!ADMIN_PASSWORD_HASH) {
    console.warn('⚠️  ADMIN_PASSWORD_HASH nicht gesetzt – Standard-Passwort "admin" aktiv.');
    console.warn('   Führe node hash-password.js <dein-passwort> aus und setze den Hash in .env');
  }
});
