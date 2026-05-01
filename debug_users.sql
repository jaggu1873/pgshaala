-- Let's debug why the owners are not inserting.
-- This will show us if the emails actually exist in auth.users
SELECT id, email FROM auth.users WHERE email LIKE '%owner%';
