import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

async function run() {
  console.log("Syncing missing PGs from Excel...");

  // 1. Fetch existing PGs from Supabase
  const { data: existingPgs } = await supabase.from('properties').select('name');
  const existingNames = new Set((existingPgs || []).map(p => p.name.toLowerCase().trim()));

  // 2. Read Excel
  const excelPath = path.resolve('FIND PG DATA GG.xlsx');
  const fileBuffer = fs.readFileSync(excelPath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sqlStatements: string[] = [];

  const sheets = ['MWB Side', 'MCC VASANTH ADLER', 'YPR'];

  sheets.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    const data: any[] = XLSX.utils.sheet_to_json(sheet);
    
    data.forEach(row => {
      // Find name (handle variations)
      let rawName = row.names || row.NAME || row['names '] || row['NAME '];
      if (!rawName || typeof rawName !== 'string') return;
      
      const name = rawName.trim();
      const isExisting = existingNames.has(name.toLowerCase().trim());

      // Extract metadata
      const area = row.area || row.AREA || row.Locality || '';
      const food = row['FOOD '] || row['Food '] || row.FOOD || '';
      const priceRaw = row.price || row.PRICE || '';
      
      // Extract Links using Regex
      const findLink = (str: string) => {
        if (!str || typeof str !== 'string') return null;
        const match = str.match(/https?:\/\/[^\s\]"]+/);
        return match ? match[0] : null;
      };

      const mapLink = findLink(row.location || row.LOCATION || row['exact location'] || '');
      const driveLink = findLink(row['Drive Link'] || row['DRIVE PICS'] || row.Pics || '');

      if (isExisting) {
        // Generate UPDATE SQL
        sqlStatements.push(`-- Update: ${name}`);
        sqlStatements.push(`UPDATE public.properties SET google_maps_link = ${mapLink ? `'${mapLink}'` : 'google_maps_link'}, virtual_tour_link = ${driveLink ? `'${driveLink}'` : 'virtual_tour_link'}, food_details = '${food.toString().replace(/'/g, "''")}' WHERE name ILIKE '${name.replace(/'/g, "''")}';`);
      } else {
        // Generate INSERT SQL
        const propId = crypto.randomUUID();
        sqlStatements.push(`-- New Property: ${name}`);
        sqlStatements.push(`INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('${propId}', '${name.replace(/'/g, "''")}', '${area.toString().replace(/'/g, "''")}', '${priceRaw.toString().substring(0, 50).replace(/'/g, "''")}', '${food.toString().replace(/'/g, "''")}', ${mapLink ? `'${mapLink}'` : 'NULL'}, ${driveLink ? `'${driveLink}'` : 'NULL'}, true)
ON CONFLICT (id) DO NOTHING;`);

        // Create 3 Dummy Rooms
        for (let i = 1; i <= 3; i++) {
          const roomId = crypto.randomUUID();
          const roomNum = (100 * Math.ceil(Math.random() * 4)) + i;
          sqlStatements.push(`INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('${roomId}', '${propId}', '${roomNum}', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;`);
        }
      }
      sqlStatements.push('');
    });
  });

  fs.writeFileSync('insert_missing_pgs.sql', sqlStatements.join('\n'));
  console.log(`Successfully generated ${sqlStatements.length / 5} property insertions in insert_missing_pgs.sql`);
}

run();
