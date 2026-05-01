-- Seed Rooms and Beds dynamically for all existing properties
DO $$
DECLARE
  v_property RECORD;
  v_room_id uuid;
  v_num_rooms INT;
  v_num_beds INT;
  v_room_status TEXT[];
  v_bed_status TEXT[];
  i INT;
  j INT;
BEGIN
  v_room_status := ARRAY['occupied', 'vacant', 'occupied', 'blocked'];
  v_bed_status := ARRAY['vacant', 'occupied', 'vacating_soon', 'occupied', 'blocked'];

  -- Loop through all properties
  FOR v_property IN SELECT id, name FROM public.properties LOOP
    -- Generate 2 to 4 rooms per property
    v_num_rooms := floor(random() * 3 + 2)::INT;
    
    FOR i IN 1..v_num_rooms LOOP
      -- Insert Room
      INSERT INTO public.rooms (
        id, 
        property_id, 
        room_number, 
        bed_count, 
        expected_rent, 
        status, 
        auto_locked
      )
      VALUES (
        gen_random_uuid(),
        v_property.id,
        (i * 100 + floor(random() * 10)::INT)::TEXT, -- e.g., "102", "204"
        floor(random() * 3 + 1)::INT, -- 1, 2, or 3 sharing
        (floor(random() * 10 + 6) * 1000)::NUMERIC, -- 6000 to 15000 rent
        v_room_status[floor(random() * 4 + 1)]::public.room_status,
        (random() > 0.8) -- 20% chance of being locked
      )
      RETURNING id INTO v_room_id;

      -- Generate 1 to 3 beds per room
      v_num_beds := floor(random() * 3 + 1)::INT;

      FOR j IN 1..v_num_beds LOOP
        -- Insert Bed
        INSERT INTO public.beds (
          id,
          room_id,
          bed_number,
          status,
          current_rent
        )
        VALUES (
          gen_random_uuid(),
          v_room_id,
          chr(64 + j), -- 'A', 'B', 'C'
          v_bed_status[floor(random() * 5 + 1)]::public.bed_status,
          (floor(random() * 10 + 6) * 1000)::NUMERIC
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
