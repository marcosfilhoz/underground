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

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
