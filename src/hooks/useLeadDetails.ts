import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db';

export const useLeadDetails = (id?: string) =>
  useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data } = await db.from('leads').eq('id', id).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

export const useAllReminders = () =>
  useQuery({
    queryKey: ['reminders', 'all'],
    queryFn: async () => {
      const { data } = await db.from('reminders').select();
      return data || [];
    },
  });

export const useCompleteFollowUp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return db.from('reminders').delete().eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
};

export const useConversations = (leadId?: string) =>
  useQuery({
    queryKey: ['conversations', leadId],
    queryFn: async () => {
      const { data } = await db.from('conversations').eq('lead_id', leadId).select();
      return data || [];
    },
    enabled: !!leadId,
  });

export const useFollowUps = (leadId?: string) =>
  useQuery({
    queryKey: ['followups', leadId],
    queryFn: async () => {
      const { data } = await db.from('reminders').eq('lead_id', leadId).select();
      return data || [];
    },
    enabled: !!leadId,
  });

export const useCreateFollowUp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (followup: any) => {
      return db.from('reminders').insert(followup);
    },
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ['followups', variables.lead_id] }),
  });
};

export const useBulkUpdateLeads = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: any }) => {
      return Promise.all(ids.map(id => db.from('leads').update(updates).eq('id', id)));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};

export const useDeleteLeads = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      return Promise.all(ids.map(id => db.from('leads').delete().eq('id', id)));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
};
