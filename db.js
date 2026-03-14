const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'gifts.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price_range TEXT,
    image_url TEXT,
    shop_url TEXT,
    claimed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    attending INTEGER NOT NULL,
    food_restrictions TEXT,
    message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = {
  getAllGifts() {
    return db.prepare('SELECT * FROM gifts ORDER BY created_at ASC').all();
  },

  getGiftById(id) {
    return db.prepare('SELECT * FROM gifts WHERE id = ?').get(id);
  },

  addGift({ name, description, price_range, image_url, shop_url }) {
    const stmt = db.prepare(
      'INSERT INTO gifts (name, description, price_range, image_url, shop_url) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, description || null, price_range || null, image_url || null, shop_url || null);
    return db.prepare('SELECT * FROM gifts WHERE id = ?').get(result.lastInsertRowid);
  },

  updateGift(id, { name, description, price_range, image_url, shop_url }) {
    db.prepare(
      'UPDATE gifts SET name = ?, description = ?, price_range = ?, image_url = ?, shop_url = ? WHERE id = ?'
    ).run(name, description || null, price_range || null, image_url || null, shop_url || null, id);
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

  addRsvp({ name, attending, food_restrictions, message }) {
    const stmt = db.prepare(
      'INSERT INTO rsvps (name, attending, food_restrictions, message) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, attending ? 1 : 0, food_restrictions || null, message || null);
    return db.prepare('SELECT * FROM rsvps WHERE id = ?').get(result.lastInsertRowid);
  },

  getAllRsvps() {
    return db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all();
  },

  deleteRsvp(id) {
    db.prepare('DELETE FROM rsvps WHERE id = ?').run(id);
  },
};
