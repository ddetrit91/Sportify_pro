import { neon } from "@neondatabase/serverless";
import fs from "fs";

// Load .env.local manually and clean quotes/CRLF
const envContent = fs.readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in .env.local");
  }

  const sql = neon(dbUrl);
  const rows = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version;`;
  console.log("Connected to Neon Lakebase Postgres successfully!");
  console.log(rows[0]);
}

testConnection().catch((err) => {
  console.error("Connection failed:", err);
  process.exit(1);
});
