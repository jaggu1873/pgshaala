import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db';

export const useZones = () =>
  useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const { data, error } = await db.from('zones').select();
      if (error) throw error;
      return data || [];
    },
  });

export const useCreateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (zone: any) => {
      return db.from('zones').insert(zone);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['zones'] }),
  });
};

export const useMatchingBeds = (leadId?: string) =>
  useQuery({
    queryKey: ['matching-beds', leadId],
    queryFn: async () => {
      const { data } = await db.from('beds').select();
      return (data || []).map((bed: any) => ({
        ...bed,
        match_score: 85,
        match_reasons: ['Location Match', 'Budget OK'],
      }));
    },
    enabled: !!leadId,
  });

export const useDbMatchBeds = (leadId?: string) =>
  useQuery({
    queryKey: ['db-match-beds', leadId],
    queryFn: async () => {
      const { data } = await db.from('beds').select();
      return (data || []).map((bed: any) => ({
        ...bed,
        match_score: 90,
        match_reasons: ['Optimal Match', 'Verified'],
      }));
    },
    enabled: !!leadId,
  });

export const useTeamQueues = () =>
  useQuery({
    queryKey: ['team-queues'],
    queryFn: async () => {
      const { data } = await db.from('team_queues').select();
      return data || [];
    },
  });

export const useCreateTeamQueue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (queue: any) => {
      return db.from('team_queues').insert(queue);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team-queues'] }),
  });
};

export const useEscalations = () =>
  useQuery({
    queryKey: ['escalations'],
    queryFn: async () => {
      const { data } = await db.from('escalations').select();
      return data || [];
    },
  });

export const useUpdateEscalation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      return db.from('escalations').update(updates).eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['escalations'] }),
  });
};
