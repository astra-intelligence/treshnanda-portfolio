import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// SQLite (libsql) — a single file DB. Override with DATABASE_URL=file:/abs/path.db
const url = process.env.DATABASE_URL || "file:./data/portfolio.db";

const client = createClient({ url });
export const db = drizzle(client, { schema });
