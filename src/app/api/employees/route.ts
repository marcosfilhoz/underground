import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createSimpleCrudHandlers } from "@/lib/simple-crud";

const handlers = createSimpleCrudHandlers("employees", (body) => ({
  name: body.name,
  phone: body.phone,
  ssn: body.ssn || null,
  itn: body.itn || null,
  ssn_photo: body.ssn_photo || null,
  itn_photo: body.itn_photo || null,
  group_id: body.group_id ? Number(body.group_id) : null,
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const query = (searchParams.get("q") ?? "").replace(/[%_,]/g, "").trim();

  if (!groupId && !query) {
    return apiSuccess([]);
  }

  let employeesQuery = supabaseAdmin
    .from("employees")
    .select("*")
    .order("id", { ascending: true });

  if (groupId === "unassigned") {
    employeesQuery = employeesQuery.is("group_id", null);
  } else if (groupId) {
    employeesQuery = employeesQuery.eq("group_id", Number(groupId));
  }

  if (query) {
    employeesQuery = employeesQuery.or(
      `name.ilike.%${query}%,phone.ilike.%${query}%,ssn.ilike.%${query}%,itn.ilike.%${query}%`,
    );
  }

  const { data, error } = await employeesQuery;

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess(data ?? []);
}

export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
