import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";

type InventoryBody = {
  description?: string;
  id?: number;
  photos?: string[];
  plate?: string;
  value?: string;
  vn?: string;
};

type InventoryPhotoRow = {
  image_data: string;
};

type InventoryRow = {
  description: string;
  id: number;
  inventory_photos?: InventoryPhotoRow[];
  plate: string;
  value: number;
  vn: string;
};

function mapInventoryItem(item: InventoryRow) {
  return {
    description: item.description,
    id: item.id,
    photos:
      item.inventory_photos?.map((photo) => photo.image_data) ?? [],
    plate: item.plate,
    value: String(item.value ?? ""),
    vn: item.vn,
  };
}

async function savePhotos(inventoryId: number, photos: string[]) {
  await supabaseAdmin
    .from("inventory_photos")
    .delete()
    .eq("inventory_id", inventoryId);

  if (photos.length === 0) {
    return;
  }

  const { error } = await supabaseAdmin.from("inventory_photos").insert(
    photos.map((photo) => ({
      image_data: photo,
      inventory_id: inventoryId,
    })),
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .select("*, inventory_photos(image_data)")
    .order("id", { ascending: true });

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess(((data ?? []) as InventoryRow[]).map(mapInventoryItem));
}

export async function POST(request: Request) {
  const body = (await request.json()) as InventoryBody;
  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .insert({
      description: body.description,
      plate: body.plate,
      value: body.value || 0,
      vn: body.vn,
    })
    .select()
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  try {
    await savePhotos(data.id, body.photos ?? []);
  } catch (photoError) {
    return apiError((photoError as Error).message, 500);
  }

  return apiSuccess({ ...mapInventoryItem(data), photos: body.photos ?? [] }, 201);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as InventoryBody;

  if (!body.id) {
    return apiError("Missing id.");
  }

  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .update({
      description: body.description,
      plate: body.plate,
      value: body.value || 0,
      vn: body.vn,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  try {
    await savePhotos(body.id, body.photos ?? []);
  } catch (photoError) {
    return apiError((photoError as Error).message, 500);
  }

  return apiSuccess({ ...mapInventoryItem(data), photos: body.photos ?? [] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return apiError("Missing id.");
  }

  const { error } = await supabaseAdmin
    .from("inventory_items")
    .delete()
    .eq("id", id);

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ id });
}
