export function withErrorQuery(path: string, error: string): string {
  const params = new URLSearchParams({ error });
  return `${path}?${params.toString()}`;
}
