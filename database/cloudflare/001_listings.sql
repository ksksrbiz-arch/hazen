CREATE TABLE IF NOT EXISTS listings (
 id TEXT PRIMARY KEY,
 revision INTEGER NOT NULL DEFAULT 1,
 draft_json TEXT NOT NULL,
 published_json TEXT,
 archived INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL,
 updated_by TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS published_slug ON listings(json_extract(published_json,'$.slug')) WHERE published_json IS NOT NULL;
CREATE TABLE IF NOT EXISTS photos (
 key TEXT PRIMARY KEY,
 listing_id TEXT NOT NULL REFERENCES listings(id),
 content_type TEXT NOT NULL,
 bytes INTEGER NOT NULL,
 uploaded_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS listing_events (
 id INTEGER PRIMARY KEY,
 listing_id TEXT NOT NULL,
 action TEXT NOT NULL,
 revision INTEGER NOT NULL,
 actor TEXT NOT NULL,
 happened_at TEXT NOT NULL
);
