-- Additive indexes for the per-listing photo/history lookups and the library list.
CREATE INDEX IF NOT EXISTS photos_listing ON photos(listing_id);
CREATE INDEX IF NOT EXISTS listing_events_listing ON listing_events(listing_id, id);
CREATE INDEX IF NOT EXISTS listings_archived_updated ON listings(archived, updated_at DESC);
