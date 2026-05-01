-- This script assigns the 'owner' role to the registered owner accounts
-- so they can successfully log into the Owner Portal.

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'owner' FROM auth.users 
WHERE email IN ('owner1@gharpayy.com', 'owner2@gharpayy.com', 'owner3@gharpayy.com')
ON CONFLICT (user_id, role) DO NOTHING;
