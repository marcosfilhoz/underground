export function normalizeSupabaseUrl(url: string | undefined) {
  const fallbackUrl = "https://example.supabase.co";

  if (!url) {
    return fallbackUrl;
  }

  const cleanUrl = url.trim().replace(/\/+$/, "");
  const pathIndex = cleanUrl.search(/\/(rest|auth|storage)\/v\d+/);

  if (pathIndex === -1) {
    return cleanUrl;
  }

  return cleanUrl.slice(0, pathIndex);
}
