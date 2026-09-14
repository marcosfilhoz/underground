import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";

const settingsId = 1;

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("app_settings")
    .select("logo")
    .eq("id", settingsId)
    .maybeSingle();

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ logo: data?.logo ?? "" });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { logo?: string };
  const { data, error } = await supabaseAdmin
    .from("app_settings")
    .upsert({
      id: settingsId,
      logo: body.logo || null,
      updated_at: new Date().toISOString(),
    })
    .select("logo")
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ logo: data?.logo ?? "" });
}
