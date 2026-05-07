import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

async function check() {
  const { data, error } = await supabase.from('properties').select('name, google_maps_link, virtual_tour_link');
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Checking ${data.length} properties...`);
  data.forEach(p => {
    console.log(`${p.name}: Maps=${p.google_maps_link ? 'YES' : 'NO'}, Drive=${p.virtual_tour_link ? 'YES' : 'NO'}`);
  });
}

check();
