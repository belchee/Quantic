/**
 * Database types for supabase-js, mirroring supabase/migrations.
 * Regenerate from the live project with `npm run gen:types` (writes database.gen.ts)
 * and compare when the schema changes.
 */
export type AppRole = 'customer' | 'owner';
export type AppLanguage = 'sq' | 'mk' | 'en';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type SlotStatus = 'available' | 'limited' | 'full' | 'blocked' | 'unavailable';
export type DayStatus = 'closed' | 'blocked' | 'full' | 'unavailable' | 'available';

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: AppRole;
  language: AppLanguage;
  created_at: string;
  updated_at: string;
}

export type Service = {
  id: string;
  name_sq: string;
  name_mk: string;
  name_en: string;
  description_sq: string | null;
  description_mk: string | null;
  description_en: string | null;
  duration_minutes: number | null;
  price_mkd: number | null;
  active: boolean;
  sort: number;
  created_at: string;
  updated_at: string;
}

export type BusinessSettings = {
  id: boolean;
  open_time: string;
  close_time: string;
  slot_minutes: number;
  slot_capacity: number;
  booking_window_days: number;
  min_notice_minutes: number;
  cancel_hours: number;
  max_active_bookings: number;
  timezone: string;
  studio_name: string;
  address: string | null;
  contact_phone: string | null;
  instagram: string | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
}

export type WorkingHours = {
  weekday: number; // ISO 1 = Monday … 7 = Sunday
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  updated_at: string;
}

export type Block = {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
  created_by: string | null;
  created_at: string;
}

export type Booking = {
  id: string;
  customer_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  service_id: string | null;
  slot_start: string;
  slot_minutes: number;
  status: BookingStatus;
  created_by: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  notes: string | null;
  reminded_24h_at: string | null;
  reminded_2h_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AvailabilitySlot = {
  slot_start: string;
  local_time: string;
  capacity: number;
  remaining: number;
  status: SlotStatus;
}

export type CalendarDay = {
  day: string;
  status: DayStatus;
  available_slots: number;
}

export type OwnerBookingRow = {
  id: string;
  slot_start: string;
  local_date: string;
  local_time: string;
  status: BookingStatus;
  client_name: string;
  client_phone: string | null;
  is_guest: boolean;
  service_id: string | null;
  notes: string | null;
}

export type OwnerStats = {
  today_count: number;
  week_count: number;
  upcoming_count: number;
  no_shows_30d: number;
  cancellations_30d: number;
  completed_30d: number;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Update>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, never, Pick<Profile, 'full_name' | 'language'>>;
      services: Table<Service, Omit<Service, 'id' | 'created_at' | 'updated_at'> & { id?: string }>;
      business_settings: Table<BusinessSettings, never, Partial<Omit<BusinessSettings, 'id' | 'updated_at'>>>;
      working_hours: Table<WorkingHours, never, Partial<Pick<WorkingHours, 'open_time' | 'close_time' | 'is_closed'>>>;
      blocks: Table<Block, never, never>;
      bookings: Table<Booking, never, Pick<Booking, 'notes'>>;
      push_tokens: Table<{ token: string; user_id: string; platform: string; updated_at: string }, never, never>;
      availability_signals: Table<{ day: string; version: number; changed_at: string }, never, never>;
    };
    Views: Record<never, never>;
    Functions: {
      business_today: { Args: Record<never, never>; Returns: string };
      is_owner: { Args: Record<never, never>; Returns: boolean };
      get_availability: { Args: { p_date: string }; Returns: AvailabilitySlot[] };
      get_calendar: { Args: { p_from: string; p_to: string }; Returns: CalendarDay[] };
      create_booking: { Args: { p_slot_start: string; p_service_id: string; p_notes?: string | null }; Returns: Booking };
      cancel_booking: { Args: { p_booking_id: string }; Returns: Booking };
      owner_create_booking: {
        Args: {
          p_slot_start: string;
          p_service_id: string | null;
          p_customer_id?: string | null;
          p_guest_name?: string | null;
          p_guest_phone?: string | null;
          p_notes?: string | null;
        };
        Returns: Booking;
      };
      owner_set_booking_status: { Args: { p_booking_id: string; p_status: BookingStatus }; Returns: Booking };
      owner_create_block: {
        Args: {
          p_start_date: string;
          p_end_date: string;
          p_start_time?: string | null;
          p_end_time?: string | null;
          p_reason?: string | null;
        };
        Returns: number;
      };
      owner_stats: { Args: Record<never, never>; Returns: OwnerStats[] };
      owner_bookings: { Args: { p_from: string; p_to: string }; Returns: OwnerBookingRow[] };
      register_push_token: { Args: { p_token: string; p_platform?: string }; Returns: undefined };
      unregister_push_token: { Args: { p_token: string }; Returns: undefined };
    };
    Enums: {
      app_role: AppRole;
      app_language: AppLanguage;
      booking_status: BookingStatus;
    };
    CompositeTypes: Record<never, never>;
  };
}
