// One-off: create the SQLite schema and seed it from the Postgres JSON export.
// Idempotent — safe to re-run (INSERT OR REPLACE by id).
//
//   node scripts/migrate-to-sqlite.mjs
//
// Env: DATABASE_URL (file:… libsql url), SEED_DIR (dir holding seed_*.json).
import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "node:fs";

const url = process.env.DATABASE_URL || "file:./data/portfolio.db";
const SEED_DIR = process.env.SEED_DIR || "/home/ubuntu/data";
const db = createClient({ url });

const DDL = [
  `CREATE TABLE IF NOT EXISTS projects (
     id integer PRIMARY KEY AUTOINCREMENT,
     title text NOT NULL, description text NOT NULL, category text NOT NULL,
     content text, image_url text,
     images text DEFAULT '[]', link text, github text, tags text DEFAULT '[]',
     is_featured integer DEFAULT 0, status text DEFAULT 'live',
     metadata text DEFAULT '{}',
     created_at integer DEFAULT (unixepoch()), updated_at integer DEFAULT (unixepoch()))`,
  `CREATE TABLE IF NOT EXISTS profile (
     id integer PRIMARY KEY AUTOINCREMENT,
     name text NOT NULL, role text NOT NULL, bio text NOT NULL,
     avatar_url text, hero_headline text, hero_subheadline text, contact_email text,
     socials text DEFAULT '{"github":"","linkedin":"","twitter":"","whatsapp":""}',
     location text DEFAULT 'Bali, Indonesia', resume_url text,
     updated_at integer DEFAULT (unixepoch()))`,
  `CREATE TABLE IF NOT EXISTS settings (
     id integer PRIMARY KEY AUTOINCREMENT,
     key text NOT NULL UNIQUE, value text NOT NULL,
     "group" text DEFAULT 'general', description text,
     updated_at integer DEFAULT (unixepoch()))`,
];

const JSON_COLS = new Set(["images", "tags", "metadata", "socials"]);
const TS_COLS = new Set(["created_at", "updated_at"]);
const BOOL_COLS = new Set(["is_featured"]);

const toSec = (v) => {
  if (v == null) return null;
  const s = String(v);
  return Math.floor(new Date(s.endsWith("Z") ? s : s + "Z").getTime() / 1000);
};
const coerce = (col, val) => {
  if (val == null) return null;
  if (JSON_COLS.has(col)) return typeof val === "string" ? val : JSON.stringify(val);
  if (TS_COLS.has(col)) return toSec(val);
  if (BOOL_COLS.has(col)) return val ? 1 : 0;
  return val;
};

async function seed(table, rows) {
  if (!rows.length) { console.log(`  ${table}: 0 rows (skip)`); return; }
  for (const row of rows) {
    const cols = Object.keys(row);
    const quoted = cols.map((c) => (c === "group" ? '"group"' : c));
    const placeholders = cols.map(() => "?").join(", ");
    const args = cols.map((c) => coerce(c, row[c]));
    await db.execute({
      sql: `INSERT OR REPLACE INTO ${table} (${quoted.join(", ")}) VALUES (${placeholders})`,
      args,
    });
  }
  console.log(`  ${table}: ${rows.length} rows seeded`);
}

async function main() {
  console.log(`libsql url: ${url}`);
  for (const stmt of DDL) await db.execute(stmt);
  console.log("tables created");
  for (const table of ["projects", "profile", "settings"]) {
    const f = `${SEED_DIR}/seed_${table}.json`;
    const rows = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : [];
    await seed(table, rows);
  }
  const counts = {};
  for (const t of ["projects", "profile", "settings"]) {
    const r = await db.execute(`SELECT count(*) AS n FROM ${t}`);
    counts[t] = r.rows[0].n;
  }
  console.log("final counts:", counts);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
