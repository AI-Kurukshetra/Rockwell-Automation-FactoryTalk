/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();
const { Client } = require("pg");

function readSql(relativePath) {
  const fullPath = path.resolve(process.cwd(), relativePath);
  return fs.readFileSync(fullPath, "utf8");
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error(
      "DATABASE_URL is missing. Set it in .env before running this script.",
    );
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  const schemaSql = readSql("supabase/schema.sql");
  const seedSql = readSql("supabase/seed.sql");

  console.log("Connecting to database...");
  await client.connect();

  try {
    console.log("Applying schema...");
    await client.query(schemaSql);
    console.log("Schema applied.");

    console.log("Applying seeds...");
    await client.query(seedSql);
    console.log("Seeds applied.");
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
