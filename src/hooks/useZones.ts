import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ─── Zones ──────────────────────────────────────────
/**
 * EDUCATIONAL ANNOTATION: Core Networking Concepts & REST APIs
 * 
 * The functions in this file demonstrate how a network-enabled system 
 * communicates using the HTTP protocol. Even though we use the Supabase 
 * SDK wrapper, underlying requests still follow the Client-Server Architecture.
 * 
 * - Stateless Communication: Each request here (select, insert, update) is 
 *   completely independent. The server doesn't retain session state between requests, 
 *   relying on HTTP headers (like Authorization tokens) to authenticate.
 * - JSON Data Exchange: Data sent to the server (e.g. creating a zone) 
 *   and data received from the server (e.g. fetching zones) is serialized 
 *   as JSON format for maximum interoperability.
 */
export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      // REST API Equivalent: GET /rest/v1/zones
      // This maps to a GET request in the Application Layer (HTTP) to retrieve data.
      const { data, error } = await supabase
        .from('zones')
        .select('*, agents:manager_id(id, name)')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (zone: { name: string; city?: string; areas: string[]; manager_id?: string; color?: string }) => {
      // REST API Equivalent: POST /rest/v1/zones
      // Sends a JSON payload in the request body to create a new resource.
      const { data, error } = await supabase.from('zones').insert(zone as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['zones'] }); toast.success('Zone created'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string;[key: string]: any }) => {
      // REST API Equivalent: PATCH or PUT /rest/v1/zones?id=eq.{id}
      // Modifies an existing resource by updating its state over the network.
      const { data, error } = await supabase.from('zones').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['zones'] }); toast.success('Zone updated'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ─── Team Queues ────────────────────────────────────
export function useTeamQueues(zoneId?: string) {
  return useQuery({
    queryKey: ['team-queues', zoneId],
    queryFn: async () => {
      let q = supabase.from('team_queues').select('*, zones(name), agents:owner_agent_id(id, name)').eq('is_active', true);
      if (zoneId) q = q.eq('zone_id', zoneId);
      const { data, error } = await q.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateTeamQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (queue: { zone_id: string; team_name: string; owner_agent_id?: string; member_ids?: string[]; dispatch_rule?: string }) => {
      const { data, error } = await supabase.from('team_queues').insert(queue as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team-queues'] }); toast.success('Queue created'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateTeamQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase.from('team_queues').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team-queues'] }); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ─── Handoffs ───────────────────────────────────────
export function useHandoffs(leadId?: string) {
  return useQuery({
    queryKey: ['handoffs', leadId],
    queryFn: async () => {
      let q = supabase.from('handoffs').select('*, from_agent:from_agent_id(name), to_agent:to_agent_id(name), zones(name)').order('created_at', { ascending: false });
      if (leadId) q = q.eq('lead_id', leadId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useCreateHandoff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (handoff: { lead_id: string; from_agent_id?: string; to_agent_id?: string; zone_id?: string; reason?: string }) => {
      const { data, error } = await supabase.from('handoffs').insert(handoff as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['handoffs'] }); toast.success('Handoff recorded'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ─── Escalations ────────────────────────────────────
export function useEscalations(status?: string) {
  return useQuery({
    queryKey: ['escalations', status],
    queryFn: async () => {
      let q = supabase.from('escalations').select('*, zones(name), raised:raised_by(name), assigned:assigned_to(name)').order('created_at', { ascending: false });
      if (status) q = q.eq('status', status);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useCreateEscalation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (esc: { type?: string; entity_type: string; entity_id: string; zone_id?: string; raised_by?: string; assigned_to?: string; priority?: string; description?: string }) => {
      const { data, error } = await supabase.from('escalations').insert(esc as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['escalations'] }); toast.success('Escalation raised'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateEscalation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase.from('escalations').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['escalations'] }); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ─── Zone Routing ───────────────────────────────────
export function useRouteLeadToZone() {
  return useMutation({
    mutationFn: async (location: string) => {
      const { data, error } = await supabase.rpc('route_lead_to_zone', { p_location: location });
      if (error) throw error;
      return data?.[0] || null;
    },
  });
}

// ─── DB Matching ────────────────────────────────────
export function useDbMatchBeds() {
  return useMutation({
    mutationFn: async (params: { location: string; budget: number; roomType?: string }) => {
      const { data, error } = await supabase.rpc('match_beds_for_lead', {
        p_location: params.location,
        p_budget: params.budget,
        p_room_type: params.roomType || null,
      });
      if (error) throw error;
      return data;
    },
  });
}
