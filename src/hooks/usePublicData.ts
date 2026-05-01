import { useQuery, useMutation } from '@tanstack/react-query';
import { db } from '@/lib/db';

export const usePublicProperties = (filters?: { city?: string; limit?: number }) =>
  useQuery({
    queryKey: ['public-properties', filters],
    queryFn: async () => {
      const { data, error } = await db.from('properties').select();
      if (error) throw error;
      let results = data || [];
      if (filters?.city) results = results.filter((p: any) => p.city === filters.city);
      if (filters?.limit) results = results.slice(0, filters.limit);
      return results;
    },
  });

export const usePropertyDetails = (id?: string) =>
  useQuery({
    queryKey: ['property-detail', id],
    queryFn: async () => {
      const { data } = await db.from('properties').eq('id', id).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

export const usePublicProperty = (id?: string) =>
  useQuery({
    queryKey: ['public-property', id],
    queryFn: async () => {
      const { data } = await db.from('properties').eq('id', id).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

export const useSubmitLead = () =>
  useMutation({
    mutationFn: async (lead: any) => {
      const { data, error } = await db.from('leads').insert(lead);
      if (error) throw error;
      return data;
    },
  });

export const useAvailableCities = () =>
  useQuery({
    queryKey: ['available-cities'],
    queryFn: async () => {
      const { data } = await db.from('properties').select();
      const cities = Array.from(new Set((data || []).map((p: any) => p.city).filter(Boolean)));
      return cities;
    },
  });

export const useAvailableAreas = (city?: string) =>
  useQuery({
    queryKey: ['available-areas', city],
    queryFn: async () => {
      const { data } = await db.from('properties').select();
      let results = data || [];
      if (city) results = results.filter((p: any) => p.city === city);
      const areas = Array.from(new Set(results.map((p: any) => p.area).filter(Boolean)));
      return areas;
    },
    enabled: !!city,
  });

export const useLandmarks = (propertyId?: string) =>
  useQuery({
    queryKey: ['landmarks', propertyId],
    queryFn: async () => {
      const { data } = await db.from('landmarks').eq('property_id', propertyId).select();
      return data || [];
    },
    enabled: !!propertyId,
  });

export const useSendMessage = () =>
  useMutation({
    mutationFn: async (message: any) => {
      return db.from('conversations').insert(message);
    },
  });

export const useCreateReservation = () =>
  useMutation({
    mutationFn: async (res: any) => {
      return db.from('reservations').insert(res);
    },
  });

export const useConfirmReservation = () =>
  useMutation({
    mutationFn: async (data: { reservation_id: string; payment_reference: string }) => {
      return db.from('reservations').update({ status: 'confirmed', payment_reference: data.payment_reference }).eq('id', data.reservation_id);
    },
  });

export const useSimilarProperties = (propertyId?: string) =>
  useQuery({
    queryKey: ['similar-properties', propertyId],
    queryFn: async () => {
      const { data } = await db.from('properties').select();
      return (data || []).slice(0, 3);
    },
    enabled: !!propertyId,
  });

export const useRequestVisit = () =>
  useMutation({
    mutationFn: async (visit: any) => {
      return db.from('visits').insert(visit);
    },
  });

export type PropertyFilters = {
  city?: string;
  area?: string;
  minBudget?: number;
  maxBudget?: number;
  roomType?: string;
};
