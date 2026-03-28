const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'gifts.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price_range TEXT,
    image_url TEXT,
    shop_url TEXT,
    claimed INTEGER NOT NULL DEFAULT 0,
    unclaimable INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    attending INTEGER NOT NULL,
    guest_count INTEGER NOT NULL DEFAULT 1,
    children_under3 INTEGER NOT NULL DEFAULT 0,
    vegetarian INTEGER NOT NULL DEFAULT 0,
    friday_evening INTEGER NOT NULL DEFAULT 0,
    food_restrictions TEXT,
    message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Migration: add new columns to existing databases
[
  'guest_count INTEGER NOT NULL DEFAULT 1',
  'children_under3 INTEGER NOT NULL DEFAULT 0',
  'vegetarian INTEGER NOT NULL DEFAULT 0',
  'friday_evening INTEGER NOT NULL DEFAULT 0',
].forEach(col => {
  try { db.exec(`ALTER TABLE rsvps ADD COLUMN ${col}`); } catch {}
});
try { db.exec('ALTER TABLE gifts ADD COLUMN unclaimable INTEGER NOT NULL DEFAULT 0'); } catch {}

module.exports = {
  getAllGifts() {
    return db.prepare('SELECT * FROM gifts ORDER BY created_at ASC').all();
  },

  getGiftById(id) {
    return db.prepare('SELECT * FROM gifts WHERE id = ?').get(id);
  },

  addGift({ name, description, price_range, image_url, shop_url, unclaimable }) {
    const stmt = db.prepare(
      'INSERT INTO gifts (name, description, price_range, image_url, shop_url, unclaimable) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, description || null, price_range || null, image_url || null, shop_url || null, unclaimable ? 1 : 0);
    return db.prepare('SELECT * FROM gifts WHERE id = ?').get(result.lastInsertRowid);
  },

  updateGift(id, { name, description, price_range, image_url, shop_url, unclaimable }) {
    db.prepare(
      'UPDATE gifts SET name = ?, description = ?, price_range = ?, image_url = ?, shop_url = ?, unclaimable = ? WHERE id = ?'
    ).run(name, description || null, price_range || null, image_url || null, shop_url || null, unclaimable ? 1 : 0, id);
    return db.prepare('SELECT * FROM gifts WHERE id = ?').get(id);
  },

  deleteGift(id) {
    db.prepare('DELETE FROM gifts WHERE id = ?').run(id);
  },

  claimGift(id) {
    db.prepare('UPDATE gifts SET claimed = 1 WHERE id = ? AND claimed = 0').run(id);
    return db.prepare('SELECT * FROM gifts WHERE id = ?').get(id);
  },

  unclaimGift(id) {
    db.prepare('UPDATE gifts SET claimed = 0 WHERE id = ?').run(id);
    return db.prepare('SELECT * FROM gifts WHERE id = ?').get(id);
  },

  addRsvp({ name, attending, guest_count, children_under3, vegetarian, friday_evening, food_restrictions, message }) {
    const stmt = db.prepare(
      'INSERT INTO rsvps (name, attending, guest_count, children_under3, vegetarian, friday_evening, food_restrictions, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      name,
      attending ? 1 : 0,
      guest_count || 1,
      children_under3 || 0,
      vegetarian ? 1 : 0,
      friday_evening ? 1 : 0,
      food_restrictions || null,
      message || null,
    );
    return db.prepare('SELECT * FROM rsvps WHERE id = ?').get(result.lastInsertRowid);
  },

  getAllRsvps() {
    return db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all();
  },

  deleteRsvp(id) {
    db.prepare('DELETE FROM rsvps WHERE id = ?').run(id);
  },
};
