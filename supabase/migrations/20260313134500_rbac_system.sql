
-- Define Role Enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'agent', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.app_role
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role" 
ON public.user_roles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins have full access to roles" ON public.user_roles;
CREATE POLICY "Admins have full access to roles" 
ON public.user_roles TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Update existing tables with RLS policies

-- LEADS TABLE
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin leads access" ON public.leads;
CREATE POLICY "Admin leads access" ON public.leads
TO authenticated USING (public.get_my_role() = 'admin');

DROP POLICY IF EXISTS "Agent leads access" ON public.leads;
CREATE POLICY "Agent leads access" ON public.leads
TO authenticated USING (
  public.get_my_role() = 'agent' AND assigned_agent_id IN (
    SELECT id FROM public.agents WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Manager leads access" ON public.leads;
CREATE POLICY "Manager leads access" ON public.leads
TO authenticated USING (
  public.get_my_role() = 'manager' AND property_id IN (
    SELECT id FROM public.properties WHERE zone_id IN (
      SELECT zone_id FROM public.agents WHERE user_id = auth.uid()
    )
  )
);

-- PROPERTIES TABLE
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view their own properties" ON public.properties;
CREATE POLICY "Owners can view their own properties" ON public.properties
TO authenticated USING (
  public.get_my_role() = 'owner' AND owner_id IN (
    SELECT id FROM public.owners WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Staff can view all properties" ON public.properties;
CREATE POLICY "Staff can view all properties" ON public.properties
TO authenticated USING (
  public.get_my_role() IN ('admin', 'manager', 'agent')
);

-- VISITS TABLE
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view visits" ON public.visits;
CREATE POLICY "Staff can view visits" ON public.visits
TO authenticated USING (
  public.get_my_role() IN ('admin', 'manager', 'agent')
);

-- Seed demo user as admin if exists
DO $$
DECLARE
  demo_user_id uuid;
BEGIN
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@gharpayy.com' LIMIT 1;
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (demo_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
