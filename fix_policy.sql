-- Fix infinite recursion in user_roles policy
DROP POLICY IF EXISTS "Admins have full access to roles" ON public.user_roles;

CREATE POLICY "Admins have full access to roles" 
ON public.user_roles TO authenticated
USING (public.get_my_role() = 'admin');
