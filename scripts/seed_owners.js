import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').replace(/^"|"$/g, '').trim();
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_PUBLISHABLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const owners = [
  { email: 'owner1@gharpayy.com', password: 'password123', name: 'Ramesh Reddy', company: 'Reddy Properties' },
  { email: 'owner2@gharpayy.com', password: 'password123', name: 'Suresh Kumar', company: 'Kumar Co-living' },
  { email: 'owner3@gharpayy.com', password: 'password123', name: 'Priya Sharma', company: 'Sharma PG' }
];

async function seedOwners() {
  const createdUsers = [];

  for (const owner of owners) {
    console.log(`Signing up ${owner.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: owner.email,
      password: owner.password,
      options: {
        data: { full_name: owner.name }
      }
    });

    if (error) {
      console.error(`Error signing up ${owner.email}:`, error.message);
    } else {
      console.log(`Success: ${owner.email} created with ID ${data.user?.id}`);
      if (data.user) {
        createdUsers.push({ id: data.user.id, ...owner });
      }
    }
  }

  if (createdUsers.length > 0) {
    let sql = `-- Run this in Supabase SQL Editor to finish setup!\n\n`;
    sql += `-- 1. Confirm emails if required\n`;
    sql += `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email IN ('owner1@gharpayy.com', 'owner2@gharpayy.com', 'owner3@gharpayy.com');\n\n`;
    
    sql += `-- 2. Insert into owners table\n`;
    sql += `INSERT INTO public.owners (id, user_id, name, email, phone, company_name)\nVALUES\n`;
    
    const values = createdUsers.map((u, i) => 
      `  (gen_random_uuid(), '${u.id}', '${u.name}', '${u.email}', '999999999${i}', '${u.company}')`
    ).join(',\n');
    sql += values + `\nON CONFLICT (user_id) DO NOTHING;\n\n`;

    sql += `-- 3. Assign properties to owners\n`;
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

    fs.writeFileSync('setup_owners_final.sql', sql);
    console.log(`\nGenerated 'setup_owners_final.sql' with ${createdUsers.length} users. Please run this in your Supabase SQL Editor.`);
  }
}

seedOwners();
