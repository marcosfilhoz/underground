import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RowMapper = (body: Record<string, unknown>) => Record<string, unknown>;

export function createSimpleCrudHandlers(table: string, mapBody: RowMapper) {
  return {
    async DELETE(request: Request) {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
        return apiError("Missing id.");
      }

      const { error } = await supabaseAdmin.from(table).delete().eq("id", id);

      if (error) {
        return apiError(error.message, 500);
      }

      return apiSuccess({ id });
    },

    async GET() {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        return apiError(error.message, 500);
      }

      return apiSuccess(data ?? []);
    },

    async POST(request: Request) {
      const body = (await request.json()) as Record<string, unknown>;
      const payload = mapBody(body);
      const { data, error } = await supabaseAdmin
        .from(table)
        .insert(payload)
        .select()
        .single();

      if (error) {
        return apiError(error.message, 500);
      }

      return apiSuccess(data, 201);
    },

    async PUT(request: Request) {
      const body = (await request.json()) as Record<string, unknown>;
      const id = body.id;

      if (!id) {
        return apiError("Missing id.");
      }

      const payload = mapBody(body);
      const { data, error } = await supabaseAdmin
        .from(table)
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return apiError(error.message, 500);
      }

      return apiSuccess(data);
    },
  };
}
