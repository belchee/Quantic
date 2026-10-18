import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BusinessSettings, WorkingHours } from '@/types/database';
import { qk } from './keys';

export function useBusinessSettings() {
  return useQuery({
    queryKey: qk.settings,
    queryFn: async () => {
      const { data, error } = await supabase.from('business_settings').select('*').single();
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60_000,
  });
}

export function useWorkingHours() {
  return useQuery({
    queryKey: qk.workingHours,
    queryFn: async () => {
      const { data, error } = await supabase.from('working_hours').select('*').order('weekday');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60_000,
  });
}

/** "Today" in the studio's time zone (Europe/Skopje), from the server. */
export function useBusinessToday() {
  return useQuery({
    queryKey: qk.today,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('business_today');
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Omit<BusinessSettings, 'id' | 'updated_at'>>) => {
      const { error } = await supabase.from('business_settings').update(patch).eq('id', true);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.settings });
      void qc.invalidateQueries({ queryKey: qk.availabilityAll });
      void qc.invalidateQueries({ queryKey: qk.calendarAll });
    },
  });
}

export function useUpdateWorkingHours() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rows: Pick<WorkingHours, 'weekday' | 'open_time' | 'close_time' | 'is_closed'>[]) => {
      for (const r of rows) {
        const { error } = await supabase
          .from('working_hours')
          .update({ open_time: r.open_time, close_time: r.close_time, is_closed: r.is_closed })
          .eq('weekday', r.weekday);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.workingHours });
      void qc.invalidateQueries({ queryKey: qk.availabilityAll });
      void qc.invalidateQueries({ queryKey: qk.calendarAll });
    },
  });
}
