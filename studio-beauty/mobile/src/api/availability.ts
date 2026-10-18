import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { qk } from './keys';

/** Slots for one local day, kept live via Realtime (availability_signals) + polling fallback. */
export function useAvailability(day: string | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!day) return;
    const channel = supabase
      .channel(`availability:${day}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'availability_signals', filter: `day=eq.${day}` },
        () => {
          void qc.invalidateQueries({ queryKey: qk.availability(day) });
          void qc.invalidateQueries({ queryKey: qk.calendarAll });
          void qc.invalidateQueries({ queryKey: qk.ownerAll }); // owner timeline (RLS lets only the owner read it)
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [day, qc]);

  return useQuery({
    queryKey: qk.availability(day ?? ''),
    enabled: !!day,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_availability', { p_date: day! });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30_000,
  });
}

export function useCalendar(from: string | undefined, to: string | undefined) {
  return useQuery({
    queryKey: qk.calendar(from ?? '', to ?? ''),
    enabled: !!from && !!to,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_calendar', { p_from: from!, p_to: to! });
      if (error) throw error;
      return new Map(data.map((d) => [d.day, d]));
    },
    staleTime: 30_000,
  });
}
