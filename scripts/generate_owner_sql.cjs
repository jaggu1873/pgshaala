const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(l => {
  const [k, ...vs] = l.split('=');
  if (k && vs.length > 0) {
    let val = vs.join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[k.trim()] = val;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const owners = [
    { email: 'owner1@gharpayy.com', name: 'Ramesh Reddy', phone: '9999999990', company: 'Reddy Properties' },
    { email: 'owner2@gharpayy.com', name: 'Suresh Kumar', phone: '9999999991', company: 'Kumar Co-living' },
    { email: 'owner3@gharpayy.com', name: 'Priya Sharma', phone: '9999999992', company: 'Sharma PG' }
  ];

  let sql = `-- FINAL FIX: Direct IDs inserted\n\n`;

  for (const o of owners) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: o.email,
      password: 'password123'
    });
    
    if (error || !data.user) {
      console.error(`Failed to login ${o.email}:`, error?.message);
      continue;
    }

    const userId = data.user.id;
    console.log(`Found ID for ${o.email}: ${userId}`);

    sql += `INSERT INTO public.owners (id, user_id, name, email, phone, company_name)\n`;
    sql += `VALUES (gen_random_uuid(), '${userId}', '${o.name}', '${o.email}', '${o.phone}', '${o.company}')\n`;
    sql += `ON CONFLICT DO NOTHING;\n\n`;

    sql += `INSERT INTO public.user_roles (user_id, role)\n`;
    sql += `VALUES ('${userId}', 'owner')\n`;
    sql += `ON CONFLICT (user_id, role) DO NOTHING;\n\n`;
  }

  sql += `WITH \n`;
  sql += `  o1 AS (SELECT id FROM public.owners WHERE email = 'owner1@gharpayy.com' LIMIT 1),\n`;
  sql += `  o2 AS (SELECT id FROM public.owners WHERE email = 'owner2@gharpayy.com' LIMIT 1),\n`;
  sql += `  o3 AS (SELECT id FROM public.owners WHERE email = 'owner3@gharpayy.com' LIMIT 1)\n`;
  sql += `UPDATE public.properties SET owner_id = \n`;
  sql += `  CASE \n`;
  sql += `    WHEN name IN ('FORUM PRO BOYS', 'FORUM 1 BOYS', 'GQ girl') THEN (SELECT id FROM o1)\n`;
  sql += `    WHEN name IN ('GT GIRLS', 'ESPLANADE GIRLS', 'homely GIRLS', 'homely BOYS') THEN (SELECT id FROM o2)\n`;
  sql += `    ELSE (SELECT id FROM o3)\n`;
  sql += `  END;\n`;

  fs.writeFileSync('APPLY_OWNERS.sql', sql);
  console.log('Successfully generated APPLY_OWNERS.sql');
}

run();
