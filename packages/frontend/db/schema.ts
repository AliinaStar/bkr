import * as SQLite from 'expo-sqlite';

export async function migrateDb(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS goals (
      id          TEXT PRIMARY KEY,
      remote_id   INTEGER,
      title       TEXT NOT NULL,
      description TEXT,
      deadline    TEXT,
      created_at  TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'active'
                  CHECK(status IN ('active', 'postpone', 'finished')),
      synced      INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS entries (
      id                  TEXT PRIMARY KEY,
      remote_id           INTEGER,
      goal_id             TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
      date_note           TEXT NOT NULL,
      note                TEXT NOT NULL,
      productivity_score  INTEGER NOT NULL
                          CHECK(productivity_score BETWEEN 1 AND 5),
      created_at          TEXT NOT NULL,
      synced              INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reports_cache (
      id               TEXT PRIMARY KEY,
      period_type      TEXT NOT NULL CHECK(period_type IN ('week', 'month', 'year')),
      period_key       TEXT NOT NULL,
      period_start     TEXT NOT NULL,
      period_end       TEXT NOT NULL,
      avg_productivity REAL,
      active_days      INTEGER NOT NULL DEFAULT 0,
      data             TEXT NOT NULL,
      cached_at        TEXT NOT NULL,
      UNIQUE(period_type, period_key)
    );

    CREATE TABLE IF NOT EXISTS sync_meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}
