import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("Checking Database State...");

  // Check auth.users via a regular query? Wait, anon key can't read auth.users.
  // We can only read public tables.

  const { data: owners, error: ownersError } = await supabase.from('owners').select('*');
  console.log("Owners Table:");
  if (ownersError) console.error(ownersError);
  else console.log(owners);

  const { data: properties, error: propertiesError } = await supabase.from('properties').select('id, name, owner_id');
  console.log("\nProperties Table:");
  if (propertiesError) console.error(propertiesError);
  else console.log(properties.slice(0, 5), `... (${properties.length} total)`);

  const { data: roles, error: rolesError } = await supabase.from('user_roles').select('*');
  console.log("\nUser Roles Table:");
  if (rolesError) console.error(rolesError);
  else console.log(roles);
}

checkDatabase();
