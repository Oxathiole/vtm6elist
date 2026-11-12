const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-please';
const INVITE_CODE = process.env.INVITE_CODE || 'VTM6E-INVITE';

// Бэкенд запускается из /opt/vtm6e/server — база рядом с кодом
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'data.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT,
    data TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_characters_user ON characters(user_id);
`);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const p = jwt.verify(token, JWT_SECRET);
    req.userId = p.userId;
    req.username = p.username;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/register', (req, res) => {
  const { username, password, inviteCode } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  if (String(inviteCode) !== INVITE_CODE) return res.status(403).json({ error: 'Invalid invite code' });
  if (username.length < 3 || username.length > 32) return res.status(400).json({ error: 'Username 3-32 chars' });
  if (password.length < 6) return res.status(400).json({ error: 'Password ≥ 6 chars' });
  try {
    const hash = bcrypt.hashSync(password, 10);
    const info = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
    const token = jwt.sign({ userId: info.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, username });
  } catch (e) {
    if (String(e).includes('UNIQUE')) return res.status(409).json({ error: 'User already exists' });
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, username: user.username });
});

app.post('/api/verify-code', (req, res) => {
  const { code } = req.body || {};
  res.json({ valid: String(code) === INVITE_CODE });
});

app.get('/api/characters', auth, (req, res) => {
  const rows = db.prepare('SELECT id, data FROM characters WHERE user_id = ? ORDER BY updated_at DESC').all(req.userId);
  const chars = rows.map(r => ({ ...JSON.parse(r.data), id: r.id }));
  res.json(chars);
});

app.post('/api/characters', auth, (req, res) => {
  const chars = req.body;
  if (!Array.isArray(chars)) return res.status(400).json({ error: 'Expected array' });

  const upsert = db.prepare(`
    INSERT INTO characters (id, user_id, name, data, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      data = excluded.data,
      updated_at = datetime('now')
    WHERE characters.user_id = excluded.user_id
  `);

  const tx = db.transaction((list) => {
    for (const c of list) {
      if (!c || !c.id || !c.meta) continue;
      upsert.run(c.id, req.userId, c.meta.name || 'Unnamed', JSON.stringify(c));
    }
  });
  tx(chars);
  res.json({ ok: true, count: chars.length });
});

app.delete('/api/characters/:id', auth, (req, res) => {
  db.prepare('DELETE FROM characters WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => console.log(`VTM6E API on http://127.0.0.1:${PORT}`));
