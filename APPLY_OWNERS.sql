-- FINAL FIX: Direct IDs inserted

INSERT INTO public.owners (id, user_id, name, email, phone, company_name)
VALUES (gen_random_uuid(), '48e9bdf0-c6c7-45a2-8ccd-2d71ce8f82f2', 'Ramesh Reddy', 'owner1@gharpayy.com', '9999999990', 'Reddy Properties')
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('48e9bdf0-c6c7-45a2-8ccd-2d71ce8f82f2', 'owner')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.owners (id, user_id, name, email, phone, company_name)
VALUES (gen_random_uuid(), 'a518a0ec-9714-48f7-895e-b5542a9166d2', 'Suresh Kumar', 'owner2@gharpayy.com', '9999999991', 'Kumar Co-living')
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('a518a0ec-9714-48f7-895e-b5542a9166d2', 'owner')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.owners (id, user_id, name, email, phone, company_name)
VALUES (gen_random_uuid(), '440165b0-0e01-4db4-823f-0f2dad90a9fc', 'Priya Sharma', 'owner3@gharpayy.com', '9999999992', 'Sharma PG')
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('440165b0-0e01-4db4-823f-0f2dad90a9fc', 'owner')
ON CONFLICT (user_id, role) DO NOTHING;

WITH 
  o1 AS (SELECT id FROM public.owners WHERE email = 'owner1@gharpayy.com' LIMIT 1),
  o2 AS (SELECT id FROM public.owners WHERE email = 'owner2@gharpayy.com' LIMIT 1),
  o3 AS (SELECT id FROM public.owners WHERE email = 'owner3@gharpayy.com' LIMIT 1)
UPDATE public.properties SET owner_id = 
  CASE 
    WHEN name IN ('FORUM PRO BOYS', 'FORUM 1 BOYS', 'GQ girl') THEN (SELECT id FROM o1)
    WHEN name IN ('GT GIRLS', 'ESPLANADE GIRLS', 'homely GIRLS', 'homely BOYS') THEN (SELECT id FROM o2)
    ELSE (SELECT id FROM o3)
  END;
