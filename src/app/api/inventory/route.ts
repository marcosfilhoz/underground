import { apiError, apiSuccess } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/supabase-admin";

type InventoryBody = {
  assign_group?: boolean;
  description?: string;
  group_id?: number | string | null;
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
  group_id?: number | null;
  id: number;
  inventory_photos?: InventoryPhotoRow[];
  plate: string;
  value: number;
  vn: string;
};

function mapInventoryItem(item: InventoryRow) {
  return {
    description: item.description,
    group_id: item.group_id ?? null,
    id: item.id,
    photos:
      item.inventory_photos?.map((photo) => photo.image_data) ?? [],
    plate: item.plate,
    value: String(item.value ?? ""),
    vn: item.vn,
  };
}

function searchTerm(value: string) {
  return value.replace(/[%_,]/g, "").trim();
}

function groupIdValue(value: InventoryBody["group_id"]) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchTerm(searchParams.get("q") ?? "");
  const groupId = searchParams.get("groupId");
  const includeAll = searchParams.get("all") === "1";
  const includePhotos = searchParams.get("photos") !== "0";

  if (!query && !groupId && !includeAll) {
    return apiSuccess([]);
  }

  let itemsQuery = supabaseAdmin
    .from("inventory_items")
    .select(includePhotos ? "*, inventory_photos(image_data)" : "*")
    .order("id", { ascending: true });

  if (groupId === "unassigned") {
    itemsQuery = itemsQuery.is("group_id", null);
  } else if (groupId) {
    itemsQuery = itemsQuery.eq("group_id", Number(groupId));
  }

  if (query) {
    itemsQuery = itemsQuery.or(
      `description.ilike.%${query}%,vn.ilike.%${query}%,plate.ilike.%${query}%`,
    );
  }

  const { data, error } = await itemsQuery;

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess(((data ?? []) as unknown as InventoryRow[]).map(mapInventoryItem));
}

export async function POST(request: Request) {
  const body = (await request.json()) as InventoryBody;
  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .insert({
      description: body.description,
      group_id: groupIdValue(body.group_id),
      plate: body.plate,
      value: body.value || 0,
      vn: body.vn,
    })
    .select()
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  if (body.photos) {
    try {
      await savePhotos(data.id, body.photos);
    } catch (photoError) {
      return apiError((photoError as Error).message, 500);
    }
  }

  return apiSuccess(
    { ...mapInventoryItem(data), photos: body.photos ?? [] },
    201,
  );
}

export async function PUT(request: Request) {
  const body = (await request.json()) as InventoryBody;

  if (!body.id) {
    return apiError("Missing id.");
  }

  const { data, error } = await supabaseAdmin
    .from("inventory_items")
    .update(
      body.assign_group
        ? { group_id: groupIdValue(body.group_id) }
        : {
            description: body.description,
            group_id: groupIdValue(body.group_id),
            plate: body.plate,
            value: body.value || 0,
            vn: body.vn,
          },
    )
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return apiError(error.message, 500);
  }

  if (body.photos) {
    try {
      await savePhotos(body.id, body.photos);
    } catch (photoError) {
      return apiError((photoError as Error).message, 500);
    }
  }

  return apiSuccess({
    ...mapInventoryItem(data),
    photos: body.photos ?? [],
  });
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
