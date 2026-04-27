-- 1. Delete all mock leads we created so we can cleanly insert just one set
DELETE FROM public.leads WHERE name IN (
    'Rajesh Kumar', 'Suresh Menon', 'Anita Singh', 'Pooja Reddy', 'Vijay Sharma', 
    'Anjali Patel', 'Karthik N', 'Sneha M', 'Ravi Teja', 'Deepa K'
);

-- 2. Delete the 4 duplicate properties
DELETE FROM public.properties WHERE id IN (
    'c706bd20-d1cc-49db-a6a4-88e1ce99b142',
    'd1dcf782-5246-40c3-856c-13dbaad942b9',
    'a992e035-0406-4fd7-b218-b5689af3fc09',
    '1292a13e-453c-4fb7-986b-d73b5de2dda7'
);

-- 3. Update the prices and addresses for the remaining 11 properties
UPDATE public.properties SET price_range = '16k - 24k' WHERE id = '357a6c2f-3632-4a6e-9535-ea757f618634';
UPDATE public.properties SET price_range = '14k - 24k' WHERE id = 'a2c1e655-d27e-41a6-b1d7-0cb369c30345';
UPDATE public.properties SET price_range = '11k - 20k' WHERE id = '1ef5dac0-7134-4022-b4f8-6afa746d7b4e';
UPDATE public.properties SET price_range = '14k - 24k' WHERE id = '24346cda-5c11-4519-9cc6-1c1560fb7b90';
UPDATE public.properties SET price_range = '13k' WHERE id = '758cb7f9-a22c-41c8-91e0-f687c257439c';
UPDATE public.properties SET price_range = '16k - 25k' WHERE id = '95a020e3-6c3d-4f3c-a1f4-8868c1a7eb2e';
UPDATE public.properties SET price_range = '18k - 28k', address = 'CHRIST CENTRAL, IBC KNOWLEDGE PARK', area = 'KORAMANGALA, SG PALYA, THAVKHERE' WHERE id = '6463d529-0a7a-4f2a-98a4-ffb6615c7221';
UPDATE public.properties SET price_range = '10k - 14k' WHERE id = 'd7a45eda-1b1f-4521-bcb7-d53c5b849761';
UPDATE public.properties SET price_range = '8k - 18k' WHERE id = '9f49171c-3d4b-4893-924a-c8c8914b6638';
UPDATE public.properties SET price_range = '10k - 21k' WHERE id = '14ea6da2-9011-4c02-bf3b-2a60311ef4e7';
UPDATE public.properties SET price_range = '10k - 20k' WHERE id = 'f7f3e0ef-e6ed-4524-9603-75f2f593951b';

-- 4. Re-insert exactly ONE set of the 10 beautifully varied mock leads
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
