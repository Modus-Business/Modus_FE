export function getApiBaseUrl() {
  const value =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASEURL ||
    "";

  return value.replace(/\/+$/, "");
}
