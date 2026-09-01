import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    password?: string;
    username?: string;
  };

  if (!body.username || !body.password) {
    return apiError("Username and password are required.");
  }

  const { data, error } = await supabaseAdmin
    .from("app_users")
    .select("id, name, username")
    .eq("username", body.username)
    .eq("password", body.password)
    .single();

  if (error || !data) {
    return apiError("Invalid username or password.", 401);
  }

  return apiSuccess(data);
}
