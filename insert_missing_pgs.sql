-- New Property: bell girls
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('7e8b37df-ff5a-4547-b2a0-d2a6f2718f2b', 'bell girls', 'bellandur', '⚡️ Welcome to Gharpayy BELL GIRLS - GIRLS! ⚡️ ❤️ W', '3 Time veg & non veg', 'https://maps.app.goo.gl/GcoEbrkPuJVseYCC8', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('b0eeedde-0f03-42e0-a802-06859dffde6b', '7e8b37df-ff5a-4547-b2a0-d2a6f2718f2b', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('8013c673-b048-476b-b09a-e7cf46cfa39d', '7e8b37df-ff5a-4547-b2a0-d2a6f2718f2b', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('be6e03da-d8f9-4068-be18-e5b8f69f05cb', '7e8b37df-ff5a-4547-b2a0-d2a6f2718f2b', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: ESTEEM COED
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('b817b84c-6a7e-48fb-b0ba-217fb2f8505a', 'ESTEEM COED', 'bgm madadevpura', '⚡️ Welcome to Gharpayy ESTEEM  - COED! ⚡️ ❤️ We''re', '3 Time veg & non veg', 'https://maps.app.goo.gl/XA1cnj8SRYavUjZq7', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('008c2f88-12a7-4a56-95cb-3bd63036deb4', 'b817b84c-6a7e-48fb-b0ba-217fb2f8505a', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('da35d925-e271-4d8a-a982-a1a2f7e8d568', 'b817b84c-6a7e-48fb-b0ba-217fb2f8505a', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('008fa162-e9f4-4c75-82ec-a0ee5caa59b3', 'b817b84c-6a7e-48fb-b0ba-217fb2f8505a', '203', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: qual girls
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('52807e7e-c3cf-4fcb-8125-f44827d846fe', 'qual girls', 'bellandur', '⚡️ Welcome to Gharpayy QUAL - GIRLS! ⚡️ ❤️ We''re t', '', 'https://maps.app.goo.gl/8rH5MTcVMKWMY2DAA', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('7310518b-57be-4d96-960f-f0a200a63ccc', '52807e7e-c3cf-4fcb-8125-f44827d846fe', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('cceb3b73-6770-43f5-b600-5f819d2f7ff7', '52807e7e-c3cf-4fcb-8125-f44827d846fe', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('440ba905-fff8-4e5c-9701-90f29e13d821', '52807e7e-c3cf-4fcb-8125-f44827d846fe', '203', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: whit coed
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('dd3ee292-3ea6-4b2c-ad82-f46c72a8165d', 'whit coed', 'whitefield', '⚡️ Welcome to Gharpayy WHIT - COED! ⚡️ ❤️ We''re th', '3 Time veg & non veg', 'https://maps.app.goo.gl/gWyt5JCjXRZed4WY6', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('8e47e9bd-266d-4dcf-bd78-f13438a982ff', 'dd3ee292-3ea6-4b2c-ad82-f46c72a8165d', '301', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('e1102a94-3dc0-43c8-bb42-ad1f5539d015', 'dd3ee292-3ea6-4b2c-ad82-f46c72a8165d', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('2137e04e-ed8e-4c50-ac6f-2ef63db46665', 'dd3ee292-3ea6-4b2c-ad82-f46c72a8165d', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: SF VALLEY
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('ca1b2c88-e1f1-404c-90d9-7d005ac73733', 'SF VALLEY', 'whitefield', '⚡️ Welcome to Gharpayy SF - VALLEY COED! ⚡️ ❤️ We''', 'NO FOOD', 'https://maps.app.goo.gl/4PmE3TkT2BtvkXNx7', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('01252fe9-b400-495a-9c2c-5d941000ad74', 'ca1b2c88-e1f1-404c-90d9-7d005ac73733', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('a8a9f508-f4cc-4e50-bd03-86f09711c0e7', 'ca1b2c88-e1f1-404c-90d9-7d005ac73733', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('2be8096a-2acc-4751-a5e8-8093f25d60d0', 'ca1b2c88-e1f1-404c-90d9-7d005ac73733', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: PHIX BGM
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('8ab2f311-28f7-4aee-8d24-6bed9d462580', 'PHIX BGM', 'bgm madadevpura', '', '', 'https://maps.app.goo.gl/1etTC7JAqtfc6KKp6', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('d887e49c-7c93-4844-919e-3f5c4908326f', '8ab2f311-28f7-4aee-8d24-6bed9d462580', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('5efd26af-42ce-4899-8feb-eced84763971', '8ab2f311-28f7-4aee-8d24-6bed9d462580', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('32571ad1-e1a1-4a8c-a7a0-bba9abb9bbeb', '8ab2f311-28f7-4aee-8d24-6bed9d462580', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: METROFIELD
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('9cd2a5b7-4cf6-4226-85d4-c55e159c428e', 'METROFIELD', 'whitefield', '⚡️ Welcome to Gharpayy METROFIELD - COED! ⚡️ ❤️ We', '3 Time veg & non veg', 'https://maps.app.goo.gl/mg2SiKg9ZeoND79v6', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('4d233061-0cd5-425d-b497-8b6547d49a91', '9cd2a5b7-4cf6-4226-85d4-c55e159c428e', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('573cbf85-908f-4104-8498-56d3c53c2580', '9cd2a5b7-4cf6-4226-85d4-c55e159c428e', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('3cbb93f3-38ea-44e1-826e-45741563ce19', '9cd2a5b7-4cf6-4226-85d4-c55e159c428e', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: bgm max coed
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('88d6de2a-8236-449d-b2a4-9be0000acb7c', 'bgm max coed', 'bgm madadevpura', '⚡️ Welcome to Gharpayy BGM MAX - COED ! ⚡️ ❤️ We''r', '3 Time veg & non veg', 'https://maps.app.goo.gl/QuLYHW5y9i1yt1qQA', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('7e55c879-7170-41f6-bc83-d1fec4a7cec2', '88d6de2a-8236-449d-b2a4-9be0000acb7c', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('fee2b9c4-2472-405a-a00c-3c14a93abfee', '88d6de2a-8236-449d-b2a4-9be0000acb7c', '102', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('0c1738f1-8c25-44e0-9e00-f95ed5450b48', '88d6de2a-8236-449d-b2a4-9be0000acb7c', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: bgm kingdom
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('6ee788cd-15dd-4ed0-9bd5-0993177ef9ed', 'bgm kingdom', 'bgm madadevpura', '⚡️ Welcome to Gharpayy BGM KINGDOM - COED ! ⚡️ ❤️ ', '3 Time veg & non veg', 'https://maps.app.goo.gl/NXAdf9dNhp6NuYcs5', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('f3498cef-2161-4d1f-871f-dc93c1025775', '6ee788cd-15dd-4ed0-9bd5-0993177ef9ed', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('3eb299e5-b816-41c3-a911-af3201f6a668', '6ee788cd-15dd-4ed0-9bd5-0993177ef9ed', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('cf84650c-86a8-449f-a4c9-7bf7712206c5', '6ee788cd-15dd-4ed0-9bd5-0993177ef9ed', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: eco coed
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('a4a51384-284f-485b-b4e0-820f3d1e7fde', 'eco coed', 'bellandur', '⚡️ Welcome to Gharpayy ECO - COED! ⚡️ ❤️ We''re thr', '3 Time veg & non veg', 'https://maps.app.goo.gl/2VRqASzDKvTc8j7S9', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('1fd96aa2-a0c5-4f66-9618-6eb01712f343', 'a4a51384-284f-485b-b4e0-820f3d1e7fde', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('3ad50afc-220c-4e98-9e24-7b25ce40350d', 'a4a51384-284f-485b-b4e0-820f3d1e7fde', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('b19551b2-1119-4ad5-9983-af94fb3d4cc7', 'a4a51384-284f-485b-b4e0-820f3d1e7fde', '203', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: bliss Coed
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('c43754ed-d41e-480d-913e-a09bd389f4b0', 'bliss Coed', 'whitefield', 'Gharpayy BLISS COED ⚡️ ❤️ we''re glad you liked the', '3 Time veg & non veg', 'https://maps.app.goo.gl/Q45VDHrjtKDtfkR87', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('742c5c50-ee20-4b0f-a57f-af850f607899', 'c43754ed-d41e-480d-913e-a09bd389f4b0', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('21585709-fa7d-4f16-bc54-26348ce87933', 'c43754ed-d41e-480d-913e-a09bd389f4b0', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('389d1d2e-cbe9-4e2d-86dd-20cf4110cdd0', 'c43754ed-d41e-480d-913e-a09bd389f4b0', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: QUEEN'S MCC
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('8c1577f1-2651-49af-b06f-d1fc3e43fd3b', 'QUEEN''S MCC', 'Vasanth Nagar/Mcc', '⚡️ Welcome to Gharpayy QUEEN''S ⚡️ ❤️ We''re thrille', '4 times veg only', 'https://maps.app.goo.gl/sKP9AZ8x5EdmHFhTA', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('6fed2988-b595-48ab-b425-57065b4d50b3', '8c1577f1-2651-49af-b06f-d1fc3e43fd3b', '301', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('7feb3dfa-98fb-494f-bc7c-399056f8650d', '8c1577f1-2651-49af-b06f-d1fc3e43fd3b', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('ce96f989-4371-4d1c-8f6d-84e64cf3aaef', '8c1577f1-2651-49af-b06f-d1fc3e43fd3b', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: QUEENS SAPPHIRE CMS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('a7b59763-d5b7-495f-acb8-28cdbe644dde', 'QUEENS SAPPHIRE CMS', 'Vasanth Nagar/Mcc', '"⚡️ Welcome to Gharpayy QUEEN''S ⚡️ ❤️ We''re thrill', '4 times veg only', 'https://maps.app.goo.gl/FgFLzzkHEKGg5LNJ7', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('8a29e247-5327-415a-a06a-6ea7a628f8ac', 'a7b59763-d5b7-495f-acb8-28cdbe644dde', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('97507c14-adcc-493f-b906-13560fd2f45a', 'a7b59763-d5b7-495f-acb8-28cdbe644dde', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('af6ed386-1798-4881-9df2-6ff1d40123ba', 'a7b59763-d5b7-495f-acb8-28cdbe644dde', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: MINERVA CIRCLE
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('96778c6b-5f9d-4cf3-bbe8-49414708d9d5', 'MINERVA CIRCLE', 'Minerva circle', '"⚡️ Welcome to Gharpayy QUEEN''S ⚡️ ❤️ We''re thrill', '3 times veg', 'https://maps.app.goo.gl/X4ypB2Nm99YkHmBP7', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('169d0059-106e-4294-aebb-9ff1639230bd', '96778c6b-5f9d-4cf3-bbe8-49414708d9d5', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('a65b8ba9-0383-4fc5-90aa-ccc934e948a3', '96778c6b-5f9d-4cf3-bbe8-49414708d9d5', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('20a2ec41-d94c-4b95-935e-f8dad84c9b8a', '96778c6b-5f9d-4cf3-bbe8-49414708d9d5', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: UV GIRLS - 9TH BLOCK
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('2839cc2a-012b-493a-b187-113ac3025c17', 'UV GIRLS - 9TH BLOCK', 'Jayanagar ', '"⚡️ Welcome to Gharpayy UV GIRLS ⚡️ ❤️ We''re thril', '4 times veg only', 'https://maps.app.goo.gl/RcbV5kZrPg24K7cy5', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('db28029d-d014-42ad-921f-91290f92a7c2', '2839cc2a-012b-493a-b187-113ac3025c17', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('e2ec51f8-a37a-4c42-8fe0-e6525ff04923', '2839cc2a-012b-493a-b187-113ac3025c17', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('d869971c-05f7-49ab-b8c6-f35d98c3c9c8', '2839cc2a-012b-493a-b187-113ac3025c17', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: BEL ROAD
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('31ec015a-d7e3-4015-bc00-384b552e23af', 'BEL ROAD', 'BEL ROAD', '"⚡️ Welcome to Gharpayy QUEENS IISC ⚡️ ❤️ We''re th', '3 times veg', 'https://maps.app.goo.gl/hFmhBqJ4CsS16Qie9', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('5d17e8c5-c9c4-48dd-b55f-0d21c35b3936', '31ec015a-d7e3-4015-bc00-384b552e23af', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('4661ff9a-6095-4a14-877a-9f8afdf941f3', '31ec015a-d7e3-4015-bc00-384b552e23af', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('b1378e6b-b4e3-4239-aca9-ac16bea8baa8', '31ec015a-d7e3-4015-bc00-384b552e23af', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: WHITE HOUSE
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('c898c699-ee62-47f8-8952-7dfd4252aea2', 'WHITE HOUSE', 'Vasanth Nagar/Mcc', '"⚡️ Welcome to Gharpayy White House ⚡️ ❤️ We''re th', '4 times veg only', 'https://maps.app.goo.gl/nkv9sYf5hvzKnj6n6', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('6d025806-c726-4508-9c87-b84504826b2f', 'c898c699-ee62-47f8-8952-7dfd4252aea2', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('4e4a4027-f81b-4a98-a1de-427e0e964a57', 'c898c699-ee62-47f8-8952-7dfd4252aea2', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('83a35042-d422-4527-b74c-aadc2c978005', 'c898c699-ee62-47f8-8952-7dfd4252aea2', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: bell girls
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('7bfe24ae-42db-4b26-97e3-784ae7fa6a38', 'bell girls', 'bellandur', '⚡️ Welcome to Gharpayy BELL GIRLS - GIRLS! ⚡️ ❤️ W', '3 times veg only', 'https://maps.app.goo.gl/GcoEbrkPuJVseYCC8', 'https://drive.google.com/drive/folders/12Ur5hRv_BhamUGVPzkWkl0OsVh3ToGfu', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('22d8b388-dc94-4fca-982d-59f364fc69a1', '7bfe24ae-42db-4b26-97e3-784ae7fa6a38', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('a6502f9c-3017-4174-b6b4-2e0a3e57c767', '7bfe24ae-42db-4b26-97e3-784ae7fa6a38', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('6f60714b-457f-4cd7-8a5e-8b11c447de3f', '7bfe24ae-42db-4b26-97e3-784ae7fa6a38', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: FORT BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('0344db1a-9b07-4500-9107-43ac6ac0828c', 'FORT BOYS', 'ypr campus', 'Welcome to Gharpayy FORT BOYS! ⚡️ ❤️ We''re thrille', '4 times pure veg ', 'https://maps.app.goo.gl/vhHLBzcYdakhYaoL6', 'https://drive.google.com/drive/folders/1ayEG5QS1vBa_WUL4sVoaeVxVW4Ym5WwX', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('fc0921da-4602-4e83-a86b-6cd3316b1c71', '0344db1a-9b07-4500-9107-43ac6ac0828c', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('c78237a1-37ed-4113-9bcc-16a6993207b2', '0344db1a-9b07-4500-9107-43ac6ac0828c', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('fd24fc6a-b381-4a51-ae43-e0d7ebe0dc00', '0344db1a-9b07-4500-9107-43ac6ac0828c', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: PARADISE LUXURY GIRLS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('1a801185-c937-4fc8-ac29-a0018bb36710', 'PARADISE LUXURY GIRLS', 'ypr campus', 'Welcome to Gharpayy Paradise - GIRLS! ⚡️ ❤️ We''re ', '4 times pure veg', 'https://maps.app.goo.gl/3MtWanQFzss32tUZ7', 'https://drive.google.com/drive/folders/1Y_xBzKxHWLyKKCeUh65lSxWXPGI5oArg', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('5ce6d9f5-d20c-4b90-84d8-e954ec2f5c46', '1a801185-c937-4fc8-ac29-a0018bb36710', '301', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('f759c4f6-5571-4f15-b92c-919016b4da4e', '1a801185-c937-4fc8-ac29-a0018bb36710', '102', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('a4446a90-7bf9-4701-b9ff-a620620ffbc3', '1a801185-c937-4fc8-ac29-a0018bb36710', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: METEOR GIRLS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('9bb0678d-5157-400d-ad38-28a712fb95c4', 'METEOR GIRLS', 'ypr campus', 'Welcome to Gharpayy METEOR - GIRLS! ⚡️ ❤️ We''re th', '4 times pure veg', 'https://maps.app.goo.gl/T26tKWjdjTgeFaMPA', 'https://drive.google.com/drive/folders/17xoL50ozLRkIRd8LiFuzQi_CX7LZJr_M', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('f8cff413-b61d-4dc7-89a9-f7535244767d', '9bb0678d-5157-400d-ad38-28a712fb95c4', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('a3a0f339-ed3f-4dd7-a02c-5280e029c6a6', '9bb0678d-5157-400d-ad38-28a712fb95c4', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('4c2a8e91-e6af-4036-b592-640f4fa2fb2e', '9bb0678d-5157-400d-ad38-28a712fb95c4', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: QUIK GIRLS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('75d2d474-c6df-4892-ba2f-48c2302201f3', 'QUIK GIRLS', 'ypr campus', 'Welcome to Gharpayy QUIQ - GIRLS! ⚡️ ❤️ We''re thri', '4 times veg/non veg', 'https://maps.app.goo.gl/vhHLBzcYdakhYaoL6', 'https://drive.google.com/drive/folders/1Lcbxjufd6eYCPqC7Xv_CazTleeMHzOSA', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('8bc86fff-65aa-4638-af22-e9f3f408162a', '75d2d474-c6df-4892-ba2f-48c2302201f3', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('2c89ab2e-89ca-48ae-8665-02569d5df5ce', '75d2d474-c6df-4892-ba2f-48c2302201f3', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('bc313126-f5ba-4ad9-937e-5fa0ad073520', '75d2d474-c6df-4892-ba2f-48c2302201f3', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: ROOMY BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('43184065-6b28-4319-a612-8b6d71488f26', 'ROOMY BOYS', 'ypr campus', 'Welcome to Gharpayy ROOMY BOYS! ⚡️ ❤️ We''re thrill', '4 times veg/non veg', 'https://maps.app.goo.gl/3MtWanQFzss32tUZ7', 'https://drive.google.com/drive/folders/1N5Uz2r3bhiKvu7CMlG05kjuR7KDXCrYT', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('fc39746e-f565-495a-8472-cffa572bd1af', '43184065-6b28-4319-a612-8b6d71488f26', '301', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('86a613e0-8239-497d-be20-6afc193e969e', '43184065-6b28-4319-a612-8b6d71488f26', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('05a4af39-7bb1-48ca-bb00-d33141ee308d', '43184065-6b28-4319-a612-8b6d71488f26', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: WISE BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('2e3656f0-3d0e-467d-a2e5-5540d27262e6', 'WISE BOYS', 'ypr campus', 'Welcome to Gharpayy WISE - BOYS! ⚡️ ❤️ We''re thril', '4 times pure veg', 'https://maps.app.goo.gl/A2LLkdAHRGg2bdQZ9', 'https://drive.google.com/drive/folders/1dSRCd2Mb8yakRuGR0FS3ivbRuWz0zOUt', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('7a4ff87b-9626-4f86-9fe3-3bc8076abdfe', '2e3656f0-3d0e-467d-a2e5-5540d27262e6', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('5a2d5a02-503d-417d-9e48-4617a927ee1f', '2e3656f0-3d0e-467d-a2e5-5540d27262e6', '102', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('f7a8ac8a-21d0-41b2-b154-5bd88a0867da', '2e3656f0-3d0e-467d-a2e5-5540d27262e6', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: AFFO YPR GIRLS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('b1e9dbc6-d88c-42c9-b20f-f2ce5070d414', 'AFFO YPR GIRLS', 'ypr campus', 'Welcome to Gharpayy AFFO YPR- GIRLS! ⚡️ ❤️ We''re t', '4 times veg/non veg', 'https://maps.app.goo.gl/cN8Jk3yft2nPHh5z6', 'https://drive.google.com/drive/folders/19qD8rXZ3LaZNFQFjjVIMG2dD-WdaaSES', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('d7fa1624-1ca9-40a1-adac-1a4b2e664d69', 'b1e9dbc6-d88c-42c9-b20f-f2ce5070d414', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('b137dcea-67e6-4553-aab2-c61d2472fa94', 'b1e9dbc6-d88c-42c9-b20f-f2ce5070d414', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('7504bc48-6677-48d1-bbaf-5c21c82a162d', 'b1e9dbc6-d88c-42c9-b20f-f2ce5070d414', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: KING LUXE BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('859695f4-ceb8-49ae-881e-07d39a7b47c3', 'KING LUXE BOYS', 'ypr campus', 'Welcome to Gharpayy KING LUXE BOYS! ⚡️ ❤️ We''re th', '4 times veg/non veg', 'https://maps.app.goo.gl/vhHLBzcYdakhYaoL6', 'https://drive.google.com/drive/folders/1OGa9tkl59g4FTpFb4ja6Hlvs0vFS4KVK', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('8a0e8344-70d3-42d9-bfaa-fbd4a53b5f82', '859695f4-ceb8-49ae-881e-07d39a7b47c3', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('f312b3d6-233d-4b11-b9d1-2b07e9b1e9e9', '859695f4-ceb8-49ae-881e-07d39a7b47c3', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('1ee82e20-9fc8-4189-b605-d2d9e1614fdc', '859695f4-ceb8-49ae-881e-07d39a7b47c3', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: FLATT BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('ef0a9aa0-5dac-4080-9c8f-a66a1ce9c5ab', 'FLATT BOYS', 'ypr campus', 'Welcome to Gharpayy FLATT BOYS! ⚡️ ❤️ We''re thrill', '4 times pure veg', 'https://maps.app.goo.gl/3MtWanQFzss32tUZ7', 'https://drive.google.com/drive/folders/15t9oyB0FhkduQ-b6V4W1RGjWu4Lut5Mm', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('dd3c7eb7-eda4-4f55-b77a-84aaffda577e', 'ef0a9aa0-5dac-4080-9c8f-a66a1ce9c5ab', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('0753c933-c7cc-4a4a-9031-41f3b9e9f88d', 'ef0a9aa0-5dac-4080-9c8f-a66a1ce9c5ab', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('595bb7c8-bd76-4e5a-88af-25e9ff8c96bf', 'ef0a9aa0-5dac-4080-9c8f-a66a1ce9c5ab', '203', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: NESTO BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('7c21ca13-c499-4912-b0af-f2cb0afe8e87', 'NESTO BOYS', 'ypr campus', 'Welcome to Gharpayy NESTO BOYS! ⚡️ ❤️ We''re thrill', '4 times veg/non veg', 'https://maps.app.goo.gl/Lz5CmRkcq83eWJ5p9', 'https://drive.google.com/drive/folders/1DKSHeAlZ-5rATpm6_JKBRPaGpyWvYdpR', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('92b127aa-626a-4586-8588-96b2ad5bb0bc', '7c21ca13-c499-4912-b0af-f2cb0afe8e87', '301', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('dd2415b7-7453-4b70-87ae-31c8c1a8e672', '7c21ca13-c499-4912-b0af-f2cb0afe8e87', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('d3787c52-98e9-4557-9a22-5844f271ecef', '7c21ca13-c499-4912-b0af-f2cb0afe8e87', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: NXTT GIRLS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('eaa69287-9285-4268-8706-01cbce51062a', 'NXTT GIRLS', 'ypr campus', 'Welcome to Gharpayy NXTT - GIRLS! ⚡️ ❤️ We''re thri', '4 times pure veg', 'https://maps.app.goo.gl/vvZwqGuQLPDU7nHf9', 'https://drive.google.com/drive/folders/1Qv25VWrnGxNFFK4GcHkN_yK2yARlaBrK', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('dfbe96c3-223d-478d-b74b-d4cdc85da9e7', 'eaa69287-9285-4268-8706-01cbce51062a', '401', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('e05a1115-6d39-4b56-b79c-77fd177f90c9', 'eaa69287-9285-4268-8706-01cbce51062a', '102', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('312f132c-9761-4974-bcaf-19890db00bad', 'eaa69287-9285-4268-8706-01cbce51062a', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: NESTO GIRLS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('c6567fc3-779b-4da0-ae59-354a6b9d1215', 'NESTO GIRLS', 'ypr campus', 'Welcome to Gharpayy NESTO - GIRLS! ⚡️ ❤️ We''re thr', '4 times veg/non veg', 'https://maps.app.goo.gl/2i8xYsTyaY2NEJNe9', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('94a02b87-4b58-4983-894b-7cc815cd1a98', 'c6567fc3-779b-4da0-ae59-354a6b9d1215', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('f50cb4ac-244a-48a0-84cd-8451be32e6ab', 'c6567fc3-779b-4da0-ae59-354a6b9d1215', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('abf58efd-f7dc-45c3-9190-d7b8c2064558', 'c6567fc3-779b-4da0-ae59-354a6b9d1215', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: IMPERIAL GIRLS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('872ad501-8e17-4cce-a387-26de2a82bbeb', 'IMPERIAL GIRLS', 'ypr campus', 'Welcome to Gharpayy IMPERIAL- GIRLS! ⚡️ ❤️ We''re t', '5 times PURE VEG', 'https://maps.app.goo.gl/vvZwqGuQLPDU7nHf9', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('80b7294d-3d50-41d2-9410-f407fbbbcd3a', '872ad501-8e17-4cce-a387-26de2a82bbeb', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('5c161973-c6e7-4d38-8bdd-3aeade5a6e00', '872ad501-8e17-4cce-a387-26de2a82bbeb', '102', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('8d5459b6-2249-4837-9a46-0bd782e9ffa4', '872ad501-8e17-4cce-a387-26de2a82bbeb', '303', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: ECO BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('9221a498-6da5-48b6-9877-00b0ad1dcd43', 'ECO BOYS', 'ypr campus', 'Welcome to Gharpayy ECO BOYS! ⚡️ ❤️ We''re thrilled', '3 times veg/non veg', 'https://maps.app.goo.gl/cN8Jk3yft2nPHh5z6', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('13c2e620-475d-4a5d-8fa4-c94d0da6a93b', '9221a498-6da5-48b6-9877-00b0ad1dcd43', '201', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('b685f0a1-c519-496f-aa5d-def01f442310', '9221a498-6da5-48b6-9877-00b0ad1dcd43', '202', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('b49a37e6-0225-462f-a3a3-84bb3b9842ef', '9221a498-6da5-48b6-9877-00b0ad1dcd43', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: DESTINY BOYS
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('571ada9a-778d-4ae9-b51b-f25efc8161cf', 'DESTINY BOYS', 'ypr campus', 'Welcome to Gharpayy DESTINY- BOYS! ⚡️ ❤️ We''re thr', '-', 'https://maps.app.goo.gl/2i8xYsTyaY2NEJNe9', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('72e2f3c3-1bb8-4689-af4c-0aec4dffee2f', '571ada9a-778d-4ae9-b51b-f25efc8161cf', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('d4d468c9-9f8c-493b-8230-08417093c179', '571ada9a-778d-4ae9-b51b-f25efc8161cf', '402', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('43fe02e0-5418-438c-8239-ff9022ce0139', '571ada9a-778d-4ae9-b51b-f25efc8161cf', '103', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;

-- New Property: FLOW COED
INSERT INTO public.properties (id, name, area, price_range, food_details, google_maps_link, virtual_tour_link, is_active) 
VALUES ('f246ea93-cb16-4444-b9c6-ca0135999b51', 'FLOW COED', 'ypr campus', '⚡️ Welcome to Gharpayy FLOW  COED! ⚡️ ❤️ We''re thr', 'NO FOOD ', 'https://maps.app.goo.gl/ngxs2cR3qXnwQVKz9', NULL, true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('7a8aa86f-5a75-448a-b85c-657c16436e62', 'f246ea93-cb16-4444-b9c6-ca0135999b51', '101', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('385cf491-1c09-40a6-b457-33ae92c78f7a', 'f246ea93-cb16-4444-b9c6-ca0135999b51', '302', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rooms (id, property_id, room_number, status, bed_count) 
VALUES ('60083fe8-63d6-4e0d-baa8-230b8f9cc678', 'f246ea93-cb16-4444-b9c6-ca0135999b51', '403', 'occupied', 3)
ON CONFLICT (id) DO NOTHING;
