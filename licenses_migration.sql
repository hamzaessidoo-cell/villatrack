
-- Device activations are anonymous, so allow redeemed rows to be identified by device_id.
alter table public.vt_activation_codes drop constraint if exists vt_activation_codes_redemption_check;
alter table public.vt_activation_codes add constraint vt_activation_codes_redemption_check check (((status = 'redeemed' and ((redeemed_by is not null and redeemed_at is not null) or (device_id is not null and activated_at is not null))) or (status <> 'redeemed' and redeemed_by is null and redeemed_at is null)));

-- Public RPCs are deliberately limited to hash-based activation/heartbeat only.
revoke execute on function public.vt_admin_create_activation_code(text,text,text,text,text,timestamptz,integer) from anon, public;
revoke execute on function public.vt_admin_list_activation_codes() from anon, public;
revoke execute on function public.vt_admin_revoke_activation_code(text) from anon, public;
revoke execute on function public.vt_is_platform_admin(uuid) from anon, authenticated, public;
revoke execute on function public.vt_activate_license(text,text) from authenticated;
revoke execute on function public.vt_touch_license(text,text) from authenticated;
grant execute on function public.vt_admin_create_activation_code(text,text,text,text,text,timestamptz,integer) to authenticated;
grant execute on function public.vt_admin_list_activation_codes() to authenticated;
grant execute on function public.vt_admin_revoke_activation_code(text) to authenticated;
grant execute on function public.vt_activate_license(text,text) to anon;
grant execute on function public.vt_touch_license(text,text) to anon;
