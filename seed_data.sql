-- Run this script in your Supabase SQL Editor to populate your database!

-- 1. Insert a mock agent
INSERT INTO public.agents (id, name, email, phone, is_active)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Demo Agent', 'agent@gharpayy.com', '9876543210', true)
ON CONFLICT DO NOTHING;

-- 2. Insert the properties you requested
INSERT INTO public.properties (id, name, area, address, city, price_range, is_active)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'FORUM PRO BOYS', 'koramangla', 'silk board, Koramangala, sg palya, MG road, nexus', 'Bangalore', '12k - 24k', true),
  ('33333333-3333-3333-3333-333333333333', 'FORUM 1 BOYS', 'koramangla', 'silk board, Koramangala, sg palya, MG road, nexus', 'Bangalore', '11k - 22k', true),
  ('44444444-4444-4444-4444-444444444444', 'GT GIRLS', 'koramangla', 'silk board, Koramangala, sg palya, MG road, nexus', 'Bangalore', '16k - 25k', true),
  ('55555555-5555-5555-5555-555555555555', 'ESPLANADE GIRLS', 'koramangla', 'silk board, Koramangala, sg palya, MG road, nexus', 'Bangalore', '21k - 41k', true)
ON CONFLICT DO NOTHING;

-- 3. Insert mock Leads (This makes the Dashboard show numbers!)
INSERT INTO public.leads (name, phone, email, source, status, assigned_agent_id, budget, preferred_location, property_id, first_response_time_min)
VALUES 
  ('Rahul Sharma', '9876543210', 'rahul@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '15k', 'Koramangala', '22222222-2222-2222-2222-222222222222', 5),
  ('Priya Patel', '9988776655', 'priya@example.com', 'instagram', 'contacted', '11111111-1111-1111-1111-111111111111', '20k', 'Koramangala', '44444444-4444-4444-4444-444444444444', 2),
  ('Amit Kumar', '9123456780', 'amit@example.com', 'whatsapp', 'visit_scheduled', '11111111-1111-1111-1111-111111111111', '18k', 'Koramangala', '33333333-3333-3333-3333-333333333333', 10),
  ('Neha Singh', '9876501234', 'neha@example.com', 'phone', 'booked', '11111111-1111-1111-1111-111111111111', '22k', 'Koramangala', '55555555-5555-5555-5555-555555555555', 1);

-- 4. Insert mock Visits
INSERT INTO public.visits (lead_id, property_id, assigned_staff_id, scheduled_at, notes)
VALUES 
  ((SELECT id FROM public.leads WHERE name = 'Amit Kumar' LIMIT 1), '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() + INTERVAL '1 day', 'Interested in double sharing');


-- Adding 11 properties
INSERT INTO public.properties (id, name, area, address, city, price_range, is_active)
VALUES
  ('357a6c2f-3632-4a6e-9535-ea757f618634', 'GQ girl', 'koramangla', 'NEXUS,IBC knowledge,  baneraghata road,  5km , dairy circle, jayanagar,  jp', 'Bangalore', '16k - 24k', true),
  ('a2c1e655-d27e-41a6-b1d7-0cb369c30345', 'homely GIRLS', 'koramangla', 'silk board, Koramangala, sg palya, MG road,  nexus', 'Bangalore', '14k - 24k', true),
  ('1ef5dac0-7134-4022-b4f8-6afa746d7b4e', 'AFFO GIRLS NV', 'koramangla', 'IBC knowledge,  baneraghata road,  5km , dairy circle, jayanagar,  jp', 'Bangalore', '11k - 20k', true),
  ('24346cda-5c11-4519-9cc6-1c1560fb7b90', 'homely BOYS', 'koramangla', 'silk board, Koramangala, sg palya, MG road,  nexus', 'Bangalore', '14k - 24k', true),
  ('758cb7f9-a22c-41c8-91e0-f687c257439c', 'G Forum GIRLS', 'koramangla', 'IBC knowledge,  baneraghata road,  5km , dairy circle, jayanagar,  jp', 'Bangalore', '13k', true),
  ('95a020e3-6c3d-4f3c-a1f4-8868c1a7eb2e', 'jack coed', 'koramangla', 'coed , 5km from nexus ', 'Bangalore', '16k - 25k', true),
  ('6463d529-0a7a-4f2a-98a4-ffb6615c7221', 'WYSE GIRLS', 'KORAMANGALA, SG PALYA, THAVKHERE', 'CHRIST CENTRAL, IBC KNOWLEDGE PARK', 'Bangalore', '18k - 28k', true),
  ('d7a45eda-1b1f-4521-bcb7-d53c5b849761', 'XOLD FLATLIKE COED ', 'koramangla', 'silk board, Koramangala, sg palya, MG road,  nexus', 'Bangalore', '10k - 14k', true),
  ('9f49171c-3d4b-4893-924a-c8c8914b6638', 'John Boys', 'koramangla', 'silk board, Koramangala, sg palya, MG road,  nexus', 'Bangalore', '8k - 18k', true),
  ('14ea6da2-9011-4c02-bf3b-2a60311ef4e7', 'JOY GIRLS ', 'koramangla', 'silk board, Koramangala, sg palya, MG road,  nexus', 'Bangalore', '10k - 21k', true),
  ('f7f3e0ef-e6ed-4524-9603-75f2f593951b', 'khb girls', 'koramangla', '8th Block koramangala  , hsr, etc', 'Bangalore', '10k - 20k', true)
ON CONFLICT DO NOTHING;

-- Adding 10 leads (clients) related to these properties
INSERT INTO public.leads (name, phone, email, source, status, assigned_agent_id, budget, preferred_location, property_id, first_response_time_min)
VALUES
  ('Rajesh Kumar', '9876570711', 'rajesh@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '12k', 'HSR Layout', '22222222-2222-2222-2222-222222222222', 8),
  ('Suresh Menon', '9876568362', 'suresh@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '18k', 'BTM Layout', '33333333-3333-3333-3333-333333333333', 9),
  ('Anita Singh', '9876536157', 'anita@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '14k', 'Indiranagar', '44444444-4444-4444-4444-444444444444', 10),
  ('Pooja Reddy', '9876554988', 'pooja@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '22k', 'Jayanagar', '55555555-5555-5555-5555-555555555555', 9),
  ('Vijay Sharma', '9876594315', 'vijay@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '20k', 'Whitefield', '357a6c2f-3632-4a6e-9535-ea757f618634', 7),
  ('Anjali Patel', '9876525301', 'anjali@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '16k', 'Marathahalli', 'a2c1e655-d27e-41a6-b1d7-0cb369c30345', 1),
  ('Karthik N', '9876568995', 'karthik@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '25k', 'Electronic City', '1ef5dac0-7134-4022-b4f8-6afa746d7b4e', 10),
  ('Sneha M', '9876574353', 'sneha@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '15k', 'Bellandur', '24346cda-5c11-4519-9cc6-1c1560fb7b90', 7),
  ('Ravi Teja', '9876591762', 'ravi@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '13k', 'Domlur', '758cb7f9-a22c-41c8-91e0-f687c257439c', 6),
  ('Deepa K', '9876529904', 'deepa@example.com', 'website', 'new', '11111111-1111-1111-1111-111111111111', '19k', 'Koramangala', '95a020e3-6c3d-4f3c-a1f4-8868c1a7eb2e', 8);

