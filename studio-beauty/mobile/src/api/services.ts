import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types/database';
import { qk } from './keys';

export function useServices(opts: { includeInactive?: boolean } = {}) {
  const all = !!opts.includeInactive;
  return useQuery({
    queryKey: qk.services(all),
    queryFn: async () => {
      let q = supabase.from('services').select('*').order('sort').order('created_at');
      if (!all) q = q.eq('active', true);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60_000,
  });
}

export type ServiceInput = Omit<Service, 'id' | 'created_at' | 'updated_at'>;

export function useSaveService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ServiceInput & { id?: string }) => {
      const { error } = id
        ? await supabase.from('services').update(input).eq('id', id)
        : await supabase.from('services').insert(input);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['services'] }),
  });
}
