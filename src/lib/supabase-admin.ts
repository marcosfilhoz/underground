import { createClient } from "@supabase/supabase-js";
import { normalizeSupabaseUrl } from "@/lib/supabase-url";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(
  normalizeSupabaseUrl(supabaseUrl),
  serviceRoleKey || "missing-service-role-key",
  {
    auth: {
      persistSession: false,
    },
  },
);
