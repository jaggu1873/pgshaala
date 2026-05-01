import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { toast } from 'sonner';

export function useOwners() {
  return useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await db.from('owners').order('name').select();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (owner: any) => {
      const { data, error } = await db.from('owners').insert(owner);
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['owners'] }); toast.success('Owner added to system'); },
  });
}

export function useRooms(propertyId?: string) {
  return useQuery({
    queryKey: ['rooms', propertyId],
    queryFn: async () => {
      const { data, error } = await db.from('rooms').eq('property_id', propertyId).select();
      if (error) throw error;
      return data;
    },
  });
}

export function useAllRoomsWithDetails() {
  return useQuery({
    queryKey: ['rooms', 'all-details'],
    queryFn: async () => {
      const { data, error } = await db.from('rooms').select();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (room: any) => {
      return db.from('rooms').insert(room);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      return db.from('rooms').update(updates).eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  });
}

export function useBeds(roomId?: string) {
  return useQuery({
    queryKey: ['beds', roomId],
    queryFn: async () => {
      const { data, error } = await db.from('beds').eq('room_id', roomId).select();
      if (error) throw error;
      return data;
    },
  });
}

export function useAllBeds() {
  return useQuery({
    queryKey: ['beds', 'all'],
    queryFn: async () => {
      const { data, error } = await db.from('beds').select();
      if (error) throw error;
      return data;
    },
  });
}

export function usePropertiesWithOwners() {
  return useQuery({
    queryKey: ['properties', 'with-owners'],
    queryFn: async () => {
      const { data, error } = await db.from('properties').order('name').select();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await db.from('properties').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['properties'] }); },
  });
}

export function useConfirmRoomStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: any) => {
      const { data, error } = await db.from('room_status_log').insert(entry);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Status confirmed');
    },
  });
}
