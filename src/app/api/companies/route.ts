import { createSimpleCrudHandlers } from "@/lib/simple-crud";

const handlers = createSimpleCrudHandlers("companies", (body) => ({
  city: body.city,
  name: body.name,
  number: body.number,
  state: body.state,
  street: body.street,
}));

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
