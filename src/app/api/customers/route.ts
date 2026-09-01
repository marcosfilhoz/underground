import { createSimpleCrudHandlers } from "@/lib/simple-crud";

const handlers = createSimpleCrudHandlers("customers", (body) => ({
  city: body.city,
  name: body.name,
  phone: body.phone,
  state: body.state,
}));

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
