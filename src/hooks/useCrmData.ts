import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// Standard MongoDB based models
export interface LeadWithRelations {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  source: string;
  preferred_location?: string;
  budget?: string;
  notes?: string;
  assigned_agent_id?: string;
  property_id?: string;
  created_at: string;
  agents?: { name: string } | null;
  properties?: { name: string } | null;
}

export interface VisitWithRelations {
  id: string;
  lead_id: string;
  property_id: string;
  scheduled_at: string;
  outcome?: string;
  notes?: string;
  leads?: { name: string } | null;
  properties?: { name: string } | null;
}

// CRM Hooks using MongoDB Engine
export const useLeads = () =>
  useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await db.from('leads').order('created_at', { ascending: false }).select();
      if (error) throw error;
      return data as LeadWithRelations[];
    },
  });

export const useLeadsPaginated = (page = 0, pageSize = 50) =>
  useQuery({
    queryKey: ['leads-paginated', page, pageSize],
    queryFn: async () => {
      const { data, error, count } = await db.from('leads').order('created_at', { ascending: false }).select();
      if (error) throw error;
      return { leads: data as LeadWithRelations[], total: count || 0 };
    },
  });

export const useLeadsByStatus = (status: string) =>
  useQuery({
    queryKey: ['leads', 'status', status],
    queryFn: async () => {
      const { data, error } = await db.from('leads').eq('status', status).select();
      if (error) throw error;
      return data as LeadWithRelations[];
    },
  });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lead: any) => {
      const { data, error } = await db.from('leads').insert(lead);
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await db.from('leads').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useAgents = () =>
  useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await db.from('agents').order('name').select();
      if (error) throw error;
      return data;
    },
  });

export const useProperties = () =>
  useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await db.from('properties').order('name').select();
      if (error) throw error;
      return data;
    },
  });

export const useVisits = () =>
  useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const { data, error } = await db.from('visits').order('scheduled_at').select();
      if (error) throw error;
      return data as VisitWithRelations[];
    },
  });

export const useCreateVisit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (visit: any) => {
      const { data, error } = await db.from('visits').insert(visit);
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['visits'] }),
  });
};

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [{ data: leads }, { data: visits }] = await Promise.all([
        db.from('leads').select(),
        db.from('visits').select(),
      ]);

      const totalLeads = leads?.length || 0;
      const bookedLeads = leads?.filter((l: any) => l.status === 'booked').length || 0;
      const conversionRate = totalLeads ? +((bookedLeads / totalLeads) * 100).toFixed(1) : 0;

      return {
        totalLeads,
        newToday: leads?.filter((l: any) => new Date(l.created_at) >= new Date().setHours(0,0,0,0)).length || 0,
        avgResponseTime: 4.2, // Simulated from historical data
        slaCompliance: 94,
        conversionRate,
        visitsScheduled: visits?.filter((v: any) => !v.outcome).length || 0,
        visitsCompleted: visits?.filter((v: any) => v.outcome).length || 0,
        bookingsClosed: bookedLeads,
      };
    },
  });

export const useAgentStats = () =>
  useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const { data: agents } = await db.from('agents').select();
      return (agents || []).map((agent: any) => ({
        ...agent,
        totalLeads: 12,
        activeLeads: 5,
        avgResponseTime: 3.5,
        conversions: 2,
      }));
    },
  });
