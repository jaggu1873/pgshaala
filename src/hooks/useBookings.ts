import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db';

export const useBookings = () =>
  useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await db.from('bookings').select();
      if (error) throw error;
      return data || [];
    },
  });

export const useBookingStats = () =>
  useQuery({
    queryKey: ['booking-stats'],
    queryFn: async () => {
      return {
        revenue: 450000,
        pendingRevenue: 120000,
        confirmed: 8,
        checkedIn: 12,
      };
    },
  });

export const useBookingsByLead = (leadId?: string) =>
  useQuery({
    queryKey: ['bookings', 'lead', leadId],
    queryFn: async () => {
      const { data } = await db.from('bookings').eq('lead_id', leadId).select();
      return data || [];
    },
    enabled: !!leadId,
  });

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: any) => {
      return db.from('bookings').insert(booking);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
};

export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      return db.from('bookings').update(updates).eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
};

export const usePayments = () =>
  useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data } = await db.from('payments').select();
      return data || [];
    },
  });
