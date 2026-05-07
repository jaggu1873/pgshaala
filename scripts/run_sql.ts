import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_SERVICE_KEY in .env');
  console.error('   Go to: Supabase Dashboard → Project Settings → API → service_role key');
  process.exit(1);
}

async function runSql(sql: string): Promise<{ error?: string }> {
  const url = `https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { error: text };
  }
  return {};
}

async function main() {
  const raw = fs.readFileSync('insert_missing_pgs.sql', 'utf8');

  // Split on semicolons, skip comments and blanks
  const statements = raw
    .split(/;\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`▶  Running ${statements.length} SQL statements…\n`);

  let ok = 0;
  let fail = 0;

  for (const stmt of statements) {
    const sql = stmt.endsWith(';') ? stmt : stmt + ';';
    const { error } = await runSql(sql);
    if (error) {
      console.error(`❌  FAILED:\n    ${sql.substring(0, 100)}…\n    Error: ${error}\n`);
      fail++;
    } else {
      ok++;
    }
  }

  console.log(`\n✅  Done — ${ok} succeeded, ${fail} failed.`);
}

main();
