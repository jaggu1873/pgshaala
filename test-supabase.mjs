import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim().replace(/(^"|"$)/g, '');
  }
});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function test() {
  console.log('Testing connection to Supabase...');
  const { data, error } = await supabase.from('leads').select('*');
  if (error) {
    console.error('Error fetching leads:', error);
  } else {
    console.log('Leads fetched:', data);
    console.log('Number of leads:', data?.length);
  }
}

test();
