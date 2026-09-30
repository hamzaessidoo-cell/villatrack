import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const runtime = window.__VILLATRACK_ENV__ || {};
const supabaseUrl = runtime.SUPABASE_URL || '';
const supabaseAnonKey = runtime.SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function listVillas() {
  if (!supabase) return { data: null, error: null };
  return supabase.from('villas').select('*').order('created_at', { ascending: false });
}
export async function saveVilla(villa, id) {
  if (!supabase) return { data: null, error: null };
  return id ? supabase.from('villas').update(villa).eq('id', id).select().single() : supabase.from('villas').insert(villa).select().single();
}
export async function removeVilla(id) {
  if (!supabase) return { error: null };
  return supabase.from('villas').delete().eq('id', id);
}
export async function listBookings() {
  if (!supabase) return { data: null, error: null };
  return supabase.from('bookings').select('*, villas(name)').order('check_in', { ascending: false });
}
export async function findOverlap(villaId, checkIn, checkOut, excludeId = null) {
  if (!supabase) return { data: [], error: null };
  let query = supabase.from('bookings').select('id').eq('villa_id', villaId).neq('status', 'cancelled').lt('check_in', checkOut).gt('check_out', checkIn);
  if (excludeId) query = query.neq('id', excludeId);
  return query;
}
export async function saveBooking(booking, id) {
  if (!supabase) return { data: null, error: null };
  return id ? supabase.from('bookings').update(booking).eq('id', id).select().single() : supabase.from('bookings').insert(booking).select().single();
}
export async function removeBooking(id) {
  if (!supabase) return { error: null };
  return supabase.from('bookings').delete().eq('id', id);
}
export async function hashLicenseCode(raw) {
  const bytes = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
}
export async function activateLicense(raw, deviceId) {
  if (!supabase) return { data: [{ ok: true, license_status: 'demo', message: 'offline_demo' }], error: null };
  return supabase.rpc('vt_activate_license', { p_code_hash: await hashLicenseCode(raw), p_device_id: deviceId });
}
export async function touchLicense(raw, deviceId) {
  if (!supabase) return { data: [{ ok: true, license_status: 'demo', message: 'offline_demo' }], error: null };
  return supabase.rpc('vt_touch_license', { p_code_hash: await hashLicenseCode(raw), p_device_id: deviceId });
}
