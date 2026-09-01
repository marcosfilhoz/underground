import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    password?: string;
    username?: string;
  };
  const username = body.username?.trim();
  const password = body.password?.trim();

  if (!username || !password) {
    return apiError("Username and password are required.");
  }

  const { data, error } = await supabaseAdmin
    .from("app_users")
    .select("id, name, username")
    .eq("username", username)
    .eq("password", password)
    .maybeSingle();

  if (error) {
    return apiError(error.message, 500);
  }

  if (!data) {
    return apiError("Invalid username or password.", 401);
  }

  return apiSuccess(data);
}
