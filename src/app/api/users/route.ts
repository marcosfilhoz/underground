import { createSimpleCrudHandlers } from "@/lib/simple-crud";

const handlers = createSimpleCrudHandlers("app_users", (body) => ({
  name: body.name,
  password: body.password,
  username: body.username,
}));

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
