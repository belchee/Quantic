import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Booking, Service } from '@/types/database';
import { qk } from './keys';

export type BookingWithDetails = Booking & {
  local_date: string;
  local_time: string;
  service: Pick<Service, 'id' | 'name_sq' | 'name_mk' | 'name_en' | 'price_mkd'> | null;
};

const SELECT = '*, local_date, local_time, service:services(id, name_sq, name_mk, name_en, price_mkd)';

export function useMyBookings(userId: string | undefined) {
  return useQuery({
    queryKey: qk.myBookings,
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(SELECT)
        .eq('customer_id', userId!)
        .order('slot_start', { ascending: false })
        .limit(200)
        .overrideTypes<BookingWithDetails[], { merge: false }>();
      if (error) throw error;
      return data;
    },
  });
}

function invalidateBookingData(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: qk.myBookings });
  void qc.invalidateQueries({ queryKey: qk.availabilityAll });
  void qc.invalidateQueries({ queryKey: qk.calendarAll });
  void qc.invalidateQueries({ queryKey: qk.ownerAll });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { slotStart: string; serviceId: string; notes?: string }) => {
      const { data, error } = await supabase.rpc('create_booking', {
        p_slot_start: args.slotStart,
        p_service_id: args.serviceId,
        p_notes: args.notes ?? null,
      });
      if (error) throw error;
      return data;
    },
    onSettled: () => invalidateBookingData(qc),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase.rpc('cancel_booking', { p_booking_id: bookingId });
      if (error) throw error;
      return data;
    },
    onSettled: () => invalidateBookingData(qc),
  });
}

export { invalidateBookingData };
