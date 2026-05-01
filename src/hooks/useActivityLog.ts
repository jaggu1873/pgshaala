import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';

export const useActivityLog = (leadId: string | undefined) =>
  useQuery({
    queryKey: ['activity-log', leadId],
    enabled: !!leadId,
    queryFn: async () => {
      const { data, error } = await db
        .from('activity_log')
        .eq('lead_id', leadId!)
        .order('created_at', { ascending: false })
        .select();
      if (error) throw error;
      return data || [];
    },
  });
