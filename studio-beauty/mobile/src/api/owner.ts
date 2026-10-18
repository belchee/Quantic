import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Block, BookingStatus } from '@/types/database';
import { invalidateBookingData } from './bookings';
import { qk } from './keys';

/** Bookings with client details between two local dates (inclusive). */
export function useOwnerBookings(from: string | undefined, to: string | undefined) {
  return useQuery({
    queryKey: qk.ownerRange(from ?? '', to ?? ''),
    enabled: !!from && !!to,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('owner_bookings', { p_from: from!, p_to: to! });
      if (error) throw error;
      return data;
    },
    refetchInterval: 60_000,
  });
}

export function useOwnerStats() {
  return useQuery({
    queryKey: qk.ownerStats,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('owner_stats');
      if (error) throw error;
      return data[0] ?? null;
    },
    refetchInterval: 120_000,
  });
}

export function useSetBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; status: Exclude<BookingStatus, 'cancelled'> }) => {
      const { error } = await supabase.rpc('owner_set_booking_status', { p_booking_id: args.id, p_status: args.status });
      if (error) throw error;
    },
    onSettled: () => invalidateBookingData(qc),
  });
}

export function useOwnerCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      slotStart: string;
      serviceId: string | null;
      customerId?: string | null;
      guestName?: string | null;
      guestPhone?: string | null;
      notes?: string | null;
    }) => {
      const { data, error } = await supabase.rpc('owner_create_booking', {
        p_slot_start: args.slotStart,
        p_service_id: args.serviceId,
        p_customer_id: args.customerId ?? null,
        p_guest_name: args.guestName ?? null,
        p_guest_phone: args.guestPhone ?? null,
        p_notes: args.notes ?? null,
      });
      if (error) throw error;
      return data;
    },
    onSettled: () => invalidateBookingData(qc),
  });
}

export function useSearchClients(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: qk.clients(q),
    enabled: q.length >= 2,
    queryFn: async () => {
      const digits = q.replace(/\D/g, '');
      const safe = q.replace(/[%,()]/g, ' ');
      const filter = digits.length >= 3 ? `full_name.ilike.%${safe}%,phone.ilike.%${digits}%` : `full_name.ilike.%${safe}%`;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .eq('role', 'customer')
        .or(filter)
        .order('full_name')
        .limit(20);
      if (error) throw error;
      return data;
    },
  });
}

export type BlockWithLocal = Block & { local_date: string; local_range: string };

export function useBlocks() {
  return useQuery({
    queryKey: qk.blocks,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocks')
        .select('*, local_date, local_range')
        .gte('ends_at', new Date().toISOString())
        .order('starts_at')
        .overrideTypes<BlockWithLocal[], { merge: false }>();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      startDate: string;
      endDate: string;
      startTime?: string | null;
      endTime?: string | null;
      reason?: string | null;
    }) => {
      const { data, error } = await supabase.rpc('owner_create_block', {
        p_start_date: args.startDate,
        p_end_date: args.endDate,
        p_start_time: args.startTime ?? null,
        p_end_time: args.endTime ?? null,
        p_reason: args.reason ?? null,
      });
      if (error) throw error;
      return data; // affected bookings
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: qk.blocks });
      invalidateBookingData(qc);
    },
  });
}

export function useDeleteBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blocks').delete().eq('id', id);
      if (error) throw error;
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: qk.blocks });
      invalidateBookingData(qc);
    },
  });
}
