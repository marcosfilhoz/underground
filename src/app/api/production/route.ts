import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ProductionExpenseBody = {
  expenseTypeId: string;
  value: string;
};

type ProductionBody = {
  companyId?: string;
  costFt?: string;
  costHh?: string;
  customerId?: string;
  date?: string;
  expenses?: ProductionExpenseBody[];
  ft?: string;
  group?: string;
  hh17x30?: string;
  hh24x36?: string;
  id?: number;
  valueFt?: string;
  valueHh?: string;
};

type ProductionExpenseRow = {
  expense_type_id: number;
  value: number;
};

type ProductionRow = {
  company_id: number;
  cost_ft: number;
  cost_hh: number;
  customer_id: number;
  ft: number;
  group_name: string;
  hh_17x30: number;
  hh_24x36: number;
  id: number;
  number: number;
  production_date: string;
  production_expenses?: ProductionExpenseRow[];
  value_ft: number;
  value_hh: number;
};

function toIsoDate(value?: string) {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [month, day, year] = value.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function toUsDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function mapProductionRecord(record: ProductionRow) {
  return {
    companyId: String(record.company_id),
    costFt: String(record.cost_ft ?? ""),
    costHh: String(record.cost_hh ?? ""),
    customerId: String(record.customer_id),
    date: toUsDate(record.production_date),
    expenses:
      record.production_expenses?.map((expense) => ({
        expenseTypeId: String(expense.expense_type_id),
        value: String(expense.value ?? ""),
      })) ?? [],
    ft: String(record.ft ?? ""),
    group: record.group_name,
    hh17x30: String(record.hh_17x30 ?? ""),
    hh24x36: String(record.hh_24x36 ?? ""),
    id: record.id,
    number: record.number,
    valueFt: String(record.value_ft ?? ""),
    valueHh: String(record.value_hh ?? ""),
  };
}

async function saveExpenses(
  productionId: number,
  expenses: ProductionExpenseBody[],
) {
  await supabaseAdmin
    .from("production_expenses")
    .delete()
    .eq("production_id", productionId);

  if (expenses.length === 0) {
    return;
  }

  const { error } = await supabaseAdmin.from("production_expenses").insert(
    expenses.map((expense) => ({
      expense_type_id: Number(expense.expenseTypeId),
      production_id: productionId,
      value: expense.value || 0,
    })),
  );

  if (error) {
    throw new Error(error.message);
  }
}

function mapProductionPayload(body: ProductionBody) {
  return {
    company_id: Number(body.companyId),
    cost_ft: body.costFt || 0,
    cost_hh: body.costHh || 0,
    customer_id: Number(body.customerId),
    ft: body.ft || 0,
    group_name: body.group,
    hh_17x30: body.hh17x30 || 0,
    hh_24x36: body.hh24x36 || 0,
    production_date: toIsoDate(body.date),
    value_ft: body.valueFt || 0,
    value_hh: body.valueHh || 0,
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("production_records")
    .select("*, production_expenses(expense_type_id, value)")
    .order("number", { ascending: true });

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess(((data ?? []) as ProductionRow[]).map(mapProductionRecord));
}

export async function POST(request: Request) {
  const body = (await request.json()) as ProductionBody;
  const { data, error } = await supabaseAdmin
    .from("production_records")
    .insert(mapProductionPayload(body))
    .select()
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  try {
    await saveExpenses(data.id, body.expenses ?? []);
  } catch (expenseError) {
    return apiError((expenseError as Error).message, 500);
  }

  return apiSuccess(
    mapProductionRecord({
      ...(data as ProductionRow),
      production_expenses: (body.expenses ?? []).map((expense) => ({
        expense_type_id: Number(expense.expenseTypeId),
        value: Number(expense.value || 0),
      })),
    }),
    201,
  );
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ProductionBody;

  if (!body.id) {
    return apiError("Missing id.");
  }

  const { data, error } = await supabaseAdmin
    .from("production_records")
    .update(mapProductionPayload(body))
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  try {
    await saveExpenses(body.id, body.expenses ?? []);
  } catch (expenseError) {
    return apiError((expenseError as Error).message, 500);
  }

  return apiSuccess(
    mapProductionRecord({
      ...(data as ProductionRow),
      production_expenses: (body.expenses ?? []).map((expense) => ({
        expense_type_id: Number(expense.expenseTypeId),
        value: Number(expense.value || 0),
      })),
    }),
  );
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return apiError("Missing id.");
  }

  const { error } = await supabaseAdmin
    .from("production_records")
    .delete()
    .eq("id", id);

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ id });
}
