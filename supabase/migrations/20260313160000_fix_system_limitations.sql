-- Fix "UI forms not saving data" due to missing RLS policies for anonymous public users

-- Leads (for LeadCapture form)
CREATE POLICY "Anon can insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anon can select leads" ON public.leads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anon can update leads" ON public.leads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Visits (for Schedule a Visit and Virtual Tour forms)
CREATE POLICY "Anon can insert visits" ON public.visits FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anon can select visits" ON public.visits FOR SELECT TO anon, authenticated USING (true);

-- Conversations (for PropertyChat widget)
CREATE POLICY "Anon can insert conversations" ON public.conversations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anon can select conversations" ON public.conversations FOR SELECT TO anon, authenticated USING (true);
